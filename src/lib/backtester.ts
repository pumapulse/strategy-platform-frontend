/**
 * Real backtesting engine — CoinGecko hourly prices (90 days).
 * Uses hourly data for more signals and better timing.
 * Strategies designed to work in both bull and bear markets.
 */

const STRATEGY_TO_CG: Record<number, string> = {
  1: 'bitcoin', 2: 'ethereum', 3: 'bitcoin',  4: 'bitcoin',
  5: 'bitcoin', 6: 'solana',   7: 'ethereum', 8: 'chainlink',
  9: 'ethereum', 10: 'ethereum', 11: 'bitcoin', 12: 'bitcoin',
};

// ── Indicators ────────────────────────────────────────────────────────────────

function ema(p: number[], period: number, idx: number): number {
  const k = 2 / (period + 1);
  let e = p[0];
  for (let i = 1; i <= idx; i++) e = p[i] * k + e * (1 - k);
  return e;
}

function rsi(p: number[], period: number, idx: number): number {
  if (idx < period) return 50;
  let g = 0, l = 0;
  for (let i = idx - period + 1; i <= idx; i++) {
    const d = p[i] - p[i-1];
    if (d > 0) g += d; else l -= d;
  }
  return l === 0 ? 100 : 100 - 100 / (1 + g / l);
}

function sma(p: number[], period: number, idx: number): number {
  const s = p.slice(Math.max(0, idx - period + 1), idx + 1);
  return s.reduce((a, b) => a + b, 0) / s.length;
}

function stddev(p: number[], period: number, idx: number): number {
  const s = p.slice(Math.max(0, idx - period + 1), idx + 1);
  const m = s.reduce((a, b) => a + b, 0) / s.length;
  return Math.sqrt(s.reduce((a, b) => a + (b - m) ** 2, 0) / s.length);
}

// ── Signal functions (hourly data, ~24 candles/day) ───────────────────────────

// Strategy 1: Breakout — 24h high/low breakout with RSI + EMA trend
function sigBreakout(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 30) return null;
  const h24 = Math.max(...p.slice(i - 24, i));
  const l24 = Math.min(...p.slice(i - 24, i));
  const r = rsi(p, 14, i);
  const e48 = ema(p, 48, i);
  if (p[i] > h24 && p[i-1] <= h24 && r > 52 && p[i] > e48) return 'buy';
  if (p[i] < l24 && p[i-1] >= l24 && r < 48 && p[i] < e48) return 'sell';
  return null;
}

// Strategy 2: RSI divergence — oversold/overbought with trend confirmation
function sigRSI(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 20) return null;
  const r = rsi(p, 14, i), pr = rsi(p, 14, i - 1);
  const e24 = ema(p, 24, i);
  // Buy: RSI crosses above 30 (oversold recovery) in uptrend
  if (pr < 30 && r >= 30 && p[i] > e24 * 0.99) return 'buy';
  // Sell: RSI crosses below 70 (overbought exhaustion) in downtrend
  if (pr > 70 && r <= 70 && p[i] < e24 * 1.01) return 'sell';
  return null;
}

// Strategy 3: EMA5/EMA13 crossover (fast, hourly)
function sigVWAP(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 20) return null;
  const e5 = ema(p, 5, i), pe5 = ema(p, 5, i-1);
  const e13 = ema(p, 13, i), pe13 = ema(p, 13, i-1);
  const e48 = ema(p, 48, i);
  const r = rsi(p, 14, i);
  if (pe5 < pe13 && e5 >= e13 && p[i] > e48 && r > 48) return 'buy';
  if (pe5 > pe13 && e5 <= e13 && p[i] < e48 && r < 52) return 'sell';
  return null;
}

// Strategy 4: Support/Resistance — EMA bounce with volume proxy
function sigSR(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 20) return null;
  const e13 = ema(p, 13, i), pe13 = ema(p, 13, i-1);
  const e48 = ema(p, 48, i);
  const r = rsi(p, 14, i);
  if (p[i-1] < pe13 && p[i] >= e13 && p[i] > e48 && r > 45) return 'buy';
  if (p[i-1] > pe13 && p[i] <= e13 && p[i] < e48 && r < 55) return 'sell';
  return null;
}

// Strategy 5: EMA13/EMA48 golden/death cross
function sigEMA(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 55) return null;
  const e13 = ema(p, 13, i), e48 = ema(p, 48, i);
  const pe13 = ema(p, 13, i-1), pe48 = ema(p, 48, i-1);
  const r = rsi(p, 14, i);
  if (pe13 < pe48 && e13 >= e48 && r > 50) return 'buy';
  if (pe13 > pe48 && e13 <= e48 && r < 50) return 'sell';
  return null;
}

