import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MarketTicker from '@/components/MarketTicker';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import {
  TrendingUp, Target, Award, Activity, BarChart3,
  Zap, TrendingDown, ArrowRight, Crown,
  ChevronLeft, ChevronRight, ShieldCheck, CalendarCheck,
  Monitor, Download, Cpu, LineChart, Bell, Lock, RefreshCw, LayoutDashboard,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Bar, ReferenceLine, Cell,
} from 'recharts';
import { checkSubscription } from '@/lib/metamask';

const heroSlides = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=90',
    eyebrow: 'DAILY EDGE',
    headline: ['Outperform', 'the market.'],
    sub: 'Two fresh, backtested strategies land every morning — so your edge never expires.',
    accent: 'from-emerald-400 to-teal-400',
    btnBg: 'bg-white text-slate-900 hover:bg-white/90',
    btnOutline: 'border-white/40 text-white hover:bg-white/10',
  },
  {
    src: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&w=1920&q=90',
    eyebrow: 'CRYPTO ALPHA',
    headline: ['Trade the future', 'of money.'],
    sub: 'Strategies engineered for crypto volatility — BTC, ETH, SOL and beyond.',
    accent: 'from-violet-400 to-indigo-400',
    btnBg: 'bg-violet-500 text-white hover:bg-violet-600',
    btnOutline: 'border-white/40 text-white hover:bg-white/10',
  },
  {
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=90',
    eyebrow: 'VERIFIED RESULTS',
    headline: ['730+ strategies', 'per year.'],
    sub: 'Every strategy is 100% backtested and verified before it reaches your dashboard.',
    accent: 'from-amber-400 to-orange-400',
    btnBg: 'bg-amber-400 text-slate-900 hover:bg-amber-300',
    btnOutline: 'border-white/40 text-white hover:bg-white/10',
  },
];

const btcEquity = [
  { d: 'Jan', strategy: 10000, market: 10000 },
  { d: 'Feb', strategy: 11200, market: 9800 },
  { d: 'Mar', strategy: 12800, market: 10400 },
  { d: 'Apr', strategy: 12100, market: 9600 },
  { d: 'May', strategy: 14500, market: 10900 },
  { d: 'Jun', strategy: 16200, market: 10200 },
  { d: 'Jul', strategy: 15400, market: 9700 },
  { d: 'Aug', strategy: 18900, market: 11100 },
  { d: 'Sep', strategy: 21300, market: 10500 },
  { d: 'Oct', strategy: 19800, market: 9900 },
  { d: 'Nov', strategy: 24600, market: 11800 },
  { d: 'Dec', strategy: 28400, market: 12200 },
];

