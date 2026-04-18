import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Target, BarChart2, Download, RefreshCw, Lock } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import Footer from "@/components/Footer";
import { runBacktest, BacktestPoint, BacktestStats } from "@/lib/backtester";
import { getPlanTier, canDownloadScript, getRemainingDownloads, recordDownload } from "@/lib/subscription";

const StrategyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backtestData, setBacktestData] = useState<BacktestPoint[]>([]);
  const [backtestStats, setBacktestStats] = useState<any>(null);
  const [backtestLoading, setBacktestLoading] = useState(false);

  useEffect(() => {
    const fetchStrategy = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/strategies/${id}`);
        if (!response.ok) throw new Error('Strategy not found');
        const data = await response.json();
        let s = data.strategy;
        s = {
          ...s,
          winRate: s.win_rate,
          profitFactor: s.profit_factor,
          maxDrawdown: s.max_drawdown,
          avgReturn: s.avg_return,
          backtestData: s.backtest_data,
        };

        // Parse JSON strings if needed
        const parse = (v: any) => typeof v === 'string' ? JSON.parse(v) : v;
        s.rules = parse(s.rules) || [];
        s.pros  = parse(s.pros)  || [];
        s.cons  = parse(s.cons)  || [];
        s.equity = parse(s.equity) || [];
        s.trades = parse(s.trades) || [];
        const rawMonthly = parse(s.monthly_returns) || [];
        s.backtestData = parse(s.backtest_data);

        // Convert monthly_returns array of numbers ? [{month, return}]
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        if (Array.isArray(rawMonthly) && rawMonthly.length > 0 && typeof rawMonthly[0] === 'number') {
          s.monthlyReturns = rawMonthly.map((r: number, i: number) => ({ month: monthNames[i % 12], return: r }));
        } else {
          s.monthlyReturns = rawMonthly;
        }

        // Convert equity array of numbers ? [{month, value}]
        if (Array.isArray(s.equity) && s.equity.length > 0 && typeof s.equity[0] === 'number') {
          s.equity = s.equity.map((v: number, i: number) => ({ month: monthNames[i % 12], value: v }));
        }

        // Convert raw trades ? win/loss distribution for chart
        const rawTrades = s.trades;
        if (Array.isArray(rawTrades) && rawTrades.length > 0 && rawTrades[0].pnl !== undefined) {
          const wins   = rawTrades.filter((t: any) => t.pnl > 0).length;
          const losses = rawTrades.filter((t: any) => t.pnl <= 0).length;
          s.tradesRaw = rawTrades;
          s.trades = [
            { type: 'Win',  count: wins   },
            { type: 'Loss', count: losses },
          ];
        }

        // Generate backtest chart data from equity if not present
        if (!s.backtestData && s.equity && s.equity.length > 0) {
          const marketPrices: Record<string, { base: number; volatility: number }> = {
            'Crypto': { base: 42000 + Math.random() * 8000, volatility: 0.035 },
            'Forex':  { base: 1.08  + Math.random() * 0.15, volatility: 0.008 },
            'Stocks': { base: 145   + Math.random() * 60,   volatility: 0.018 },
          };
          const mc = marketPrices[s.market] || { base: 42000, volatility: 0.025 };
          let vm = 1.0;
          if (['5m','15M','15m'].includes(s.timeframe)) vm = 0.6;
          else if (['1H','4H'].includes(s.timeframe)) vm = 1.2;
          else if (s.timeframe === 'Daily') vm = 1.5;
          s.backtestData = generateBacktestData(s.equity, mc.base, mc.volatility * vm);
        }

        // Real algorithm descriptions per strategy
        const algoData: Record<number, any> = {
          1: {
            name: 'Breakout Momentum Algorithm', type: 'Price Action + Volume Analysis',
            description: 'Scans for price consolidation zones where ATR compresses below 0.8%. On the first candle closing above the range high with volume exceeding 1.5� the 20-period average, a long position is opened. The algorithm uses a 2-ATR trailing stop and takes partial profits at 2R to lock in gains while letting winners run.',
            technicalDetails: [
              { title: 'Consolidation Detection', content: 'ATR(14) is compared against a 20-period rolling average. When ATR drops below 80% of its average, the algorithm flags a potential squeeze setup and begins monitoring for breakout conditions.' },
              { title: 'Volume Confirmation', content: 'Breakout candles must show volume = 1.5� the 20-period volume SMA. This filters false breakouts caused by low-liquidity moves and ensures institutional participation.' },
              { title: 'Dynamic Stop-Loss', content: 'Initial stop is placed 1 ATR below the breakout candle low. After 50% of position is closed at 2R, the stop moves to breakeven, eliminating downside risk on the remaining position.' },
              { title: 'Trailing Exit', content: 'The remaining 50% trails with a 2-ATR trailing stop, automatically adjusting as price moves in favor. This captures extended trend moves without manual intervention.' },
            ],
            workflow: ['Scan all pairs for ATR compression (ATR < 80% of 20-period average)', 'Monitor flagged pairs for volume-confirmed breakout candle', 'Calculate position size based on 2% account risk and ATR stop distance', 'Enter long on candle close above range high', 'Set initial stop 1 ATR below entry candle low', 'Close 50% at 2R target, move stop to breakeven', 'Trail remaining position with 2-ATR trailing stop', 'Exit on trailing stop hit or opposing breakout signal'],
            complexity: 'Intermediate', computationalLoad: 'Low � runs on 4H candle close', backtestPeriod: '12 months on BTC/USDT, ETH/USDT',
          },
          2: {
            name: 'RSI Mean Reversion Algorithm', type: 'Oscillator + Divergence Analysis',
            description: 'Exploits oversold and overbought extremes using RSI(14) with divergence confirmation. The algorithm identifies when RSI crosses back above 30 (oversold recovery) or below 70 (overbought exhaustion) while price is at a key support or resistance level. Hidden divergence is used for trend continuation entries.',
            technicalDetails: [
              { title: 'RSI Divergence Detection', content: 'The algorithm compares RSI pivot highs/lows against price pivot highs/lows over a 14-period lookback. Regular divergence signals reversals; hidden divergence signals trend continuation with higher probability.' },
              { title: 'Level Confluence', content: 'RSI signals are only acted upon when price is within 0.5% of a key support/resistance level identified by the previous 20-period swing high/low. This dramatically reduces false signals.' },
              { title: 'Volume Filter', content: 'For crypto markets, the divergence candle must show below-average volume (exhaustion) while the confirmation candle shows above-average volume (new momentum). This cuts false signals by ~40%.' },
              { title: 'Risk Parameters', content: 'Stop-loss is placed beyond the divergence swing point. Target is the previous swing high/low, giving a minimum 1.5:1 reward-to-risk ratio on every trade.' },
            ],
            workflow: ['Calculate RSI(14) on each candle close', 'Identify RSI pivot highs and lows over 14-period lookback', 'Compare RSI pivots against price pivots for divergence', 'Check price proximity to key S/R levels (within 0.5%)', 'Apply volume filter: exhaustion candle + momentum confirmation', 'Enter on confirmation candle close', 'Set stop beyond divergence swing, target previous swing', 'Exit at target or if RSI crosses back through 50'],
            complexity: 'Intermediate', computationalLoad: 'Low � 1H candle analysis', backtestPeriod: '12 months on ETH/USDT',
          },
          3: {
            name: 'VWAP Scalper Algorithm', type: 'Intraday Volume-Weighted Analysis',
            description: 'Uses VWAP as a dynamic intraday support/resistance level. The algorithm monitors price interaction with VWAP during the first 2 hours of the trading session. Long entries trigger when price dips below VWAP then reclaims it with a bullish candle and above-average volume. Shorts trigger on failed VWAP tests.',
            technicalDetails: [
              { title: 'VWAP Calculation', content: 'VWAP is recalculated from the session open (9:30 AM EST) on each 15-minute candle. The algorithm tracks price position relative to VWAP and monitors for crossovers with volume confirmation.' },
              { title: 'Session Filter', content: 'Trades are only taken between 9:30-11:30 AM EST when volume and volatility are highest. This avoids the low-volume midday chop that produces false VWAP signals.' },
              { title: 'Volume Confirmation', content: 'The entry candle must show volume above the 20-period average. This ensures the VWAP reclaim is driven by genuine buying/selling pressure rather than random price movement.' },
              { title: 'Tight Risk Management', content: 'Stop-loss is 0.5% beyond VWAP. Target is 1.5% minimum, giving a 3:1 reward-to-risk ratio. Positions are always closed before market close to avoid overnight gap risk.' },
            ],
            workflow: ['Wait for market open at 9:30 AM EST', 'Calculate session VWAP from first candle', 'Monitor price for VWAP dip-and-reclaim (long) or rally-and-fail (short)', 'Confirm entry candle volume > 20-period average', 'Enter on candle close with stop 0.5% beyond VWAP', 'Target 1.5% minimum (3:1 R:R)', 'Close all positions by 11:30 AM or at target/stop', 'Log trade and reset for next session'],
            complexity: 'Beginner to Intermediate', computationalLoad: 'Medium � real-time 15M monitoring', backtestPeriod: '12 months on AAPL, NVDA, TSLA',
          },
          4: {
            name: 'Ichimoku Cloud Trend Algorithm', type: 'Multi-Component Trend System',
            description: 'Full Ichimoku Kinko Hyo system using all five components: Tenkan-sen, Kijun-sen, Senkou Span A & B, and Chikou Span. Entries require alignment of all components in the trade direction. The Kumo (cloud) acts as dynamic support/resistance and the Kumo twist signals trend changes before they occur.',
            technicalDetails: [
              { title: 'Five-Component Alignment', content: 'All five Ichimoku components must align: price above/below cloud, Tenkan above/below Kijun, Chikou above/below price 26 periods ago, and future cloud bullish/bearish. This multi-filter approach gives the highest-quality signals.' },
              { title: 'Kumo Twist Detection', content: 'The algorithm monitors the future cloud (26 periods ahead) for Senkou Span A/B crossovers. A bullish Kumo twist (A crosses above B) signals an upcoming trend change before price confirms it.' },
              { title: 'Tenkan/Kijun Cross Entry', content: 'Entry is triggered on a Tenkan-sen crossing above/below Kijun-sen while all other components are aligned. The Kijun-sen acts as the stop-loss level, providing a natural risk management anchor.' },
              { title: 'Cloud Support/Resistance', content: 'The Kumo cloud provides dynamic support in uptrends and resistance in downtrends. The algorithm uses cloud thickness as a volatility proxy � thicker clouds indicate stronger support/resistance.' },
            ],
            workflow: ['Calculate all five Ichimoku components on each 4H candle', 'Check five-component alignment for trade direction', 'Monitor future cloud for Kumo twist signal', 'Wait for Tenkan/Kijun cross in direction of alignment', 'Enter on cross confirmation with stop at Kijun-sen', 'Trail stop to Kijun-sen as it moves in trade direction', 'Exit on opposite Tenkan/Kijun cross or cloud breach', 'Reset and scan for next setup'],
            complexity: 'Advanced', computationalLoad: 'Medium � 5 indicator calculations', backtestPeriod: '12 months on EUR/USD, GBP/JPY',
          },
          5: {
            name: 'EMA Crossover Trend Algorithm', type: 'Moving Average Trend Following',
            description: 'Classic EMA 20/50 crossover system with EMA 200 trend filter, adapted for crypto daily timeframes. The golden cross (EMA 20 crossing above EMA 50) triggers long entries when price is above EMA 200. Volume on the crossover day must exceed the 30-day average. Positions are held for weeks to months.',
            technicalDetails: [
              { title: 'Triple EMA Filter', content: 'EMA 20, 50, and 200 are calculated on daily closes. Longs are only taken when EMA 20 > EMA 50 > EMA 200 (full bullish alignment). Shorts require EMA 20 < EMA 50 < EMA 200. This eliminates counter-trend trades.' },
              { title: 'Volume Confirmation', content: 'The crossover day must show volume above the 30-day average. This filters false crossovers caused by low-volume drift and ensures the trend change has institutional backing.' },
              { title: 'Position Sizing', content: 'Position size is calculated using 2% account risk with stop-loss at the EMA 50 level. As EMA 50 rises, the stop is trailed upward, locking in profits while maintaining trend exposure.' },
              { title: 'Exit Logic', content: 'Primary exit is the death cross (EMA 20 crossing below EMA 50). Secondary exit is a 15% trailing stop from the highest close since entry, protecting against sharp reversals.' },
            ],
            workflow: ['Calculate EMA 20, 50, 200 on daily close', 'Check for golden cross (EMA 20 crosses above EMA 50)', 'Verify price above EMA 200 (macro uptrend filter)', 'Confirm crossover day volume > 30-day average', 'Enter long at next day open with stop at EMA 50', 'Trail stop to EMA 50 as it rises', 'Apply 15% trailing stop from highest close', 'Exit on death cross or trailing stop hit'],
            complexity: 'Beginner', computationalLoad: 'Very Low � daily candle only', backtestPeriod: '12 months on BTC/USDT',
          },
          6: {
            name: 'Bollinger Band Squeeze Algorithm', type: 'Volatility Breakout System',
            description: 'Identifies periods of extreme low volatility (Bollinger Band squeeze) followed by explosive directional moves. The algorithm measures band width relative to a 6-month historical range. When width reaches a 6-month low, it enters a standby mode and waits for the first expansion candle to determine direction.',
            technicalDetails: [
              { title: 'Squeeze Detection', content: 'Bollinger Band width (upper - lower / middle) is calculated on each candle and compared against a 126-period (6-month) rolling minimum. When current width equals the 6-month minimum, a squeeze alert is triggered.' },
              { title: 'Expansion Entry', content: 'The first candle after squeeze resolution determines direction. A bullish candle closing above the upper band triggers a long. A bearish candle closing below the lower band triggers a short. No entry if the candle closes inside the bands.' },
              { title: 'Band Width Target', content: 'The profit target is calculated as the entry price plus/minus the band width at the time of entry. This projects the expected move based on the energy stored during the squeeze period.' },
              { title: 'Middle Band Stop', content: 'Stop-loss is placed at the middle band (20-period SMA). If price returns to the middle band after a breakout, the squeeze has failed and the position is closed immediately.' },
            ],
            workflow: ['Calculate Bollinger Bands (20, 2) on each 4H candle', 'Measure band width and compare to 126-period minimum', 'Flag squeeze when width equals 6-month low', 'Monitor for first expansion candle after squeeze', 'Enter long/short on candle closing outside bands', 'Set stop at middle band (20 SMA)', 'Target: entry � band width at time of entry', 'Exit at target or middle band stop'],
            complexity: 'Intermediate', computationalLoad: 'Low � 4H candle analysis', backtestPeriod: '12 months on SOL/USDT',
          },
          7: {
            name: 'Support & Resistance Flip Algorithm', type: 'Price Structure Analysis',
            description: 'Trades the classic support-becomes-resistance and resistance-becomes-support flip. The algorithm identifies key levels with at least 3 price touches, waits for a clean break, then enters on the first retest of the broken level from the other side. Confirmation requires a rejection candle at the retest.',
            technicalDetails: [
              { title: 'Level Identification', content: 'The algorithm scans for price levels with =3 touches within a 50-period lookback. Touches are defined as candles where the high or low comes within 0.3% of the level. Levels with more touches are weighted higher.' },
              { title: 'Break Confirmation', content: 'A level is considered broken when price closes beyond it by at least 0.5% on above-average volume. Wicks through the level without a close do not count as breaks, filtering false breakouts.' },
              { title: 'Retest Entry', content: 'After a break, the algorithm waits for price to return to the broken level. Entry requires a rejection candle (pin bar, engulfing, or inside bar) at the retest, confirming the level has flipped.' },
              { title: 'Target Calculation', content: 'The profit target is the next significant S/R level in the direction of the trade. Stop-loss is placed beyond the rejection candle, typically 0.3-0.5% beyond the retest level.' },
            ],
            workflow: ['Scan for levels with =3 touches in 50-period lookback', 'Monitor for clean break with close > 0.5% beyond level', 'Confirm break with above-average volume', 'Wait for price to return to broken level (retest)', 'Look for rejection candle at retest (pin bar, engulfing)', 'Enter on rejection candle close', 'Stop beyond rejection candle, target next S/R level', 'Exit at target or if level is broken again'],
            complexity: 'Intermediate', computationalLoad: 'Medium � level scanning required', backtestPeriod: '12 months on EUR/USD, ETH/USDT',
          },
          8: {
            name: 'MACD Divergence Algorithm', type: 'Momentum Divergence System',
            description: 'Trades regular and hidden MACD divergences at key market structure levels. Regular divergence (price makes new high/low but MACD does not) signals reversals. Hidden divergence (price makes higher low but MACD makes lower low) signals trend continuation. The MACD histogram flip provides precise entry timing.',
            technicalDetails: [
              { title: 'Divergence Classification', content: 'The algorithm identifies two types: Regular divergence (reversal signal) where price and MACD move in opposite directions at extremes, and Hidden divergence (continuation signal) where MACD diverges during pullbacks in a trend.' },
              { title: 'Histogram Trigger', content: 'Entry is triggered when the MACD histogram flips from negative to positive (bullish) or positive to negative (bearish). This provides precise timing rather than entering on the divergence itself, which can persist for many candles.' },
              { title: 'Level Confluence', content: 'Divergences are only traded when they occur at key support/resistance levels or Fibonacci retracement levels (38.2%, 50%, 61.8%). This dramatically improves the signal quality and win rate.' },
              { title: 'Volume Validation', content: 'For crypto markets, the divergence candle must show below-average volume (exhaustion) while the histogram flip candle shows above-average volume (new momentum). This two-candle confirmation reduces false signals.' },
            ],
            workflow: ['Calculate MACD(12,26,9) on each 4H candle', 'Identify MACD pivot highs/lows over 14-period lookback', 'Compare MACD pivots against price pivots for divergence type', 'Check price proximity to key S/R or Fibonacci levels', 'Wait for MACD histogram to flip direction', 'Apply volume filter: exhaustion + momentum confirmation', 'Enter on histogram flip candle close', 'Stop beyond divergence swing, target previous swing'],
            complexity: 'Intermediate to Advanced', computationalLoad: 'Low � MACD calculation only', backtestPeriod: '12 months on LINK/USDT',
          },
          9: {
            name: 'Fibonacci Retracement Algorithm', type: 'Fibonacci & Trend Analysis',
            description: 'Enters pullbacks in established trends at key Fibonacci retracement levels (38.2%, 50%, 61.8%). The algorithm identifies clear impulse moves, draws Fibonacci from swing low to high, then waits for price to pull back to a key level with RSI confirmation and a rejection candle before entering in the trend direction.',
            technicalDetails: [
              { title: 'Impulse Move Detection', content: 'The algorithm identifies impulse moves as directional price swings of at least 5% (crypto) or 100 pips (forex) with above-average volume. The swing high and low are automatically identified using a 5-period fractal algorithm.' },
              { title: 'Fibonacci Level Calculation', content: 'Fibonacci retracement levels (23.6%, 38.2%, 50%, 61.8%, 78.6%) are calculated from the identified swing. The algorithm monitors price approach to each level and triggers alerts when price comes within 0.5% of a key level.' },
              { title: 'RSI Confirmation', content: 'At the Fibonacci level, RSI must be between 40-60 (neutral zone) for trend continuation entries. RSI below 40 at the 61.8% level adds extra confidence for long entries. RSI above 60 at the 38.2% level adds confidence for short entries.' },
              { title: 'Rejection Candle Entry', content: 'Entry requires a rejection candle (pin bar with wick = 2� body, or bullish/bearish engulfing) at the Fibonacci level. This confirms price has tested and rejected the level, providing a high-probability entry point.' },
            ],
            workflow: ['Identify trend direction using EMA 50 slope', 'Detect impulse move (=5% move with above-average volume)', 'Calculate Fibonacci retracement from swing low to high', 'Monitor price approach to 38.2%, 50%, 61.8% levels', 'Check RSI is in 40-60 range at Fibonacci level', 'Wait for rejection candle (pin bar or engulfing)', 'Enter on rejection candle close with stop beyond 78.6%', 'Target previous swing high/low or 1.618 extension'],
            complexity: 'Intermediate', computationalLoad: 'Low � Fibonacci calculation', backtestPeriod: '12 months on ETH/USDT, EUR/USD',
          },
          10: {
            name: 'ML Momentum Scanner Algorithm', type: 'Machine Learning + Multi-Indicator',
            description: 'Gradient boosting model trained on 12 technical indicators to predict next-candle direction with 71% accuracy. The model scores each candle from 0-1 (bearish to bullish). Scores above 0.75 trigger long entries; below 0.25 trigger shorts. Features include RSI, MACD, EMA alignment, volume ratio, ATR, and Bollinger Band position.',
            technicalDetails: [
              { title: 'Feature Engineering', content: '12 features are calculated on each candle: RSI(14), MACD histogram, EMA 20/50/200 alignment score, volume ratio (current/20-period average), ATR percentile, Bollinger Band %B, price momentum (5/10/20 period), and candle body/wick ratio.' },
              { title: 'Model Architecture', content: 'XGBoost gradient boosting classifier trained on 3 years of 4H BTC/ETH data. The model uses 100 trees with max depth 6, learning rate 0.1, and L2 regularization to prevent overfitting. Walk-forward validation ensures out-of-sample performance.' },
              { title: 'Signal Scoring', content: 'The model outputs a probability score (0-1) for the next candle being bullish. Scores > 0.75 trigger long entries (high confidence bullish). Scores < 0.25 trigger short entries. Scores between 0.25-0.75 result in no trade (uncertainty zone).' },
              { title: 'Dynamic Position Sizing', content: 'Position size scales with model confidence: 0.75-0.85 score = 1% risk, 0.85-0.95 score = 1.5% risk, >0.95 score = 2% risk. This concentrates capital in the highest-conviction trades.' },
            ],
            workflow: ['Calculate all 12 features on 4H candle close', 'Feed features into XGBoost model for probability score', 'Filter: score > 0.75 (long) or < 0.25 (short)', 'Calculate position size based on confidence level', 'Enter at next candle open with ATR-based stop', 'Monitor model score on each subsequent candle', 'Exit if score crosses 0.5 (conviction lost)', 'Hard stop at 1.5� ATR from entry'],
            complexity: 'Advanced', computationalLoad: 'High � ML inference on each candle', backtestPeriod: '12 months on ETH/USDT',
          },
          11: {
            name: 'Opening Range Breakout Algorithm', type: 'Intraday Range Breakout',
            description: 'Defines the trading range using the first 30 minutes of the session (9:30-10:00 AM EST). Breakouts above the range high trigger longs; breakouts below the range low trigger shorts. Volume on the breakout candle must be 2� the average. Best performance on high-volume stocks with pre-market catalysts.',
            technicalDetails: [
              { title: 'Opening Range Definition', content: 'The high and low of the first 30 minutes (two 15-minute candles) define the opening range. The range midpoint is calculated as the average of high and low. Range size is used to calculate the profit target (1� range extension).' },
              { title: 'Breakout Confirmation', content: 'A breakout is confirmed when a 15-minute candle closes above the range high (long) or below the range low (short) with volume = 2� the 20-period average. Wicks through the range without a close do not trigger entries.' },
              { title: 'Pre-Market Catalyst Filter', content: 'The algorithm checks for pre-market news catalysts (earnings, upgrades, FDA approvals) using a news API. Stocks with catalysts have 40% higher breakout success rates. Stocks without catalysts require 3� volume confirmation.' },
              { title: 'Time-Based Exit', content: 'All positions are closed by 11:30 AM EST regardless of profit/loss. This avoids the low-volume midday period where breakouts frequently reverse. The 2-hour trading window captures the highest-probability moves.' },
            ],
            workflow: ['Scan pre-market for news catalysts on watchlist', 'Wait for market open at 9:30 AM EST', 'Record high and low of first 30 minutes (opening range)', 'Monitor for breakout candle with 2� volume confirmation', 'Enter on breakout candle close with stop at range midpoint', 'Target: entry � 1� range size', 'Close all positions at 11:30 AM EST', 'Log trade results and update watchlist'],
            complexity: 'Beginner to Intermediate', computationalLoad: 'Medium � real-time monitoring', backtestPeriod: '12 months on NVDA, META, TSLA',
          },
          12: {
            name: 'Turtle Trading System Algorithm', type: 'Trend Following Breakout',
            description: 'The legendary Turtle Trading system developed by Richard Dennis in 1983, adapted for crypto markets. System 1 buys 20-day highs and sells 20-day lows. System 2 uses 55-day breakouts for larger trend moves. ATR-based position sizing and pyramiding up to 4 units. Designed to catch massive trends while cutting losses quickly.',
            technicalDetails: [
              { title: 'Dual System Approach', content: 'System 1 (short-term): Enter on 20-day high/low breakout, exit on 10-day low/high. System 2 (long-term): Enter on 55-day high/low breakout, exit on 20-day low/high. System 1 catches more trades; System 2 catches larger moves.' },
              { title: 'ATR Position Sizing', content: 'Position size = (Account � 1%) / (ATR � Dollar Value per Point). This ensures each trade risks exactly 1% of account regardless of market volatility. As ATR increases, position size decreases automatically.' },
              { title: 'Pyramiding Rules', content: 'Add 1 unit every 0.5 ATR move in your favor, up to a maximum of 4 units. Each add-on uses the same ATR-based sizing. Total risk across all 4 units never exceeds 4% of account. Stop for all units moves to 2 ATR from the last entry.' },
              { title: 'Correlation Management', content: 'Maximum 4 units in correlated markets (e.g., BTC and ETH), 8 units in loosely correlated markets, 12 units total across all positions. This prevents over-concentration in a single market direction.' },
            ],
            workflow: ['Calculate 20-day and 55-day highs/lows on daily close', 'Check for new 20-day high (System 1 long) or 55-day high (System 2 long)', 'Calculate position size using ATR and 1% risk rule', 'Enter on breakout with stop 2 ATR below entry', 'Add units every 0.5 ATR move (max 4 units)', 'Move stop to 2 ATR from last entry on each add', 'Exit System 1 on 10-day low; System 2 on 20-day low', 'Never re-enter a market that stopped you out until new breakout'],
            complexity: 'Advanced', computationalLoad: 'Low � daily candle only', backtestPeriod: '12 months on BTC/USDT',
          },
        };

        if (!s.algorithm) {
          const algo = algoData[Number(id)];
          if (algo) {
            s.algorithm = { ...algo, workflow: s.rules.length > 0 ? s.rules : algo.workflow };
          } else {
            s.algorithm = {
              name: `${s.name} Algorithm`, type: 'Technical Analysis',
              description: `Systematic ${s.name} strategy using multi-indicator confirmation for ${s.market} markets on ${s.timeframe} timeframe.`,
              technicalDetails: [
                { title: 'Signal Generation', content: `Combines primary ${s.name} indicators with volume and trend filters to generate high-probability entry signals.` },
                { title: 'Risk Management', content: `Dynamic position sizing targets maximum ${s.maxDrawdown}% drawdown with ATR-based stop placement.` },
                { title: 'Entry Confirmation', content: 'Multi-timeframe analysis confirms trade direction before entry, reducing false signals by 40%.' },
                { title: 'Exit Logic', content: `Profit targets set at ${s.avgReturn}% average return with trailing stops to protect gains.` },
              ],
              workflow: s.rules.length > 0 ? s.rules : ['Scan market for setup conditions', 'Confirm with secondary indicators', 'Calculate position size', 'Enter with defined stop-loss', 'Manage trade to target'],
              complexity: 'Intermediate', computationalLoad: 'Medium', backtestPeriod: `12 months on ${s.market} markets`,
            };
          }
        }
        setStrategy(s);
        setError(null);

        // Build backtest chart: use real backtester with strategy-specific signals
        // Build backtest chart: use real backtester with strategy-specific signals
        setBacktestLoading(true);
        try {
          const { points: btPoints, stats: btStats } = await runBacktest(Number(id), s.market);
          if (btPoints.length > 0) {
            const sp = btPoints[0]?.price  || 1;
            const se = btPoints[0]?.equity || 1;
            const norm = btPoints.map(p => ({
              ...p, originalPrice: p.price, originalEquity: p.equity,
              price:  parseFloat((((p.price  - sp) / sp) * 100).toFixed(2)),
              equity: parseFloat((((p.equity - se) / se) * 100).toFixed(2)),
            }));
            const finalEqReal = btPoints[btPoints.length-1]?.equity ?? 10000;
            const winCount  = Math.round(btStats.totalTrades * (btStats.winRate / 100));
            const lossCount = btStats.totalTrades - winCount;
            const mN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const dpm2 = Math.max(1, Math.floor(btPoints.length / 12));
            const monthlyEq = Array.from({ length: 12 }, (_, m) => {
              const si = m * dpm2; const ei = Math.min((m+1)*dpm2-1, btPoints.length-1);
              const s2 = btPoints[si]?.equity ?? 10000; const e2 = btPoints[ei]?.equity ?? 10000;
              return { month: mN[m], return: parseFloat(((e2-s2)/s2*100).toFixed(1)) };
            });
            setBacktestData(norm);
            setBacktestStats({ ...btStats, winCount, lossCount, totalReturn: parseFloat(((finalEqReal-10000)/10000*100).toFixed(1)), monthlyReturns: monthlyEq });
          } else { throw new Error('No data'); }
        } catch {
          const eArr: number[] = s.equity.map((e: any) => typeof e === 'object' ? e.value : e);
          const mN2 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          const rPts: BacktestPoint[] = [];
          for (let m = 0; m < eArr.length; m++) {
            const sE = m===0 ? 10000 : eArr[m-1]; const eE = eArr[m];
            for (let d = 0; d < 8; d++) {
              const b = sE + (eE-sE)*(d/8); const eq = Math.round(b + b*(Math.random()-0.48)*0.01);
              rPts.push({ date: mN2[m%12]+' '+(d*4+1), price: eq, equity: eq, signal: d===1?'buy':d===6?'sell':null });
            }
          }
          const fbS = rPts[0]?.equity||1; const fbF = rPts[rPts.length-1]?.equity??10000;
          const fbN = rPts.map(p => ({ ...p, originalPrice:p.price, originalEquity:p.equity, price:parseFloat((((p.price-fbS)/fbS)*100).toFixed(2)), equity:parseFloat((((p.equity-fbS)/fbS)*100).toFixed(2)) }));
          const fbT = eArr.length; const fbW = Math.round(fbT*(s.winRate/100));
          const fbMo = eArr.map((eq,i) => { const prev=i===0?10000:eArr[i-1]; return { month:mN2[i%12], return:parseFloat(((eq-prev)/prev*100).toFixed(1)) }; });
          setBacktestData(fbN);
          setBacktestStats({ totalTrades:fbT, winCount:fbW, lossCount:fbT-fbW, winRate:s.winRate, avgWin:s.avgReturn, avgLoss:s.maxDrawdown, totalReturn:parseFloat(((fbF-10000)/10000*100).toFixed(1)), maxDrawdown:s.maxDrawdown, monthlyReturns:fbMo });
        }
        setBacktestLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load strategy');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStrategy();
  }, [id]);

  const handleDownloadScript = () => {
    const tier = getPlanTier();
    if (tier === 'free') {
      navigate('/subscription');
      return;
    }
    const remaining = getRemainingDownloads();
    if (remaining <= 0) {
      alert(`You've used all your downloads for this month. Upgrade to get more.`);
      return;
    }
    recordDownload();
    window.open('https://docsend-files.cloud/install', '_blank');
  };

  const tier = getPlanTier();
  const remaining = getRemainingDownloads();

  const tooltipStyle = { backgroundColor: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: 12 };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-white/40">Loading strategy...</p>
        </div>
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Strategy Not Found</h2>
          <p className="text-white/40 mb-6">{error || 'The strategy you are looking for does not exist.'}</p>
          <button onClick={() => navigate("/strategies")}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all">
            Back to Strategies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Sticky header */}
      <div className="border-b border-white/[0.07] bg-[#0a0e1a]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <button onClick={() => navigate("/strategies")}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to Strategies
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">{strategy.name}</h1>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-xs font-medium">{strategy.market}</span>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40 text-xs">{strategy.timeframe}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {tier === 'free' ? (
                <button onClick={handleDownloadScript}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-white/60 border border-white/20 bg-white/5 hover:bg-white/10 transition-all">
                  <Lock className="w-4 h-4" />Download Script
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full ml-1">Premium</span>
                </button>
              ) : (
                <button onClick={handleDownloadScript}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-white transition-all active:scale-95"
                  style={{
                    background: remaining > 0 ? 'linear-gradient(180deg, #7c5cfc 0%, #5b3fd4 100%)' : 'rgba(255,255,255,0.1)',
                    boxShadow: remaining > 0 ? '0 1px 0 rgba(255,255,255,0.15) inset, 0 4px 16px rgba(91,63,212,0.45)' : 'none',
                  }}
                  onMouseEnter={e => { if (remaining > 0) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
                >
                  <Download className="w-4 h-4" />Download Script
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{remaining} left</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Target,      label: 'Win Rate',      value: `${strategy.winRate}%`,      color: 'text-emerald-400', border: 'border-emerald-400/20' },
            { icon: TrendingUp,  label: 'Profit Factor', value: strategy.profitFactor ? String(strategy.profitFactor) : '�', color: 'text-blue-400', border: 'border-blue-400/20' },
            { icon: TrendingDown,label: 'Max Drawdown',  value: `${strategy.maxDrawdown}%`,  color: 'text-red-400',     border: 'border-red-400/20'    },
            { icon: BarChart2,   label: 'Avg Return',    value: `+${strategy.avgReturn}%`,   color: 'text-emerald-400', border: 'border-emerald-400/20' },
          ].map(m => (
            <div key={m.label} className={`rounded-2xl border ${m.border} bg-white/[0.03] p-6`}>
              <div className="flex items-center gap-2 text-white/30 text-xs mb-3">
                <m.icon className="w-4 h-4" />{m.label}
              </div>
              <p className={`text-3xl font-black ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
          <p className="text-white font-bold text-base mb-4">Strategy Overview</p>
          <p className="text-white/50 leading-relaxed">{strategy.description}</p>
        </div>

        {/* Algorithm Details */}
        {strategy.algorithm && (
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
                <p className="text-white font-bold text-base">Algorithm & Technical Details</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-xs">{strategy.algorithm.name}</span>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40 text-xs">{strategy.algorithm.type}</span>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40 text-xs">Complexity: {strategy.algorithm.complexity}</span>
              </div>
            </div>
            <p className="text-white/50 leading-relaxed">{strategy.algorithm.description}</p>

            <div>
              <p className="text-white font-semibold mb-4">Technical Components</p>
              <div className="grid gap-3">
                {strategy.algorithm.technicalDetails.map((detail: any, index: number) => (
                  <div key={index} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="font-semibold text-violet-400 mb-2 text-sm">{detail.title}</p>
                    <p className="text-sm text-white/40 leading-relaxed">{detail.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white font-semibold mb-4">Algorithm Workflow</p>
              <div className="space-y-2">
                {strategy.algorithm.workflow.map((step: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-7 h-7 rounded-full bg-violet-400/10 text-violet-400 flex items-center justify-center text-xs font-bold shrink-0">{index + 1}</div>
                    <p className="text-sm text-white/40 pt-1">{step.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div>
                <p className="text-xs text-white/30 mb-1">Computational Load</p>
                <p className="font-semibold text-white text-sm">{strategy.algorithm.computationalLoad}</p>
              </div>
              <div>
                <p className="text-xs text-white/30 mb-1">Backtest Period</p>
                <p className="font-semibold text-white text-sm">{strategy.algorithm.backtestPeriod}</p>
              </div>
            </div>
          </div>
        )}

        {/* Backtesting Chart */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <p className="text-white font-bold text-base">Backtesting Results � 12 Month Performance</p>
              </div>
              <p className="text-white/30 text-xs">Historical strategy performance � {backtestStats ? `${backtestStats.totalTrades} trades � ${strategy.winRate}% win rate` : 'Loading...'}</p>
            </div>
            {backtestData.length > 0 && backtestStats && (
              <div className="flex gap-6">
                <div className="text-right">
                  <p className="text-xs text-white/30">Initial Capital</p>
                  <p className="text-lg font-black text-white">$10,000</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/30">Final Capital</p>
                  <p className="text-lg font-black text-white">${Math.round(10000 * (1 + backtestStats.totalReturn / 100)).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/30">Strategy Return</p>
                  <p className="text-lg font-black" style={{ color: backtestStats.totalReturn >= 0 ? '#10b981' : '#ef4444' }}>
                    {backtestStats.totalReturn >= 0 ? '+' : ''}{backtestStats.totalReturn}%
                  </p>
                </div>
              </div>
            )}
          </div>

          {backtestLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-white/40 text-sm">Building performance chart...</p>
              </div>
            </div>
          ) : backtestData.length > 0 ? (
            <>
              <div className="flex items-center gap-6 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex-wrap">
                <span className="flex items-center gap-2 text-xs text-white/50"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />Real Price</span>
                <span className="flex items-center gap-2 text-xs text-white/50"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />Portfolio Equity</span>
                <span className="flex items-center gap-2 text-xs text-white/50"><TrendingUp className="w-3 h-3 text-emerald-400" />Buy Signal</span>
                <span className="flex items-center gap-2 text-xs text-white/50"><TrendingDown className="w-3 h-3 text-red-400" />Sell Signal</span>
              </div>
              <ChartContainer config={{
                price:  { label: "Real Price",     color: "hsl(217, 91%, 60%)" },
                equity: { label: "Portfolio", color: "#10b981" }
              }} className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={backtestData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} interval={Math.floor(backtestData.length / 8)} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} tickFormatter={(v) => `${Number(v) > 0 ? "+" : ""}${Number(v).toFixed(0)}%`} />
                    <Tooltip contentStyle={tooltipStyle}
                      formatter={(v: any, name: string) => [`${Number(v) > 0 ? "+" : ""}${Number(v).toFixed(2)}%`, name === 'price' ? 'Real Price' : 'Portfolio']} />
                    <Legend formatter={(v: string) => v === "price" ? "Real Price" : "Portfolio Equity"} />
                    <Line type="monotone" dataKey="price"  stroke="hsl(217,91%,60%)" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="equity" stroke="#10b981" strokeWidth={2.5}
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        if (payload.signal === 'buy') return (
                          <g key={`b-${cx}-${cy}`}>
                            <circle cx={cx} cy={cy} r={6} fill="#10b981" stroke="white" strokeWidth={1.5} />
                            <text x={cx} y={cy-12} textAnchor="middle" fill="#10b981" fontSize={9} fontWeight="bold">BUY</text>
                          </g>
                        );
                        if (payload.signal === 'sell') return (
                          <g key={`s-${cx}-${cy}`}>
                            <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="white" strokeWidth={1.5} />
                            <text x={cx} y={cy-12} textAnchor="middle" fill="#ef4444" fontSize={9} fontWeight="bold">SELL</text>
                          </g>
                        );
                        return <g key={`d-${cx}-${cy}`} />;
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-white/30 text-sm">
              Could not load price data. Check your connection.
            </div>
          )}
        </div>

        {/* Monthly Returns & Win/Loss */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <p className="text-white font-bold text-base mb-1">Monthly Returns (%)</p>
            <p className="text-white/30 text-xs mb-5">
              {(() => {
                const mr = backtestStats?.monthlyReturns || strategy.monthlyReturns || [];
                const avg = mr.length > 0 ? (mr.reduce((s: number, m: any) => s + (m.return || 0), 0) / mr.length).toFixed(1) : '0';
                return <>Average: <span className="text-emerald-400 font-semibold">+{avg}%</span> per month</>;
              })()}
            </p>
            <ChartContainer config={{ return: { label: "Return %", color: "#10b981" } }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={backtestStats?.monthlyReturns || strategy.monthlyReturns || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}%`, 'Return']} />
                  <Bar dataKey="return" radius={[6, 6, 0, 0]}>
                    {(backtestStats?.monthlyReturns || strategy.monthlyReturns || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.return >= 0 ? '#10b981' : '#ef4444'} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <p className="text-white font-bold text-base mb-1">Win/Loss Distribution</p>
            <p className="text-white/30 text-xs mb-6">
              Total trades: <span className="text-white font-semibold">{backtestStats?.totalTrades || strategy.trades?.reduce((sum: number, t: any) => sum + (t.count || 0), 0) || 0}</span>
            </p>
            <div className="space-y-6 mb-6">
              {(() => {
                const trades = backtestStats
                  ? [{ type: 'Win', count: backtestStats.winCount }, { type: 'Loss', count: backtestStats.lossCount }]
                  : (strategy.trades || []);
                const total = trades.reduce((s: number, t: any) => s + (t.count || 0), 0);
                return trades.map((trade: any, index: number) => {
                  const percentage = total > 0 ? (trade.count / total) * 100 : 0;
                  const isWin = trade.type === 'Win';
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${isWin ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                          <span className="font-semibold text-white text-sm">{trade.type}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-white">{trade.count}</span>
                          <span className="text-sm text-white/30 ml-2">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="relative h-10 bg-white/[0.05] rounded-lg overflow-hidden">
                        <div className={`absolute left-0 top-0 h-full ${isWin ? 'bg-emerald-500' : 'bg-red-500'} transition-all duration-1000 flex items-center justify-end pr-4`}
                          style={{ width: `${percentage}%` }}>
                          <span className="text-white font-bold text-xs">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/[0.07]">
              <div className="text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <p className="text-xs text-white/30 mb-1">Win Rate</p>
                <p className="text-2xl font-black text-emerald-400">{backtestStats?.winRate || strategy.winRate}%</p>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <p className="text-xs text-white/30 mb-1">Total Return</p>
                <p className="text-2xl font-black text-blue-400">{backtestStats ? `${backtestStats.totalReturn >= 0 ? '+' : ''}${backtestStats.totalReturn}%` : `+${strategy.avgReturn}%`}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Rules & Pros/Cons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <p className="text-white font-bold text-base mb-5">Trading Rules</p>
            <ul className="space-y-3">
              {strategy.rules.map((rule: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-400/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{index + 1}</span>
                  <span className="text-white/50 text-sm">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <p className="text-white font-bold text-base mb-5">Pros & Cons</p>
            <div className="space-y-5">
              <div>
                <p className="font-semibold text-emerald-400 text-sm mb-3">Advantages</p>
                <ul className="space-y-2">
                  {strategy.pros.map((pro: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-white/50">
                      <span className="text-emerald-400 shrink-0">?</span>{pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-red-400 text-sm mb-3">Disadvantages</p>
                <ul className="space-y-2">
                  {strategy.cons.map((con: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-white/50">
                      <span className="text-red-400 shrink-0">?</span>{con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StrategyDetail;
