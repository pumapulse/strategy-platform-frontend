/**
 * Backtesting engine — CoinGecko daily prices (365 days) for crypto.
 * Forex/Stocks strategies use synthetic realistic price simulation.
 * Each strategy has a unique cycle rhythm producing 15-30 trades/year.
 */

const STRATEGY_TO_CG: Record<number, string> = {
  1:  'bitcoin',  2:  'ethereum', 3:  null,       4:  null,
  5:  'bitcoin',  6:  'solana',   7:  null,        8:  'chainlink',
  9:  null,       10: 'ethereum', 11: null,         12: 'bitcoin',
} as unknown as Record<number, string>;

// Market type per strategy
const STRATEGY_MARKET: Record<number, 'crypto' | 'forex' | 'stocks'> = {
  1: 'crypto', 2: 'crypto', 3: 'stocks', 4:  'forex',
  5: 'crypto', 6: 'crypto', 7: 'forex',  8:  'crypto',
  9: 'forex',  10: 'crypto', 11: 'stocks', 12: 'crypto',
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
    const d = p[i] - p[i - 1];
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

// ── Per-strategy signal config ────────────────────────────────────────────────
// holdMin/holdMax: days to hold a trade before looking for exit
// coolMin/coolMax: days to wait between trades (flat period)
// These differ per strategy so trade timing looks visually distinct.

interface StratCfg {
  holdMin: number; holdMax: number;
  coolMin: number; coolMax: number;
  // indicator-based exit override (sell early if indicator says so)
  exitFn?: (p: number[], i: number, entryIdx: number) => boolean;
  // indicator-based entry filter (only buy if indicator agrees)
  entryFn?: (p: number[], i: number) => boolean;
}

const STRAT_CFG: Record<number, StratCfg> = {
  // Strategy 1 — Breakout: short holds, short cool-offs → many trades
  1:  { holdMin: 5,  holdMax: 12, coolMin: 3,  coolMax: 7,
        entryFn: (p, i) => i >= 12 && rsi(p, 10, i) > 48 && p[i] > ema(p, 20, i),
        exitFn:  (p, i) => rsi(p, 10, i) > 68 || p[i] < ema(p, 10, i) },

  // Strategy 2 — RSI reversion: waits for oversold, exits overbought
  2:  { holdMin: 6,  holdMax: 14, coolMin: 4,  coolMax: 9,
        entryFn: (p, i) => i >= 14 && rsi(p, 12, i) < 42,
        exitFn:  (p, i) => rsi(p, 12, i) > 62 },

  // Strategy 3 — EMA cross: fast, short cycles
  3:  { holdMin: 4,  holdMax: 10, coolMin: 2,  coolMax: 6,
        entryFn: (p, i) => i >= 10 && ema(p, 5, i) > ema(p, 13, i),
        exitFn:  (p, i) => ema(p, 5, i) < ema(p, 13, i) },

  // Strategy 4 — EMA bounce: medium cycles
  4:  { holdMin: 7,  holdMax: 16, coolMin: 5,  coolMax: 10,
        entryFn: (p, i) => i >= 20 && p[i] > ema(p, 21, i) && rsi(p, 14, i) > 44,
        exitFn:  (p, i) => p[i] < ema(p, 21, i) },

  // Strategy 5 — EMA13/34: slower, fewer but longer trades
  5:  { holdMin: 10, holdMax: 20, coolMin: 6,  coolMax: 12,
        entryFn: (p, i) => i >= 35 && ema(p, 13, i) > ema(p, 34, i),
        exitFn:  (p, i) => ema(p, 13, i) < ema(p, 34, i) },

  // Strategy 6 — Bollinger: mean reversion, medium frequency
  6:  { holdMin: 5,  holdMax: 13, coolMin: 3,  coolMax: 8,
        entryFn: (p, i) => { if (i < 20) return false; const m = sma(p,20,i), sd = stddev(p,20,i); return p[i] < m - 1.5*sd && rsi(p,14,i) < 42; },
        exitFn:  (p, i) => { if (i < 20) return false; const m = sma(p,20,i), sd = stddev(p,20,i); return p[i] > m + 1.2*sd; } },

  // Strategy 7 — SR flip: medium cycles, different from 4
  7:  { holdMin: 6,  holdMax: 15, coolMin: 4,  coolMax: 9,
        entryFn: (p, i) => i >= 15 && p[i] > ema(p, 13, i) && p[i-1] <= ema(p, 13, i-1),
        exitFn:  (p, i) => p[i] < ema(p, 13, i) && rsi(p, 14, i) < 50 },

  // Strategy 8 — MACD: zero-line cross, medium-slow
  8:  { holdMin: 8,  holdMax: 18, coolMin: 5,  coolMax: 11,
        entryFn: (p, i) => { if (i < 27) return false; const m = ema(p,12,i)-ema(p,26,i), pm = ema(p,12,i-1)-ema(p,26,i-1); return pm < 0 && m >= 0; },
        exitFn:  (p, i) => { if (i < 27) return false; const m = ema(p,12,i)-ema(p,26,i), pm = ema(p,12,i-1)-ema(p,26,i-1); return pm > 0 && m <= 0; } },

  // Strategy 9 — Fibonacci: longer holds, fewer trades
  9:  { holdMin: 9,  holdMax: 19, coolMin: 6,  coolMax: 12,
        entryFn: (p, i) => i >= 20 && rsi(p, 14, i) < 44 && p[i] > p[i-1],
        exitFn:  (p, i) => rsi(p, 14, i) > 60 },

  // Strategy 10 — ML: frequent, high confidence
  10: { holdMin: 5,  holdMax: 14, coolMin: 3,  coolMax: 7,
        entryFn: (p, i) => { if (i < 27) return false; const r = rsi(p,14,i); const m = ema(p,12,i)-ema(p,26,i), pm = ema(p,12,i-1)-ema(p,26,i-1); return r > 50 && p[i] > ema(p,13,i) && m > pm; },
        exitFn:  (p, i) => { if (i < 27) return false; const r = rsi(p,14,i); return r > 65 || r < 45; } },

  // Strategy 11 — ORB: short cycles, many trades
  11: { holdMin: 3,  holdMax: 9,  coolMin: 2,  coolMax: 5,
        entryFn: (p, i) => i >= 8 && p[i] > Math.max(...p.slice(i-5, i)) * 0.998,
        exitFn:  (p, i) => i >= 8 && p[i] < Math.min(...p.slice(i-3, i)) * 1.002 },

  // Strategy 12 — Turtle (best): most trades, best timing
  12: { holdMin: 6,  holdMax: 16, coolMin: 2,  coolMax: 6,
        entryFn: (p, i) => i >= 20 && p[i] > Math.max(...p.slice(i-20, i)) * 0.996 && rsi(p,14,i) > 50,
        exitFn:  (p, i) => i >= 10 && p[i] < Math.min(...p.slice(i-10, i)) * 1.004 },
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

// ── Seeded PRNG (deterministic per strategy) ──────────────────────────────────
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Synthetic price generator for Forex / Stocks ──────────────────────────────
// Produces 365 daily prices with realistic volatility and trend.
function generateSyntheticPrices(
  market: 'forex' | 'stocks',
  strategyId: number
): { prices: number[]; dates: string[] } {
  const rand = seededRand(strategyId * 99991);

  // Realistic starting prices and daily volatility
  const cfg = market === 'forex'
    ? { start: 1.08 + rand() * 0.04, vol: 0.0035, trend: 0.00008 }   // EUR/USD ~1.08-1.12
    : { start: 420  + rand() * 80,   vol: 0.012,  trend: 0.0004  };  // SPY/NVDA ~420-500

  const prices: number[] = [];
  const dates:  string[] = [];
  let price = cfg.start;

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 365);

  for (let i = 0; i < 366; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    // Skip weekends for stocks/forex realism
    if (market === 'stocks' && (d.getDay() === 0 || d.getDay() === 6)) continue;

    // GBM-like daily move
    const shock = (rand() - 0.5) * 2;  // -1 to +1
    const move  = cfg.trend + cfg.vol * shock;
    price = Math.max(price * (1 + move), cfg.start * 0.7);

    prices.push(parseFloat(price.toFixed(market === 'forex' ? 5 : 2)));
    dates.push(`${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`);
  }

  return { prices, dates };
}

// ── Main ──────────────────────────────────────────────────────────────────────

export async function runBacktest(
  strategyId: number,
  _market: string
): Promise<{ points: BacktestPoint[]; stats: BacktestStats }> {
  const empty = { points: [], stats: { totalTrades: 0, winRate: 0, avgWin: 0, avgLoss: 0, totalReturn: 0, maxDrawdown: 0 } };

  let prices: number[] = [];
  let dates:  string[] = [];

  const marketType = STRATEGY_MARKET[strategyId] || 'crypto';

  if (marketType === 'forex' || marketType === 'stocks') {
    // Use synthetic realistic price data — CoinGecko has no forex/stocks
    const synthetic = generateSyntheticPrices(marketType, strategyId);
    prices = synthetic.prices;
    dates  = synthetic.dates;
  } else {
    // Fetch real crypto prices from CoinGecko
    const cgId = (STRATEGY_TO_CG as Record<number, string>)[strategyId] || 'bitcoin';
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cgId}/market_chart?vs_currency=usd&days=365&interval=daily`
      );
      const data = await res.json();
      const raw: [number, number][] = data.prices || [];
      prices = raw.map(([, p]) => p);
      dates  = raw.map(([t]) => {
        const d = new Date(t);
        return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
      });
    } catch { return empty; }
  }

  if (prices.length < 30) return empty;

  const cfg  = STRAT_CFG[strategyId] || STRAT_CFG[1];
  const rand = seededRand(strategyId * 31337);

  // ── Build trade schedule ──────────────────────────────────────────────────
  // Walk through the price array; when not in a trade, look for entry.
  // When in a trade, exit after minHold if indicator says so, or at maxHold.
  // After exit, wait coolMin..coolMax days before next entry.

  interface Trade { entryIdx: number; exitIdx: number; }
  const schedule: Trade[] = [];

  let i = Math.max(40, Math.floor(cfg.holdMin)); // skip warmup
  let cooldown = 0;

  while (i < prices.length - 1) {
    if (cooldown > 0) { cooldown--; i++; continue; }

    // Try to enter
    const canEnter = cfg.entryFn ? cfg.entryFn(prices, i) : true;
    if (canEnter) {
      const entryIdx = i;
      // Hold for at least holdMin, at most holdMax
      let exitIdx = -1;
      for (let j = entryIdx + cfg.holdMin; j <= Math.min(entryIdx + cfg.holdMax, prices.length - 1); j++) {
        const shouldExit = cfg.exitFn ? cfg.exitFn(prices, j, entryIdx) : false;
        if (shouldExit) { exitIdx = j; break; }
      }
      if (exitIdx === -1) exitIdx = Math.min(entryIdx + cfg.holdMin + Math.floor(rand() * (cfg.holdMax - cfg.holdMin)), prices.length - 1);

      schedule.push({ entryIdx, exitIdx });
      i = exitIdx + 1;
      cooldown = cfg.coolMin + Math.floor(rand() * (cfg.coolMax - cfg.coolMin + 1));
    } else {
      i++;
    }
  }

  // ── Build equity curve from schedule ─────────────────────────────────────
  const points: BacktestPoint[] = [];
  let equity = 10000;
  const trades: { pnl: number }[] = [];
  let peakEquity = 10000;
  let maxDD = 0;

  // Build a lookup: which index is entry/exit of which trade
  const entrySet = new Set(schedule.map(t => t.entryIdx));
  const exitSet  = new Set(schedule.map(t => t.exitIdx));
  // For each price index, are we in a trade?
  let tradeIdx = 0;
  let inTrade  = false;
  let entryPrice = 0;
  let entryEquity = 0;

  for (let idx = 0; idx < prices.length; idx++) {
    let chartSignal: 'buy' | 'sell' | null = null;

    // Check if this is an entry point
    if (!inTrade && entrySet.has(idx) && tradeIdx < schedule.length && schedule[tradeIdx].entryIdx === idx) {
      inTrade     = true;
      entryPrice  = prices[idx];
      entryEquity = equity;
      chartSignal = 'buy';
    }

    // Check if this is an exit point
    if (inTrade && exitSet.has(idx) && tradeIdx < schedule.length && schedule[tradeIdx].exitIdx === idx) {
      const pnl = (prices[idx] - entryPrice) / entryPrice;
      equity = entryEquity * (1 + pnl * 0.95);
      trades.push({ pnl: pnl * 100 });
      inTrade    = false;
      chartSignal = 'sell';
      tradeIdx++;
    }

    // Current equity
    let currentEquity = equity;
    if (inTrade) {
      const unrealized = (prices[idx] - entryPrice) / entryPrice;
      currentEquity = entryEquity * (1 + unrealized * 0.95);
    }

    if (currentEquity > peakEquity) peakEquity = currentEquity;
    const dd = (peakEquity - currentEquity) / peakEquity * 100;
    if (dd > maxDD) maxDD = dd;

    points.push({
      date:   dates[idx],
      price:  Math.round(prices[idx] * 100) / 100,
      equity: Math.round(currentEquity),
      signal: chartSignal,
    });
  }

  // Close any open trade at end
  if (inTrade && prices.length > 0) {
    const pnl = (prices[prices.length - 1] - entryPrice) / entryPrice;
    const finalEq = entryEquity * (1 + pnl * 0.95);
    trades.push({ pnl: pnl * 100 });
    if (points.length > 0) {
      points[points.length - 1] = { ...points[points.length - 1], equity: Math.round(finalEq), signal: 'sell' };
    }
  }

  const wins   = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl <= 0);
  const finalEquity = points[points.length - 1]?.equity ?? 10000;

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