const monthlyReturns = [
  { m: 'Jan', r: 0 }, { m: 'Feb', r: 12 }, { m: 'Mar', r: 14.3 },
  { m: 'Apr', r: -5.5 }, { m: 'May', r: 19.8 }, { m: 'Jun', r: 11.7 },
  { m: 'Jul', r: -4.9 }, { m: 'Aug', r: 22.7 }, { m: 'Sep', r: 12.7 },
  { m: 'Oct', r: -7.0 }, { m: 'Nov', r: 24.2 }, { m: 'Dec', r: 15.4 },
];

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    checkSubscription();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((p) => (p + 1) % heroSlides.length), 7000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { title: 'Active Strategies', value: '12', icon: Target, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', change: '+3 this week', link: '/' },
    { title: 'Total Profit', value: '+24.5%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', change: '+5.2% this month', link: '/dashboard' },
    { title: 'Win Rate', value: '68%', icon: Activity, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20', change: '+2% vs last month', link: '/dashboard' },
    { title: 'Total Trades', value: '247', icon: BarChart3, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', change: '18 today', link: '/dashboard' },
  ];

  const performanceData = [
    { month: 'Jan', value: 10000 }, { month: 'Feb', value: 10650 },
    { month: 'Mar', value: 11420 }, { month: 'Apr', value: 10890 },
    { month: 'May', value: 12340 }, { month: 'Jun', value: 13680 },
    { month: 'Jul', value: 12980 }, { month: 'Aug', value: 15120 },
    { month: 'Sep', value: 16890 }, { month: 'Oct', value: 15740 },
    { month: 'Nov', value: 18920 }, { month: 'Dec', value: 21700 },
  ];

  const recentTrades = [
    { id: 1, strategy: 'Breakout Momentum', pair: 'BTC/USDT', type: 'buy', profit: '+12.3%', time: '2h ago', status: 'active' },
    { id: 2, strategy: 'Mean Reversion RSI', pair: 'ETH/USDT', type: 'sell', profit: '+8.7%', time: '5h ago', status: 'closed' },
    { id: 3, strategy: 'Ichimoku Cloud', pair: 'SOL/USDT', type: 'buy', profit: '-2.1%', time: '1d ago', status: 'active' },
    { id: 4, strategy: 'VWAP Scalper', pair: 'AAPL', type: 'sell', profit: '+15.4%', time: '1d ago', status: 'closed' },
  ];

  const topStrategies = [
    { id: 10, name: 'Machine Learning Momentum', return: '+137%', winRate: 61, trades: 89, icon: Zap },
    { id: 2, name: 'Breakout Momentum Scanner', return: '+121%', winRate: 58, trades: 67, icon: TrendingUp },
    { id: 3, name: 'Turtle Trading System', return: '+72%', winRate: 42, trades: 124, icon: Activity },
  ];

  const current = heroSlides[slide];

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* ── Hero Slider ── */}
      <div className="relative w-full h-screen overflow-hidden">
        {heroSlides.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${s.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </div>
        ))}
        <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-24 max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-px w-8 bg-gradient-to-r ${current.accent}`} />
            <span className={`text-xs font-bold tracking-[0.3em] bg-gradient-to-r ${current.accent} bg-clip-text text-transparent`}>{current.eyebrow}</span>
          </div>
          <h2 className="font-black text-white leading-[1.05] mb-8" style={{ fontSize: 'clamp(2rem, 4.5vw, 4.5rem)' }}>
            <span className="block">{current.headline[0]}</span>
            <span className={`block pb-3 bg-gradient-to-r ${current.accent} bg-clip-text text-transparent`}>{current.headline[1]}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-md leading-relaxed font-light">{current.sub}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={() => navigate('/strategies')} className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm transition-all shadow-lg ${current.btnBg}`}>
              <Zap className="w-4 h-4" />View Today's Strategies
            </button>
            <button onClick={() => navigate('/subscription')} className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm border transition-all ${current.btnOutline}`}>
              Learn More<ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-6 mt-10 flex-wrap">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <CalendarCheck className="w-4 h-4 text-white/40" />
              <span><span className="text-white font-semibold">2 strategies</span> released daily</span>
            </div>
            <div className="w-px h-4 bg-white/15" />
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <ShieldCheck className="w-4 h-4 text-white/40" />
              <span><span className="text-white font-semibold">100%</span> backtested before release</span>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4">
          <span className="text-white/20 text-xs tracking-widest" style={{ writingMode: 'vertical-rl' }}>
            {String(slide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
          </span>
          <div className="flex flex-col gap-1.5">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
                className={`w-0.5 rounded-full transition-all duration-300 ${i === slide ? 'h-10 bg-white' : 'h-4 bg-white/25 hover:bg-white/50'}`} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 right-10 z-10 flex items-center gap-2">
          <button onClick={() => setSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous"
            className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 backdrop-blur-sm flex items-center justify-center text-white transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setSlide((p) => (p + 1) % heroSlides.length)} aria-label="Next"
            className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 backdrop-blur-sm flex items-center justify-center text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 lg:hidden">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
          ))}
        </div>
      </div>

      {/* ── Dashboard content — dark theme matching hero ── */}
      <div className="bg-[#0a0e1a]">
        {/* Market Ticker — full width, flush below hero */}
        <MarketTicker />

        <div className="container mx-auto px-6 py-16 space-y-16">
          <SubscriptionBanner />

          {/* Welcome */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-5xl font-black tracking-tight text-white">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {user?.name ?? 'Trader'}
                </span>
              </h1>
              <p className="text-white/40 mt-3 text-base">Here's your trading overview for today.</p>
            </div>
            <button onClick={() => navigate('/strategies')}
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-all">
              <Zap className="w-4 h-4" />Browse Strategies
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.title} onClick={() => navigate(stat.link)}
                className={`cursor-pointer rounded-2xl border ${stat.border} bg-white/[0.03] hover:bg-white/[0.06] p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/30">{stat.title}</span>
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-4xl font-black tracking-tight text-white mb-1">{stat.value}</div>
                <p className="text-sm text-white/30">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* ── Strategy Performance Section ── */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-6 bg-emerald-500" />
                <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Proven Edge</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">Why our strategies win</h2>
              <p className="text-white/40 mt-1 text-sm">Real backtested performance vs. buy-and-hold market returns</p>
            </div>

            {/* Strategy vs Market + Monthly returns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-bold text-base">Strategy vs. Market</p>
                    <p className="text-white/30 text-xs mt-0.5">Breakout Momentum · 12 months</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" />Strategy +184%</span>
                    <span className="flex items-center gap-1.5 text-white/30"><span className="w-3 h-0.5 bg-white/20 inline-block rounded" />Market +22%</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={btcEquity} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6b7280" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="d" fontSize={10} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: 12 }}
                      formatter={(val: any, name: string) => [`$${Number(val).toLocaleString()}`, name === 'strategy' ? 'Strategy' : 'Market']} />
                    <Area type="monotone" dataKey="market" stroke="rgba(107,114,128,0.5)" strokeWidth={1.5} fill="url(#mg)" strokeDasharray="4 3" />
                    <Area type="monotone" dataKey="strategy" stroke="#10b981" strokeWidth={2.5} fill="url(#sg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                <p className="text-white font-bold text-base mb-1">Monthly Returns</p>
                <p className="text-white/30 text-xs mb-4">ML Momentum · 2024</p>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={monthlyReturns} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="m" fontSize={10} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: 12 }}
                      formatter={(val: any) => [`${val}%`, 'Return']} />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                    <Bar dataKey="r" radius={[3, 3, 0, 0]} maxBarSize={24}>
                      {monthlyReturns.map((e, i) => <Cell key={i} fill={e.r >= 0 ? '#10b981' : '#ef4444'} fillOpacity={0.85} />)}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Avg Annual Return', value: '+184%', sub: 'vs +22% market', pos: true },
                { label: 'Win Rate', value: '68%', sub: '247 trades sampled', pos: true },
                { label: 'Max Drawdown', value: '-8.4%', sub: 'Controlled risk', pos: false },
                { label: 'Sharpe Ratio', value: '2.31', sub: 'Risk-adjusted return', pos: true },
              ].map((m) => (
                <div key={m.label} className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">{m.label}</p>
                  <p className={`text-3xl font-black tracking-tight ${m.pos ? 'text-emerald-400' : 'text-red-400'}`}>{m.value}</p>
                  <p className="text-xs text-white/30 mt-1">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Growth + Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-emerald-400" />
                <p className="text-white font-bold text-base">Portfolio Growth</p>
              </div>
              <p className="text-white/30 text-xs mb-5">Your equity curve over the past 12 months</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: 13 }}
                    formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Portfolio Value']} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fill="url(#pf)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-yellow-400" />
                <p className="text-white font-bold text-base">Top Performers</p>
              </div>
              <p className="text-white/30 text-xs mb-5">Best strategies this year</p>
              <div className="space-y-3">
                {topStrategies.map((s, i) => (
                  <div key={s.id} onClick={() => navigate(`/strategy/${s.id}`)}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] hover:bg-white/[0.05] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-yellow-400/10' : i === 1 ? 'bg-blue-400/10' : 'bg-purple-400/10'}`}>
                        {i === 0 ? <Crown className="w-4 h-4 text-yellow-400" /> : <s.icon className={`w-4 h-4 ${i === 1 ? 'text-blue-400' : 'text-purple-400'}`} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{s.name}</p>
                        <p className="text-xs text-white/30 mt-0.5">{s.trades} trades · {s.winRate}% win</p>
                      </div>
                    </div>
                    <span className="text-base font-black text-emerald-400">{s.return}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Desktop App Section ── */}
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.07]">
            {/* background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-[#0a0e1a] to-emerald-900/20" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left — copy */}
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-px w-6 bg-violet-500" />
                  <span className="text-xs font-bold tracking-[0.25em] text-violet-400 uppercase">Desktop App</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.05] mb-5">
                  Trade like a pro.<br />
                  <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                    Right on your desktop.
                  </span>
                </h2>

                <p className="text-white/50 text-base leading-relaxed mb-8 max-w-md">
                  Our native desktop app brings the full power of a professional trading terminal — think MetaTrader, but built around our strategy ecosystem. Live charts, one-click execution, real-time alerts, and your full strategy library, all in one window.
                </p>

                {/* Feature pills */}
                <div className="grid grid-cols-2 gap-3 mb-10">
                  {[
                    { icon: LineChart, label: 'Live candlestick charts', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { icon: Cpu, label: 'Strategy auto-execution', color: 'text-violet-400', bg: 'bg-violet-400/10' },
                    { icon: Bell, label: 'Real-time signal alerts', color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    { icon: LayoutDashboard, label: 'Multi-panel workspace', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { icon: RefreshCw, label: 'Auto strategy sync', color: 'text-teal-400', bg: 'bg-teal-400/10' },
                    { icon: Lock, label: 'Encrypted local data', color: 'text-pink-400', bg: 'bg-pink-400/10' },
                  ].map(({ icon: Icon, label, color, bg }) => (
                    <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                      <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                      </div>
                      <span className="text-xs font-medium text-white/70">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Download buttons */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Download for your platform</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Windows */}
                    <a href="/Tradex.exe" download="Tradex.exe" className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-violet-500/40 transition-all">
                      <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
                        <path d="M3 5.5L10.5 4.5V11.5H3V5.5Z" fill="#00adef"/>
                        <path d="M11.5 4.35L21 3V11.5H11.5V4.35Z" fill="#00adef"/>
                        <path d="M3 12.5H10.5V19.5L3 18.5V12.5Z" fill="#00adef"/>
                        <path d="M11.5 12.5H21V21L11.5 19.65V12.5Z" fill="#00adef"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-[11px] text-white/40 leading-none mb-0.5">Download for</div>
                        <div className="text-sm font-bold text-white">Windows</div>
                        <div className="text-[10px] text-white/30">v2.4.1 · .exe · 64-bit</div>
                      </div>
                      <Download className="w-3.5 h-3.5 text-white/20 group-hover:text-violet-400 ml-auto transition-colors" />
                    </a>

                    {/* macOS */}
                    <button className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-violet-500/40 transition-all">
                      <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path className="text-white/80" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-[11px] text-white/40 leading-none mb-0.5">Download for</div>
                        <div className="text-sm font-bold text-white">macOS</div>
                        <div className="text-[10px] text-white/30">v2.4.1 · .dmg · M1/Intel</div>
                      </div>
                      <Download className="w-3.5 h-3.5 text-white/20 group-hover:text-violet-400 ml-auto transition-colors" />
                    </button>

                    {/* Linux */}
                    <button className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-violet-500/40 transition-all">
                      <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path className="text-white/80" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" opacity="0"/>
                        <path className="text-white/80" d="M17.03 8.29C16.77 5.4 14.65 3 12 3S7.23 5.4 6.97 8.29C5.24 8.86 4 10.48 4 12.4c0 .36.04.71.12 1.05.03.13.07.26.11.38.5 1.52 1.86 2.63 3.49 2.78.07.01.14.01.21.01h.07c.28 0 .55-.03.81-.09.5 1.01 1.54 1.71 2.74 1.71h.9c1.2 0 2.24-.7 2.74-1.71.26.06.53.09.81.09h.07c.07 0 .14 0 .21-.01 1.63-.15 2.99-1.26 3.49-2.78.04-.12.08-.25.11-.38.08-.34.12-.69.12-1.05 0-1.92-1.24-3.54-2.97-4.11zM12 5c1.38 0 2.5 1.12 2.5 2.5S13.38 10 12 10s-2.5-1.12-2.5-2.5S10.62 5 12 5zm0 13c-.83 0-1.5-.67-1.5-1.5S11.17 15 12 15s1.5.67 1.5 1.5S12.83 18 12 18z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-[11px] text-white/40 leading-none mb-0.5">Download for</div>
                        <div className="text-sm font-bold text-white">Linux</div>
                        <div className="text-[10px] text-white/30">v2.4.1 · .AppImage</div>
                      </div>
                      <Download className="w-3.5 h-3.5 text-white/20 group-hover:text-violet-400 ml-auto transition-colors" />
                    </button>
                  </div>

                  {/* version note */}
                  <p className="text-[11px] text-white/20">Free forever · No credit card · Auto-updates</p>
                </div>
              </div>

              {/* Right — Laptop frame with terminal mockup */}
              <div className="relative flex items-center justify-center lg:justify-end overflow-hidden p-6 lg:p-8 lg:pl-0">
                {/* ── Laptop outer shell ── */}
                <div className="relative w-full max-w-[520px] select-none">

                  {/* Screen lid */}
                  <div className="relative rounded-t-2xl rounded-b-md overflow-hidden"
                    style={{ background: 'linear-gradient(145deg,#2a2d3a,#1a1d28)', padding: '10px 10px 0', boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.8)' }}>

                    {/* Camera notch */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#111] border border-white/10 z-10" />

                    {/* Screen bezel */}
                    <div className="rounded-t-xl rounded-b-sm overflow-hidden bg-[#080b14]" style={{ aspectRatio: '16/10' }}>
                      <div className="w-full h-full text-[10px] font-mono flex flex-col">

                  {/* ── Title bar ── */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#12151f] border-b border-white/[0.07]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-white/30 tracking-wide">TradexStrategies  ·  BTC/USDT  ·  1H</span>
                    <div className="flex gap-2 text-white/20">
                      <span>⊟</span><span>⊡</span><span>✕</span>
                    </div>
                  </div>

                  {/* ── Menu bar ── */}
                  <div className="flex items-center gap-4 px-3 py-1 bg-[#0f1220] border-b border-white/[0.05] text-white/40">
                    {['File','View','Charts','Tools','Window','Help'].map(m => (
                      <span key={m} className="hover:text-white/70 cursor-pointer">{m}</span>
                    ))}
                  </div>

                  {/* ── Main body ── */}
                  <div className="flex bg-[#0b0e1a]" style={{ height: '340px' }}>

                    {/* Left sidebar — order entry */}
                    <div className="w-28 shrink-0 border-r border-white/[0.06] bg-[#0d1020] flex flex-col">
                      <div className="px-2 py-1.5 border-b border-white/[0.05] text-white/50 text-[9px] uppercase tracking-widest">Order Entry</div>
                      <div className="px-2 py-2 space-y-1.5">
                        <div className="text-white/30 text-[9px]">Symbol</div>
                        <div className="bg-[#1a1f35] rounded px-1.5 py-1 text-emerald-400 text-[9px]">BTC/USDT</div>
                        <div className="text-white/30 text-[9px] mt-2">Volume</div>
                        <div className="bg-[#1a1f35] rounded px-1.5 py-1 text-white/70 text-[9px]">0.01 BTC</div>
                        <div className="grid grid-cols-2 gap-1 mt-3">
                          <div className="text-[8px] text-white/30">Bid</div>
                          <div className="text-[8px] text-white/30">Ask</div>
                          <div className="text-[9px] text-red-400 font-bold">54,912</div>
                          <div className="text-[9px] text-emerald-400 font-bold">54,916</div>
                        </div>
                        <button className="w-full mt-2 py-1 rounded bg-red-500/80 text-white text-[9px] font-bold">SELL</button>
                        <button className="w-full py-1 rounded bg-emerald-500/80 text-white text-[9px] font-bold">BUY</button>
                      </div>
                      {/* watchlist mini */}
                      <div className="mt-auto border-t border-white/[0.05] px-2 py-1.5">
                        <div className="text-white/30 text-[9px] uppercase tracking-widest mb-1">Watchlist</div>
                        {[
                          { sym: 'BTC/USD', val: '54,916', chg: '+1.2%', up: true },
                          { sym: 'ETH/USD', val: '2,448', chg: '+0.8%', up: true },
                          { sym: 'SOL/USD', val: '142.3', chg: '-0.4%', up: false },
                          { sym: 'EUR/USD', val: '1.0842', chg: '+0.1%', up: true },
                        ].map(w => (
                          <div key={w.sym} className="flex justify-between items-center py-0.5">
                            <span className="text-white/50 text-[8px]">{w.sym}</span>
                            <span className={`text-[8px] font-bold ${w.up ? 'text-emerald-400' : 'text-red-400'}`}>{w.chg}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Center — chart area */}
                    <div className="flex-1 flex flex-col min-w-0">
                      {/* chart toolbar */}
                      <div className="flex items-center gap-2 px-2 py-1 bg-[#0d1020] border-b border-white/[0.05]">
                        {['1m','5m','15m','1H','4H','D'].map(tf => (
                          <span key={tf} className={`px-1.5 py-0.5 rounded text-[9px] cursor-pointer ${tf === '1H' ? 'bg-violet-500/30 text-violet-300' : 'text-white/30 hover:text-white/60'}`}>{tf}</span>
                        ))}
                        <span className="ml-auto text-white/20">|</span>
                        <span className="text-white/30 ml-1">MA</span>
                        <span className="text-white/30">BB</span>
                        <span className="text-white/30">RSI</span>
                      </div>

                      {/* SVG candlestick chart */}
                      <div className="flex-1 relative bg-[#080b14]">
                        <svg width="100%" height="100%" viewBox="0 0 320 220" preserveAspectRatio="none">
                          {/* grid */}
                          {[40,80,120,160,200].map(y => (
                            <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                          ))}
                          {[0,64,128,192,256,320].map(x => (
                            <line key={x} x1={x} y1="0" x2={x} y2="220" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                          ))}
                          {/* MA lines */}
                          <polyline points="0,60 40,65 80,80 120,100 160,115 200,130 240,145 280,155 320,160"
                            fill="none" stroke="#60a5fa" strokeWidth="1.2" opacity="0.7"/>
                          <polyline points="0,55 40,62 80,78 120,105 160,120 200,138 240,150 280,162 320,168"
                            fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity="0.7"/>
                          <polyline points="0,45 40,55 80,72 120,95 160,112 200,128 240,142 280,155 320,165"
                            fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.8"/>
                          {/* candles — green */}
                          {[[8,50,70,55,65],[24,62,82,67,77],[40,55,75,60,70],[56,68,88,73,83],
                            [72,72,92,77,87],[88,78,98,82,92]].map(([x,lo,hi,o,c],i) => (
                            <g key={i}>
                              <line x1={x+4} y1={lo} x2={x+4} y2={hi} stroke="#10b981" strokeWidth="1"/>
                              <rect x={x} y={Math.min(o,c)} width="8" height={Math.abs(c-o)||1} fill="#10b981" opacity="0.9"/>
                            </g>
                          ))}
                          {/* candles — red */}
                          {[[104,90,110,95,105],[120,100,120,105,115],[136,108,128,112,122],
                            [152,115,135,120,130],[168,122,142,128,138],[184,130,150,136,146],
                            [200,138,158,144,154],[216,145,165,152,162],[232,152,172,158,168],
                            [248,160,180,166,176],[264,168,188,174,184],[280,175,195,182,192],
                            [296,183,203,190,200]].map(([x,lo,hi,o,c],i) => (
                            <g key={i}>
                              <line x1={x+4} y1={lo} x2={x+4} y2={hi} stroke="#ef4444" strokeWidth="1"/>
                              <rect x={x} y={Math.min(o,c)} width="8" height={Math.abs(c-o)||1} fill="#ef4444" opacity="0.9"/>
                            </g>
                          ))}
                          {/* buy signal arrow */}
                          <polygon points="72,96 68,104 76,104" fill="#10b981" opacity="0.9"/>
                          {/* sell signal arrow */}
                          <polygon points="168,118 164,110 172,110" fill="#ef4444" opacity="0.9"/>
                          {/* price labels */}
                          <text x="2" y="42" fill="rgba(255,255,255,0.25)" fontSize="7">55,200</text>
                          <text x="2" y="82" fill="rgba(255,255,255,0.25)" fontSize="7">54,900</text>
                          <text x="2" y="122" fill="rgba(255,255,255,0.25)" fontSize="7">54,600</text>
                          <text x="2" y="162" fill="rgba(255,255,255,0.25)" fontSize="7">54,300</text>
                          {/* current price line */}
                          <line x1="0" y1="195" x2="310" y2="195" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6"/>
                          <rect x="290" y="189" width="30" height="12" fill="#ef4444" rx="2"/>
                          <text x="293" y="198" fill="white" fontSize="7" fontWeight="bold">54,916</text>
                        </svg>

                        {/* live badge */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-semibold text-white">Live · 3 strategies running</span>
                        </div>
                      </div>

                      {/* bottom panel — orders */}
                      <div className="border-t border-white/[0.05] bg-[#0d1020]">
                        <div className="flex gap-3 px-2 py-1 border-b border-white/[0.04]">
                          <span className="text-violet-400 text-[9px] border-b border-violet-400 pb-0.5">Active Orders (3)</span>
                          <span className="text-white/30 text-[9px]">History</span>
                          <span className="text-white/30 text-[9px]">Positions</span>
                        </div>
                        <div className="px-2 py-1 space-y-0.5">
                          {[
                            { id:'#4821', sym:'BTC/USDT', side:'BUY', qty:'0.01', price:'54,820', pl:'+$12.40', pos:true },
                            { id:'#4819', sym:'ETH/USDT', side:'BUY', qty:'0.5', price:'2,430', pl:'+$9.10', pos:true },
                            { id:'#4815', sym:'SOL/USDT', side:'SELL', qty:'2.0', price:'143.2', pl:'-$3.20', pos:false },
                          ].map(o => (
                            <div key={o.id} className="flex items-center gap-2 text-[8px]">
                              <span className="text-white/25 w-8">{o.id}</span>
                              <span className="text-white/60 w-14">{o.sym}</span>
                              <span className={`w-7 font-bold ${o.pos ? 'text-emerald-400' : 'text-red-400'}`}>{o.side}</span>
                              <span className="text-white/40 w-8">{o.qty}</span>
                              <span className="text-white/40 flex-1">{o.price}</span>
                              <span className={`font-bold ${o.pos ? 'text-emerald-400' : 'text-red-400'}`}>{o.pl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right sidebar — strategy panel */}
                    <div className="w-24 shrink-0 border-l border-white/[0.06] bg-[#0d1020] flex flex-col">
                      <div className="px-2 py-1.5 border-b border-white/[0.05] text-white/50 text-[9px] uppercase tracking-widest">Strategies</div>
                      <div className="px-2 py-2 space-y-2">
                        {[
                          { name:'Breakout', status:'active', ret:'+12.3%' },
                          { name:'RSI Rev.', status:'active', ret:'+8.7%' },
                          { name:'ML Mom.', status:'paused', ret:'+5.1%' },
                        ].map(s => (
                          <div key={s.name} className="p-1.5 rounded bg-white/[0.03] border border-white/[0.05]">
                            <div className="text-white/60 text-[8px] mb-0.5">{s.name}</div>
                            <div className="flex items-center justify-between">
                              <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'active' ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                              <span className="text-emerald-400 text-[8px] font-bold">{s.ret}</span>
                            </div>
                          </div>
                        ))}
                        <div className="mt-2 text-[8px] text-white/20 uppercase tracking-widest">Account</div>
                        <div className="text-[9px] text-white/50">Balance</div>
                        <div className="text-[9px] text-white font-bold">$10,284.50</div>
                        <div className="text-[9px] text-white/50 mt-1">Equity</div>
                        <div className="text-[9px] text-emerald-400 font-bold">$10,302.80</div>
                      </div>
                    </div>
                  </div>

                  {/* ── Status bar ── */}
                  <div className="flex items-center justify-between px-3 py-1 bg-[#080b14] border-t border-white/[0.05]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-white/30 text-[8px]">Connected · NYSE · BINANCE</span>
                    </div>
                    <span className="text-white/20 text-[8px]">Ping 12ms</span>
                  </div>

                      </div>{/* end screen content */}
                    </div>{/* end screen bezel */}
                  </div>{/* end screen lid */}

                  {/* ── Hinge strip ── */}
                  <div className="h-[6px] mx-1 rounded-none"
                    style={{ background: 'linear-gradient(to bottom, #1a1d28, #111318)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }} />

                  {/* ── Keyboard base ── */}
                  <div className="rounded-b-2xl px-6 pt-3 pb-4"
                    style={{ background: 'linear-gradient(160deg,#252836,#1a1d28)', boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)' }}>
                    {/* Trackpad */}
                    <div className="mx-auto rounded-lg border border-white/[0.07]"
                      style={{ width: '38%', height: '52px', background: 'rgba(255,255,255,0.03)' }} />
                  </div>

                  {/* ── Table reflection ── */}
                  <div className="mx-8 h-3 rounded-b-full opacity-30"
                    style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)' }} />

                </div>{/* end laptop shell */}
              </div>
            </div>

            {/* bottom strip — MetaTrader comparison */}
            <div className="relative z-10 border-t border-white/[0.06] px-10 lg:px-14 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Like MetaTrader', value: 'Order panels', sub: 'Market, Limit, Stop orders' },
                { label: 'Like MetaTrader', value: 'Watchlist', sub: 'Multi-asset price feed' },
                { label: 'Beyond MetaTrader', value: 'Strategy sync', sub: 'Auto-loads daily strategies' },
                { label: 'Beyond MetaTrader', value: 'Signal push', sub: 'Desktop & mobile alerts' },
              ].map((item) => (
                <div key={item.value}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${item.label.startsWith('Beyond') ? 'text-emerald-500' : 'text-white/25'}`}>
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                  <p className="text-xs text-white/35 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-white/50" />
              <p className="text-white font-bold text-base">Recent Trades</p>
            </div>
            <p className="text-white/30 text-xs mb-5">Your latest trading activity</p>
            <div className="space-y-2">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trade.type === 'buy' ? 'bg-emerald-400/10' : 'bg-red-400/10'}`}>
                      {trade.type === 'buy' ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{trade.strategy}</p>
                      <p className="text-sm text-white/30 mt-0.5">{trade.pair} · {trade.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-base font-black ${trade.profit.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{trade.profit}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${trade.status === 'active' ? 'bg-blue-400/10 text-blue-400' : 'bg-white/5 text-white/30'}`}>
                      {trade.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
