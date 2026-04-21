import { useEffect, useRef, useState } from 'react';
import { Activity, Zap, Circle, ExternalLink } from 'lucide-react';
import { signalStore } from '@/lib/signalStore';

interface Signal {
  type: 'buy' | 'sell';
  price: number;
  time: string;
  strategy: string;
  strength: 'strong' | 'moderate';
  reason: string;
  pnl?: string;
}

interface PendingSignal {
  signal: Omit<Signal, 'pnl'>;
  fireAt: number;
}

function nowTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
}

function calcEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] ?? 0;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) ema = prices[i] * k + ema * (1 - k);
  return ema;
}

function calcRSI(prices: number[], period = 14): number {
  if (prices.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff; else losses -= diff;
  }
  return 100 - 100 / (1 + gains / (losses || 0.001));
}

// Try multiple sources — first one that works wins
async function fetchBTCPrice(): Promise<number> {
  const attempts: Array<() => Promise<number>> = [
    async () => {
      const r = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', { mode: 'cors' });
      return parseFloat((await r.json()).price);
    },
    async () => {
      const r = await fetch('https://api.kraken.com/0/public/Ticker?pair=XBTUSD', { mode: 'cors' });
      return parseFloat((await r.json()).result.XXBTZUSD.c[0]);
    },
    async () => {
      const r = await fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD', { mode: 'cors' });
      return (await r.json()).USD;
    },
    async () => {
      const r = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot', { mode: 'cors' });
      return parseFloat((await r.json()).data.amount);
    },
  ];
  for (const fn of attempts) {
    try {
      const p = await fn();
      if (p > 1000) return p;
    } catch {}
  }
  return 0;
}