// Strategy 6: Bollinger Band mean reversion
function sigBollinger(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 25) return null;
  const mid = sma(p, 20, i), sd = stddev(p, 20, i);
  const upper = mid + 2 * sd, lower = mid - 2 * sd;
  const r = rsi(p, 14, i);
  // Buy lower band touch + RSI oversold + price bouncing
  if (p[i] <= lower * 1.003 && r < 32 && p[i] > p[i-1] && p[i] > p[i-2]) return 'buy';
  // Sell upper band touch + RSI overbought + price turning
  if (p[i] >= upper * 0.997 && r > 68 && p[i] < p[i-1] && p[i] < p[i-2]) return 'sell';
  return null;
}

// Strategy 7: SR flip with multi-candle confirmation
function sigSR7(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 25) return null;
  const e13 = ema(p, 13, i), pe13 = ema(p, 13, i-1);
  const e48 = ema(p, 48, i);
  const r = rsi(p, 14, i);
  // Require 2 consecutive closes above EMA13 for buy
  if (p[i-1] >= pe13 && p[i] >= e13 && p[i-2] < ema(p, 13, i-2) && p[i] > e48 && r > 48) return 'buy';
  if (p[i-1] <= pe13 && p[i] <= e13 && p[i-2] > ema(p, 13, i-2) && p[i] < e48 && r < 52) return 'sell';
  return null;
}

// Strategy 8: MACD zero-line cross with trend filter
function sigMACD(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 30) return null;
  const macd  = ema(p, 12, i)   - ema(p, 26, i);
  const pmacd = ema(p, 12, i-1) - ema(p, 26, i-1);
  const e48 = ema(p, 48, i);
  const r = rsi(p, 14, i);
  if (pmacd < 0 && macd >= 0 && p[i] > e48 && r > 48) return 'buy';
  if (pmacd > 0 && macd <= 0 && p[i] < e48 && r < 52) return 'sell';
  return null;
}

// Strategy 9: Fibonacci with RSI + trend
function sigFib(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 48) return null;
  const h = Math.max(...p.slice(i - 48, i));
  const l = Math.min(...p.slice(i - 48, i));
  const f618 = h - (h - l) * 0.618;
  const f382 = h - (h - l) * 0.382;
  const r = rsi(p, 14, i);
  const e48 = ema(p, 48, i);
  if (Math.abs(p[i] - f618) / f618 < 0.015 && r < 42 && p[i] > p[i-1] && p[i] > e48 * 0.98) return 'buy';
  if (Math.abs(p[i] - f382) / f382 < 0.015 && r > 58 && p[i] < p[i-1] && p[i] < e48 * 1.02) return 'sell';
  return null;
}

// Strategy 10: ML — 4-indicator consensus
function sigML(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 55) return null;
  const r = rsi(p, 14, i);
  const e13 = ema(p, 13, i), e48 = ema(p, 48, i);
  const macd = ema(p, 12, i) - ema(p, 26, i);
  const pmacd = ema(p, 12, i-1) - ema(p, 26, i-1);
  const pe13 = ema(p, 13, i-1);
  let bull = 0, bear = 0;
  if (r > 52) bull++; else bear++;
  if (p[i] > e13) bull++; else bear++;
  if (e13 > e48) bull++; else bear++;
  if (macd > pmacd) bull++; else bear++;
  if (bull === 4 && p[i] > p[i-1]) return 'buy';
  if (bear === 4 && p[i] < p[i-1]) return 'sell';
  return null;
}

// Strategy 11: Opening range breakout (hourly = 4h range)
function sigORB(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 10) return null;
  const h4 = Math.max(...p.slice(i - 4, i));
  const l4 = Math.min(...p.slice(i - 4, i));
  const e24 = ema(p, 24, i);
  const r = rsi(p, 14, i);
  if (p[i] > h4 && p[i-1] <= h4 && p[i] > e24 && r > 50) return 'buy';
  if (p[i] < l4 && p[i-1] >= l4 && p[i] < e24 && r < 50) return 'sell';
  return null;
}

// Strategy 12: Turtle — 48h breakout (2-day)
function sigTurtle(p: number[], i: number): 'buy' | 'sell' | null {
  if (i < 55) return null;
  const h48 = Math.max(...p.slice(i - 48, i));
  const l48 = Math.min(...p.slice(i - 48, i));
  const e96 = ema(p, 96, i);
  const r = rsi(p, 14, i);
  if (p[i] > h48 && p[i-1] <= h48 && p[i] > e96 && r > 52) return 'buy';
  if (p[i] < l48 && p[i-1] >= l48 && p[i] < e96 && r < 48) return 'sell';
  return null;
}

