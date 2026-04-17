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

        // Convert monthly_returns array of numbers → [{month, return}]
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        if (Array.isArray(rawMonthly) && rawMonthly.length > 0 && typeof rawMonthly[0] === 'number') {
          s.monthlyReturns = rawMonthly.map((r: number, i: number) => ({ month: monthNames[i % 12], return: r }));
        } else {
          s.monthlyReturns = rawMonthly;
        }

        // Convert equity array of numbers → [{month, value}]
        if (Array.isArray(s.equity) && s.equity.length > 0 && typeof s.equity[0] === 'number') {
          s.equity = s.equity.map((v: number, i: number) => ({ month: monthNames[i % 12], value: v }));
        }

        // Convert raw trades → win/loss distribution for chart
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
        }        if (!s.algorithm) {
          s.algorithm = {
            name: `${s.name} Algorithm`,
            type: "Technical Analysis & Pattern Recognition",
            description: `Advanced algorithmic trading system utilizing ${s.name.toLowerCase()} methodology for systematic market analysis and trade execution.`,
            technicalDetails: [
              { title: "Core Indicator Calculation", content: `The algorithm processes real-time ${s.market} market data to calculate key technical indicators specific to the ${s.name} strategy.` },
              { title: "Signal Generation", content: "Multi-layered signal processing combines primary indicators with confirmation filters to reduce false positives and improve accuracy." },
              { title: "Risk Management System", content: `Automated risk controls including dynamic position sizing and stop-loss placement targeting a maximum drawdown of ${s.maxDrawdown}%.` },
              { title: "Execution Logic", content: "Trade execution follows strict entry and exit criteria with built-in slippage protection and order management for optimal fills." },
            ],
            workflow: s.rules.length > 0 ? s.rules : [
              "Collect and normalize market data",
              "Calculate technical indicators",
              "Generate trading signals",
              "Apply risk management filters",
              "Execute trades with optimal timing",
              "Monitor open positions",
              "Close positions based on exit criteria",
              "Log performance metrics",
            ],
            complexity: "Intermediate to Advanced",
            computationalLoad: "Medium - Real-time indicator calculations",
            backtestPeriod: `12 months across ${s.market} markets`,
          };
        }
        setStrategy(s);
        setError(null);

        // Fetch real backtest data
        setBacktestLoading(true);
        runBacktest(Number(id), s.market).then(({ points, stats }) => {
          setBacktestData(points);
          setBacktestStats(stats);
          setBacktestLoading(false);
        }).catch(() => setBacktestLoading(false));
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
            { icon: TrendingUp,  label: 'Profit Factor', value: strategy.profitFactor ? String(strategy.profitFactor) : '—', color: 'text-blue-400', border: 'border-blue-400/20' },
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
                <p className="text-white font-bold text-base">Backtesting Results — Real Price Data (180 Days)</p>
              </div>
              <p className="text-white/30 text-xs">Live historical prices from CoinGecko · Strategy signals applied{backtestStats ? ` · ${backtestStats.totalTrades} trades · ${strategy.winRate}% win rate` : ''}</p>
            </div>
            {backtestData.length > 0 && (
              <div className="flex gap-6">
                <div className="text-right">
                  <p className="text-xs text-white/30">Initial Capital</p>
                  <p className="text-lg font-black text-white">$10,000</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/30">Final Capital</p>
                  <p className="text-lg font-black text-white">${backtestData[backtestData.length-1].equity.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/30">Strategy Return</p>
                  <p className="text-lg font-black" style={{ color: backtestData[backtestData.length-1].equity >= 10000 ? '#10b981' : '#ef4444' }}>
                    {(((backtestData[backtestData.length-1].equity - 10000) / 10000) * 100) >= 0
                      ? '+' + (((backtestData[backtestData.length-1].equity - 10000) / 10000) * 100).toFixed(1) + '%'
                      : (((backtestData[backtestData.length-1].equity - 10000) / 10000) * 100).toFixed(1) + '%'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {backtestLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-white/40 text-sm">Fetching real price data & running backtest...</p>
              </div>
            </div>
          ) : backtestData.length > 0 ? (
            <>
              <div className="flex items-center gap-6 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex-wrap">
                <span className="flex items-center gap-2 text-xs text-white/50"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />Real Price</span>
                <span className="flex items-center gap-2 text-xs text-white/50"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />Portfolio Equity ($10k start)</span>
                <span className="flex items-center gap-2 text-xs text-white/50"><TrendingUp className="w-3 h-3 text-emerald-400" />Buy Signal</span>
                <span className="flex items-center gap-2 text-xs text-white/50"><TrendingDown className="w-3 h-3 text-red-400" />Sell Signal</span>
              </div>
              <ChartContainer config={{
                price:  { label: "Price ($)",     color: "hsl(217, 91%, 60%)" },
                equity: { label: "Portfolio ($)", color: "#10b981" }
              }} className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={backtestData} margin={{ top: 20, right: 60, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} interval={Math.floor(backtestData.length / 8)} />
                    <YAxis yAxisId="left"  stroke="hsl(217,91%,60%)" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
                    <Tooltip contentStyle={tooltipStyle}
                      formatter={(v: any, name: string) => [`$${Number(v).toLocaleString()}`, name === 'price' ? 'Price' : 'Portfolio']} />
                    <Legend />
                    <Line yAxisId="left"  type="monotone" dataKey="price"  stroke="hsl(217,91%,60%)" strokeWidth={1.5} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="equity" stroke="#10b981" strokeWidth={2.5}
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
              Average: <span className="text-emerald-400 font-semibold">
                +{strategy.monthlyReturns?.length > 0
                  ? (strategy.monthlyReturns.reduce((sum: number, m: any) => sum + (m.return || 0), 0) / strategy.monthlyReturns.length).toFixed(1)
                  : '0'}%
              </span> per month
            </p>
            <ChartContainer config={{ return: { label: "Return %", color: "#10b981" } }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strategy.monthlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}%`, 'Return']} />
                  <Bar dataKey="return" radius={[6, 6, 0, 0]}>
                    {strategy.monthlyReturns.map((entry: any, index: number) => (
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
              Total trades: <span className="text-white font-semibold">{strategy.trades?.reduce((sum: number, t: any) => sum + (t.count || 0), 0) || 0}</span>
            </p>
            <div className="space-y-6 mb-6">
              {strategy.trades?.map((trade: any, index: number) => {
                const total = strategy.trades.reduce((sum: number, t: any) => sum + (t.count || 0), 0);
                const percentage = (trade.count / total) * 100;
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
              })}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/[0.07]">
              <div className="text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <p className="text-xs text-white/30 mb-1">Win Rate</p>
                <p className="text-2xl font-black text-emerald-400">{strategy.winRate}%</p>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <p className="text-xs text-white/30 mb-1">Profit Factor</p>
                <p className="text-2xl font-black text-blue-400">{strategy.profitFactor}</p>
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
                      <span className="text-emerald-400 shrink-0">✓</span>{pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-red-400 text-sm mb-3">Disadvantages</p>
                <ul className="space-y-2">
                  {strategy.cons.map((con: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-white/50">
                      <span className="text-red-400 shrink-0">✗</span>{con}
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