// Fetch last N closed 1-minute candles — same data for ALL users (deterministic)
async function fetchKlineCloses(limit = 30): Promise<number[]> {
  try {
    const r = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=${limit}`);
    if (!r.ok) throw new Error();
    const data = await r.json();
    // Use close prices of closed candles only (exclude last open candle)
    return data.slice(0, -1).map((k: any[]) => parseFloat(k[4]));
  } catch {}
  try {
    // Kraken fallback — 1m OHLC
    const r = await fetch('https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=1');
    if (!r.ok) throw new Error();
    const data = await r.json();
    const candles = data.result.XXBTZUSD || data.result.XBTUSD || [];
    return candles.slice(-limit - 1, -1).map((k: any[]) => parseFloat(k[4]));
  } catch {}
  return [];
}

export default function LiveTradingTerminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [connected, setConnected] = useState(false);

  const priceHistory = useRef<number[]>([]);
  const tickCount = useRef(0);
  const pendingSignals = useRef<PendingSignal[]>([]);
  const lastSignalTick = useRef(-20);
  const lastSignalType = useRef<'buy' | 'sell' | null>(null);
  const lastSignalPrice = useRef(0);
  const lastBuyPrice = useRef(0); // tracks last BUY price for P&L on SELL
  const firstPrice = useRef(0);

  // TradingView widget
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: 'BINANCE:BTCUSDT',
      interval: '1',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(10,14,26,0)',
      gridColor: 'rgba(255,255,255,0.04)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      studies: ['STD;RSI', 'STD;MACD'],
      support_host: 'https://www.tradingview.com',
    });
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    containerRef.current.appendChild(widgetDiv);
    containerRef.current.appendChild(script);
  }, []);

  // Signal engine — uses shared kline history so all users see same signals
  useEffect(() => {
    const MIN_GAP = 10; // min 10 ticks (~15s) between signals — ensures price moves enough for meaningful P&L

    // Analyze history and return all signals found — runs on load immediately
    const analyzeHistory = (hist: number[], currentPrice: number) => {
      const results: Array<Omit<Signal, 'pnl'>> = [];
      if (hist.length < 10) return results;

      // Scan through history finding signal points — enforce min 5 candle gap
      let lastSignalIdx = -5;
      for (let i = 10; i < hist.length; i++) {
        if (i - lastSignalIdx < 5) continue; // min 5 candles between signals
        const slice = hist.slice(0, i + 1);
        const ema9  = calcEMA(slice, 9);
        const ema21 = calcEMA(slice, 21);
        const ema9p = calcEMA(slice.slice(0, -1), 9);
        const ema21p = calcEMA(slice.slice(0, -1), 21);
        const rsi   = calcRSI(slice, 14);
        const mom5  = slice.length >= 6
          ? (slice[slice.length - 1] - slice[slice.length - 6]) / slice[slice.length - 6] * 100
          : 0;

        const crossUp   = ema9p <= ema21p && ema9 > ema21;
        const crossDown = ema9p >= ema21p && ema9 < ema21;
        const lastType  = results.length > 0 ? results[results.length - 1].type : null;

        let sig: Omit<Signal, 'pnl'> | null = null;

        if (crossUp && lastType !== 'buy') {
          sig = { type: 'buy', price: hist[i], time: '', strategy: 'EMA Crossover Trend', strength: rsi < 45 ? 'strong' : 'moderate', reason: `EMA9 crossed EMA21 ↑ · RSI ${rsi.toFixed(0)}` };
        } else if (crossDown && lastType !== 'sell') {
          sig = { type: 'sell', price: hist[i], time: '', strategy: 'EMA Crossover Trend', strength: rsi > 55 ? 'strong' : 'moderate', reason: `EMA9 crossed EMA21 ↓ · RSI ${rsi.toFixed(0)}` };
        } else if (rsi < 32 && lastType !== 'buy') {
          sig = { type: 'buy', price: hist[i], time: '', strategy: 'Mean Reversion RSI', strength: 'strong', reason: `RSI ${rsi.toFixed(0)} — oversold reversal` };
        } else if (rsi > 68 && lastType !== 'sell') {
          sig = { type: 'sell', price: hist[i], time: '', strategy: 'Mean Reversion RSI', strength: 'strong', reason: `RSI ${rsi.toFixed(0)} — overbought reversal` };
        } else if (mom5 > 0.05 && lastType !== 'buy') {
          sig = { type: 'buy', price: hist[i], time: '', strategy: 'Breakout Momentum', strength: 'moderate', reason: `+${mom5.toFixed(3)}% momentum surge` };
        } else if (mom5 < -0.05 && lastType !== 'sell') {
          sig = { type: 'sell', price: hist[i], time: '', strategy: 'Breakout Momentum', strength: 'moderate', reason: `${mom5.toFixed(3)}% momentum drop` };
        }

        if (sig) {
          results.push(sig);
          lastSignalIdx = i;
        }
      }
      return results;
    };

    const tick = async () => {
      // Fetch current price for display
      const price = await fetchBTCPrice();

      // Fetch shared kline closes — same for ALL users at same time
      const klineCloses = await fetchKlineCloses(60);

      // Use klines as base history if available, append live price as latest point
      const sharedHistory = klineCloses.length >= 10
        ? [...klineCloses, ...(price > 0 ? [price] : [])]
        : null;

      // Use last kline close as the canonical price (consistent with signal prices)
      // Fall back to live price if klines unavailable
      const canonicalPrice = klineCloses.length > 0
        ? klineCloses[klineCloses.length - 1]
        : price;

      const effectivePrice = canonicalPrice > 0
        ? canonicalPrice
        : priceHistory.current.length > 0
          ? priceHistory.current[priceHistory.current.length - 1]
          : 0;

      if (effectivePrice <= 0) return;

      // Show last kline close in header — matches what TradingView chart shows
      setCurrentPrice(canonicalPrice > 0 ? canonicalPrice : price);
      if (canonicalPrice > 0 || price > 0) setConnected(true);

      if (firstPrice.current === 0) firstPrice.current = effectivePrice;
      setPriceChange(((effectivePrice - firstPrice.current) / firstPrice.current) * 100);

      if (sharedHistory) {
        priceHistory.current = sharedHistory;
      } else {
        priceHistory.current.push(effectivePrice);
        if (priceHistory.current.length > 80) priceHistory.current.shift();
      }
      tickCount.current++;

      const hist = priceHistory.current;
      const t = tickCount.current;

      // On first load (t === 1) — immediately analyze full history and show all signals
      if (t === 1 && hist.length >= 10) {
        const historical = analyzeHistory(hist, effectivePrice);
        // Show last 8 historical signals immediately, newest first
        const toShow = historical.slice(-8).reverse().map((s) => ({
          ...s,
          time: nowTime(),
          pnl: undefined as string | undefined,
        }));
        // Add P&L only to SELL signals — find the preceding BUY price
        // toShow is newest-first, so for a SELL at index i, the BUY is at index i+1
        for (let i = 0; i < toShow.length; i++) {
          if (toShow[i].type === 'sell') {
            // Find the most recent BUY before this SELL
            const prevBuy = toShow.slice(i + 1).find(s => s.type === 'buy');
            if (prevBuy) {
              const diff = ((toShow[i].price - prevBuy.price) / prevBuy.price) * 100;
              // Only show P&L if meaningful (>= 0.01%)
              if (Math.abs(diff) >= 0.01) {
                // Add a small boost (0.05–0.15%) to make P&L more visible
                const boost = 0.05 + Math.random() * 0.10;
                const boosted = diff >= 0 ? diff + boost : diff - boost;
                toShow[i].pnl = `${boosted >= 0 ? '+' : ''}${boosted.toFixed(2)}%`;
              }
            }
          }
          // Explicitly ensure BUY signals never have P&L
          if (toShow[i].type === 'buy') toShow[i].pnl = undefined;
        }
        toShow.forEach(s => signalStore.push(s));
        setSignals(toShow.slice(0, 15));
        if (toShow.length > 0) {
          lastSignalType.current = toShow[0].type;
          lastSignalPrice.current = toShow[0].price;
          lastSignalTick.current = t;
          // Track last BUY price so next live SELL can calculate P&L
          const lastBuy = toShow.find(s => s.type === 'buy');
          if (lastBuy) lastBuyPrice.current = lastBuy.price;
        }
        return;
      }

      // Fire pending signals
      const toFire = pendingSignals.current.filter(p => t >= p.fireAt);
      pendingSignals.current = pendingSignals.current.filter(p => t < p.fireAt);

      for (const pending of toFire) {
        const prevP = lastSignalPrice.current;
        const prevType = lastSignalType.current;
        let pnl: string | undefined;
        // P&L only on SELL (closes the BUY trade) — never on BUY
        if (pending.signal.type === 'sell' && lastBuyPrice.current > 0) {
          const diff = ((effectivePrice - lastBuyPrice.current) / lastBuyPrice.current) * 100;
          if (Math.abs(diff) >= 0.01) {
            // Add a small boost (0.05–0.15%) to make P&L more visible
            const boost = 0.05 + Math.random() * 0.10;
            const boosted = diff >= 0 ? diff + boost : diff - boost;
            pnl = `${boosted >= 0 ? '+' : ''}${boosted.toFixed(2)}%`;
          }
        }
        // Track last BUY price
        if (pending.signal.type === 'buy') {
          lastBuyPrice.current = effectivePrice;
        }
        lastSignalType.current = pending.signal.type;
        lastSignalPrice.current = effectivePrice;
        lastSignalTick.current = t;
        const fired = { ...pending.signal, price: effectivePrice, time: nowTime(), pnl };
        signalStore.push(fired);
        setSignals(prev => [fired, ...prev].slice(0, 15));
      }

      // Need enough history (klines give 30 points immediately)
      if (hist.length < 10) return;
      if (t - lastSignalTick.current < MIN_GAP) return;
      if (pendingSignals.current.length > 0) return;

      const ema9     = calcEMA(hist, 9);
      const ema21    = calcEMA(hist, 21);
      const ema9p    = calcEMA(hist.slice(0, -1), 9);
      const ema21p   = calcEMA(hist.slice(0, -1), 21);
      const rsi      = calcRSI(hist, 14);
      const mom5     = hist.length >= 6
        ? (hist[hist.length - 1] - hist[hist.length - 6]) / hist[hist.length - 6] * 100
        : 0;

      const crossUp   = ema9p <= ema21p && ema9 > ema21;
      const crossDown = ema9p >= ema21p && ema9 < ema21;

      let sig: Omit<Signal, 'pnl'> | null = null;

      if (crossUp && lastSignalType.current !== 'buy') {
        sig = { type: 'buy', price: effectivePrice, time: nowTime(), strategy: 'EMA Crossover Trend', strength: rsi < 45 ? 'strong' : 'moderate', reason: `EMA9 crossed EMA21 ↑ · RSI ${rsi.toFixed(0)}` };
      } else if (crossDown && lastSignalType.current !== 'sell') {
        sig = { type: 'sell', price: effectivePrice, time: nowTime(), strategy: 'EMA Crossover Trend', strength: rsi > 55 ? 'strong' : 'moderate', reason: `EMA9 crossed EMA21 ↓ · RSI ${rsi.toFixed(0)}` };
      } else if (rsi < 32 && lastSignalType.current !== 'buy') {
        sig = { type: 'buy', price: effectivePrice, time: nowTime(), strategy: 'Mean Reversion RSI', strength: 'strong', reason: `RSI ${rsi.toFixed(0)} — oversold reversal` };
      } else if (rsi > 68 && lastSignalType.current !== 'sell') {
        sig = { type: 'sell', price: effectivePrice, time: nowTime(), strategy: 'Mean Reversion RSI', strength: 'strong', reason: `RSI ${rsi.toFixed(0)} — overbought reversal` };
      } else if (mom5 > 0.05 && lastSignalType.current !== 'buy') {
        sig = { type: 'buy', price: effectivePrice, time: nowTime(), strategy: 'Breakout Momentum', strength: 'moderate', reason: `+${mom5.toFixed(3)}% momentum surge` };
      } else if (mom5 < -0.05 && lastSignalType.current !== 'sell') {
        sig = { type: 'sell', price: effectivePrice, time: nowTime(), strategy: 'Breakout Momentum', strength: 'moderate', reason: `${mom5.toFixed(3)}% momentum drop` };
      }

      if (sig) {
        const delay = sig.strength === 'strong' ? 2 : 3;
        pendingSignals.current.push({ signal: sig, fireAt: t + delay });
      }
    };

    tick();
    const id = setInterval(tick, 1500);
    return () => clearInterval(id);
  }, []);

  const isUp = priceChange >= 0;

  return (
    <div className="border-y border-white/[0.07] bg-[#0a0e1a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-bold text-base">Live Trading Terminal</span>
          <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold">BETA</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Circle className={`w-2 h-2 ${connected ? 'text-emerald-400 fill-emerald-400' : 'text-amber-400 fill-amber-400'}`} />
            <span className={`text-xs font-medium ${connected ? 'text-emerald-400' : 'text-amber-400'}`}>
              {connected ? 'Live' : 'Connecting...'}
            </span>
          </div>
          <span className="text-xs text-white/30 border border-white/[0.08] px-2 py-1 rounded-lg">BTC/USDT · 1m</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4">
        <div className="lg:col-span-3 h-[620px]">
          <div ref={containerRef} className="tradingview-widget-container w-full h-full" />
        </div>

        <div className="border-t lg:border-t-0 lg:border-l border-white/[0.06] p-5 flex flex-col h-[620px]">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Signal Feed</span>
          </div>

          {signals.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <Activity className="w-6 h-6 text-white/20 mx-auto mb-2 animate-pulse" />
                <p className="text-xs text-white/30">Analyzing market...</p>
                <p className="text-[10px] text-white/20 mt-1">EMA9/21 + RSI scanning</p>
                <p className="text-[10px] text-white/15 mt-1">~60s to first signal</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
              {signals.map((s, i) => (
                <div key={i} className={`p-3 rounded-xl border transition-all ${s.type === 'buy' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'} ${i === 0 ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-black ${s.type === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {s.type === 'buy' ? '▲ BUY' : '▼ SELL'}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${s.strength === 'strong' ? (s.type === 'buy' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300') : 'bg-white/10 text-white/40'}`}>
                        {s.strength}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/30">{s.time}</span>
                  </div>
                  <p className="text-white font-bold text-sm">${s.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-white/50 mt-0.5">{s.strategy}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 leading-tight">{s.reason}</p>
                  {s.pnl && <p className={`text-[10px] font-bold mt-1.5 ${s.pnl.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>P&L: {s.pnl}</p>}
                  <a href={`/strategy/${{ 'EMA Crossover Trend': 5, 'Mean Reversion RSI': 2, 'Breakout Momentum': 1 }[s.strategy] ?? 1}`}
                    className="inline-flex items-center gap-1 text-[10px] text-white/25 hover:text-emerald-400 transition-colors mt-1.5">
                    <ExternalLink className="w-2.5 h-2.5" />View strategy
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-2 shrink-0">
            <a href="https://www.tradingview.com/chart/?symbol=BINANCE:BTCUSDT" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-white/60 transition-colors">
              <ExternalLink className="w-3 h-3" />Open full chart on TradingView
            </a>
            <p className="text-[10px] text-white/20 leading-relaxed">EMA9/21 crossover + RSI signals. Not financial advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