const SIGNAL_FN: Record<number, (p: number[], i: number) => 'buy' | 'sell' | null> = {
  1: sigBreakout, 2: sigRSI,  3: sigVWAP,
  4: sigSR,       5: sigEMA,  6: sigBollinger,
  7: sigSR7,      8: sigMACD, 9: sigFib,
  10: sigML,      11: sigORB, 12: sigTurtle,
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BacktestPoint {
  date: string;
  price: number;
  equity: number;
  signal: 'buy' | 'sell' | null;
}

export interface BacktestStats {
  totalTrades: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  totalReturn: number;
  maxDrawdown: number;
}

// ── Main ──────────────────────────────────────────────────────────────────────

export async function runBacktest(
  strategyId: number,
  market: string
): Promise<{ points: BacktestPoint[]; stats: BacktestStats }> {
  const cgId = STRATEGY_TO_CG[strategyId] || 'bitcoin';
  const empty = { points: [], stats: { totalTrades: 0, winRate: 0, avgWin: 0, avgLoss: 0, totalReturn: 0, maxDrawdown: 0 } };

  let prices: number[] = [];
  let dates: string[] = [];

  try {
    // Hourly data for 90 days — better signal timing
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${cgId}/market_chart?vs_currency=usd&days=90`
    );
    const data = await res.json();
    const raw: [number, number][] = data.prices || [];
    // Downsample to every 4 hours for performance
    const sampled = raw.filter((_, i) => i % 4 === 0);
    prices = sampled.map(([, p]) => p);
    dates  = sampled.map(([t]) => {
      const d = new Date(t);
      return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()} ${d.getHours()}h`;
    });
  } catch { return empty; }

  if (prices.length < 30) return empty;

  const fn = SIGNAL_FN[strategyId] || sigBreakout;
  const points: BacktestPoint[] = [];
  let equity = 10000;
  let inTrade = false;
  let entryPrice = 0;
  let entryEquity = 0;
  let tradePeak = 0;
  let lastChartSignal: 'buy' | 'sell' | null = null;
  const STOP_LOSS   = 0.018; // 1.8% hard stop
  const TAKE_PROFIT = 0.06;  // 6% take profit
  const TRAIL_STOP  = 0.025; // 2.5% trailing stop (activates after 1% profit)
  const trades: { pnl: number }[] = [];
  let peakEquity = 10000;
  let maxDD = 0;

  // Show every 6th point on chart (reduce clutter)
  const CHART_SAMPLE = 6;

  for (let i = 0; i < prices.length; i++) {
    const rawSignal = fn(prices, i);
    let chartSignal: 'buy' | 'sell' | null = null;

    if (inTrade) {
      if (prices[i] > tradePeak) tradePeak = prices[i];
      const pnl      = (prices[i] - entryPrice) / entryPrice;
      const trailPnl = (prices[i] - tradePeak) / tradePeak;
      const hitStop   = pnl <= -STOP_LOSS;
      const hitTarget = pnl >= TAKE_PROFIT;
      const hitTrail  = trailPnl <= -TRAIL_STOP && pnl > 0.01;
      const sellSig   = rawSignal === 'sell' && lastChartSignal === 'buy';

      if (hitStop || hitTarget || hitTrail || sellSig) {
        equity = entryEquity * (1 + pnl * 0.95);
        trades.push({ pnl: pnl * 100 });
        inTrade = false;
        chartSignal = 'sell';
        lastChartSignal = 'sell';
      }
    } else {
      if (rawSignal === 'buy' && lastChartSignal !== 'buy') {
        inTrade = true;
        entryPrice = prices[i];
        entryEquity = equity;
        tradePeak = prices[i];
        chartSignal = 'buy';
        lastChartSignal = 'buy';
      }
    }

    let currentEquity = equity;
    if (inTrade) {
      const unrealized = (prices[i] - entryPrice) / entryPrice;
      currentEquity = entryEquity * (1 + unrealized * 0.95);
    }

    if (currentEquity > peakEquity) peakEquity = currentEquity;
    const dd = (peakEquity - currentEquity) / peakEquity * 100;
    if (dd > maxDD) maxDD = dd;

    // Only push every CHART_SAMPLE points, but always push signal points
    if (i % CHART_SAMPLE === 0 || chartSignal !== null) {
      points.push({
        date: dates[i],
        price: Math.round(prices[i] * 100) / 100,
        equity: Math.round(currentEquity),
        signal: chartSignal,
      });
    }
  }

  // Close open trade at end
  if (inTrade && prices.length > 0) {
    const pnl = (prices[prices.length-1] - entryPrice) / entryPrice;
    const finalEq = entryEquity * (1 + pnl * 0.95);
    trades.push({ pnl: pnl * 100 });
    if (points.length > 0) {
      points[points.length-1] = { ...points[points.length-1], equity: Math.round(finalEq), signal: 'sell' };
    }
  }

  const wins   = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl <= 0);
  const finalEquity = points[points.length-1]?.equity ?? 10000;

  return {
    points,
    stats: {
      totalTrades: trades.length,
      winRate:     trades.length > 0 ? Math.round((wins.length / trades.length) * 100) : 0,
      avgWin:      wins.length   > 0 ? parseFloat((wins.reduce((a, t) => a + t.pnl, 0) / wins.length).toFixed(1)) : 0,
      avgLoss:     losses.length > 0 ? parseFloat((Math.abs(losses.reduce((a, t) => a + t.pnl, 0) / losses.length)).toFixed(1)) : 0,
      totalReturn: parseFloat(((finalEquity - 10000) / 10000 * 100).toFixed(1)),
      maxDrawdown: parseFloat(maxDD.toFixed(1)),
    },
  };
}
