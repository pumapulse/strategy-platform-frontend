import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { useNavigate } from 'react-router-dom';
import { Users, Target, Zap, ShieldCheck, TrendingUp, BarChart3, Award, ArrowRight, Globe, Lightbulb } from 'lucide-react';

const values = [
  { icon: Target, title: 'Transparency', body: 'Every strategy ships with full backtests, entry/exit rules, and risk parameters. No black boxes, ever.' },
  { icon: ShieldCheck, title: 'Rigor', body: 'We only publish strategies that survive walk-forward validation and out-of-sample testing.' },
  { icon: Zap, title: 'Edge', body: 'Our quant team combines ML, on-chain analytics, and classical TA to find strategies that hold up.' },
  { icon: Users, title: 'Community', body: 'Trading is better together. Our 1,200+ traders share insights and hold each other accountable.' },
  { icon: Globe, title: 'Accessibility', body: 'Institutional-grade strategies available to every trader â€” free or premium, no gatekeeping.' },
  { icon: Lightbulb, title: 'Innovation', body: 'We continuously research new market regimes and adapt our strategies to evolving conditions.' },
];

const timeline = [
  { year: '2023', title: 'Founded as CopyTradeX', body: 'Our journey began in Toronto under the name CopyTradeX — a platform built to democratize professional crypto trading strategies for everyday traders.' },
  { year: '2023', title: 'First Strategy', body: 'Launched our first systematic BTC momentum strategy, achieving a 71% win rate in live forward testing.' },
  { year: '2024', title: 'Community Launch', body: 'Opened the platform to the public. 500 traders joined in the first month. The community was alive.' },
  { year: '2024', title: 'Premium Launch', body: 'Introduced Premium and Elite tiers with advanced strategies, signals, and priority support.' },
  { year: '2025', title: 'Rebranded to CrowdPnL', body: 'To reflect our expanded vision and growing community, we rebranded from CopyTradeX to CrowdPnL — a name that captures the collective edge we build together.' },
  { year: '2025', title: 'Desktop App', body: 'Shipped the CrowdPnL desktop app for Windows and macOS - real-time alerts, one-click setup.' },
];

const stats = [
  { value: '12', suffix: '', label: 'Strategies' },
  { value: '1,200', suffix: '+', label: 'Active Traders' },
  { value: '67', suffix: '%', label: 'Avg Win Rate' },
  { value: '2023', suffix: '', label: 'Founded' },
];



export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* â”€â”€ HERO â€” dark image bg â”€â”€ */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src="/img/crypto/Annotation 2026-04-04 232105.jpg" alt="Crypto trading" className="w-full h-full object-cover opacity-40" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a14]/70 via-[#0a0e1a]/80 to-[#0a0e1a]" />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 container mx-auto px-6 pt-36 pb-24 max-w-6xl">
          <RevealSection variant="up">
            <div className="flex items-center gap-3 mb-6"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">About CrowdPnL</span></div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[1.0] mb-6">
              <span className="text-white">Built by traders,</span><br />
              <span className="bg-gradient-to-r from-[#9966ff] to-[#cc99ff] bg-clip-text text-transparent">for traders.</span>
            </h1>
            <p className="text-white/50 text-xl leading-relaxed mb-10 max-w-2xl">CrowdPnL was founded with one goal: give every trader access to institutional-grade crypto strategies without the institutional price tag.</p>
            <div className="flex items-center gap-4 flex-wrap">
              <button onClick={() => navigate('/strategies')} className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#9966ff] to-[#7744dd] hover:from-[#aa77ff] hover:to-[#8855ee] text-white font-bold text-sm transition-all shadow-lg shadow-purple-900/40">
                View Strategies <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/community')} className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white/80 hover:text-white hover:border-white/50 hover:bg-white/5 font-semibold text-sm transition-all">
                Join Community
              </button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* â”€â”€ STATS â€” noticeably lighter bg â”€â”€ */}
      <section className="relative" style={{ background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)' }}>
        <RevealSection variant="stagger">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
              {stats.map(({ value, suffix, label }) => (
                <div key={label} className="flex-1 py-10 px-10 flex items-center gap-5">
                  <p className="text-4xl font-black text-white tabular-nums">{value}<span className="text-[#9966ff]">{suffix}</span></p>
                  <div className="w-px h-8 bg-white/[0.10]" />
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* â”€â”€ MISSION â€” back to dark with purple tint â”€â”€ */}
      <section className="relative py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0e0b1e 50%, #0a0e1a 100%)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#9966ff]/[0.05] via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#9966ff]/[0.05] rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <RevealSection variant="right">
              <div className="flex items-center gap-3 mb-5"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Our Mission</span></div>
              <h2 className="text-5xl font-black text-white leading-tight mb-6">A quant team that<br /><span className="bg-gradient-to-r from-[#9966ff] to-[#cc99ff] bg-clip-text text-transparent">ships real edge.</span></h2>
              <p className="text-white/50 text-base leading-relaxed mb-5">We are a small, remote-first team of quantitative researchers, engineers, and traders. Every strategy on CrowdPnL is built in-house, rigorously backtested, and validated on live markets before it ever reaches you.</p>
              <p className="text-white/50 text-base leading-relaxed mb-8">Systematic trading has always been the domain of hedge funds and prop desks. We are changing that. With the right tools and data, any trader can develop an edge.</p>
              <div className="flex items-center gap-0 border border-[#9966ff]/20 bg-[#9966ff]/[0.05]">
                {[{ v: '67%', l: 'Avg Win Rate' }, { v: '2yrs', l: 'Track Record' }, { v: '12+', l: 'Strategies' }].map(({ v, l }, i) => (
                  <div key={l} className={`flex-1 px-6 py-5 ${i < 2 ? 'border-r border-[#9966ff]/20' : ''}`}>
                    <p className="text-2xl font-black text-white">{v}</p>
                    <p className="text-white/35 text-xs uppercase tracking-widest font-bold mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
            <RevealSection variant="left">
              <div className="relative h-[460px]">
                <img src="/img/1200+traders.png" alt="Analytics" className="absolute top-0 left-0 w-3/4 h-[340px] object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/img/about/workers-it-company-working-computer.jpg'; }} />
                <div className="absolute top-0 left-0 w-3/4 h-[340px] bg-gradient-to-t from-[#0a0e1a]/60 to-transparent pointer-events-none" />
                <img src="/img/1200+traders-2.png" alt="Team" className="absolute bottom-0 right-0 w-[55%] h-[240px] object-cover border-4 border-[#0a0e1a]" onError={(e) => { (e.target as HTMLImageElement).src = '/img/about/serious-colleagues-office-talking-with-each-other.jpg'; }} />
                <div className="absolute bottom-0 right-0 w-[55%] h-[240px] bg-gradient-to-t from-[#0a0e1a]/50 to-transparent pointer-events-none" />
                <div className="absolute top-[42%] left-[52%] -translate-x-1/2 -translate-y-1/2 z-10 bg-[#0e0b1e] border border-[#9966ff]/30 px-5 py-4 text-center shadow-2xl">
                  <div className="text-3xl font-black text-white">1,200<span className="text-[#9966ff]">+</span></div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Traders</div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* â”€â”€ VALUES â€” clearly lighter section â”€â”€ */}
      <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(180deg, #060a14 0%, #080e18 100%)' }}>
        <div className="absolute top-0 left-0 w-[500px] h-[400px] bg-emerald-500/[0.05] rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-emerald-400/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <RevealSection variant="up">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Our Values</span></div>
              <h2 className="text-5xl font-black text-white">What we stand for.</h2>
            </div>
          </RevealSection>
          <RevealSection variant="stagger">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
              {values.map(({ icon: Icon, title, body }) => (
                <div key={title} className="relative bg-[#060a14] p-7 border-l-2 border-[#9966ff] hover:bg-[#0e0b1e] transition-all group cursor-default overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9966ff]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-[#9966ff]/10 border border-[#9966ff]/20 flex items-center justify-center mb-5 group-hover:bg-[#9966ff]/20 transition-colors">
                      <Icon className="w-5 h-5 text-[#9966ff]" />
                    </div>
                    <h3 className="text-white font-black text-lg mb-2">{title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* â”€â”€ TIMELINE â€” back to very dark â”€â”€ */}
      <section className="relative py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #070510 0%, #0a0e1a 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(153,102,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(153,102,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#9966ff]/[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <RevealSection variant="up">
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Our Journey</span></div>
              <h2 className="text-5xl font-black text-white">How we got here.</h2>
            </div>
          </RevealSection>
          <div className="relative">
            {/* Animated vertical line */}
            <div className="absolute left-[18px] top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, #9966ff80, #9966ff40, #9966ff10, transparent)' }} />
            <div className="space-y-0">
              {timeline.map((item, i) => (
                <RevealSection key={item.title} variant="left">
                  <div className="flex items-start gap-8 pb-10 group">
                    {/* Animated node */}
                    <div className="relative z-10 shrink-0 mt-1">
                      {/* Pulse ring */}
                      <div className="absolute inset-0 w-9 h-9 bg-[#9966ff]/20 animate-ping rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDuration: '1.5s' }} />
                      <div className="w-9 h-9 bg-[#9966ff]/20 border border-[#9966ff]/50 flex items-center justify-center group-hover:bg-[#9966ff]/40 group-hover:border-[#9966ff] group-hover:shadow-lg group-hover:shadow-[#9966ff]/20 transition-all duration-300">
                        <span className="text-[#9966ff] text-[10px] font-black group-hover:text-white transition-colors">{item.year.slice(2)}</span>
                      </div>
                    </div>
                    {/* Card with slide + glow on hover */}
                    <div className="flex-1 border border-[#9966ff]/15 bg-[#9966ff]/[0.03] p-6 hover:border-[#9966ff]/40 hover:bg-[#9966ff]/[0.07] hover:translate-x-1 hover:shadow-lg hover:shadow-[#9966ff]/10 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-[#9966ff] bg-[#9966ff]/10 px-2 py-0.5 group-hover:bg-[#9966ff]/20 transition-colors">{item.year}</span>
                        <h3 className="text-white font-black text-lg group-hover:text-[#cc99ff] transition-colors">{item.title}</h3>
                      </div>
                      <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors">{item.body}</p>
                      {/* Progress indicator */}
                      <div className="mt-4 h-px bg-white/[0.05] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#9966ff] to-transparent w-0 group-hover:w-full transition-all duration-700" />
                      </div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ TEAM â€” lighter section again â”€â”€ */}
      <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1420 0%, #111827 60%, #0f1420 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9966ff]/[0.04] rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <RevealSection variant="up">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Why CrowdPnL</span></div>
              <h2 className="text-5xl font-black text-white">Built different.</h2>
              <p className="text-white/40 text-base mt-3 max-w-xl">Every decision we make is driven by one goal — giving traders a real, verifiable edge.</p>
            </div>
          </RevealSection>
          <RevealSection variant="stagger">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { img: '/img/Algorithmic Precision.png', title: 'Algorithmic Precision', body: 'Every strategy is built on systematic rules — no guesswork, no emotion. Entry, exit, and risk parameters are defined before a single trade is placed.', tag: 'Strategy Design' },
                { img: '/img/Machine Learning Edge.png', title: 'Machine Learning Edge', body: 'Our ML Momentum Scanner uses gradient boosting trained on 3 years of 4H data to score each candle — giving you a quantified probability before you act.', tag: 'ML Research' },
                { img: '/img/Rigorous Backtesting.png', title: 'Rigorous Backtesting', body: 'Walk-forward validation, out-of-sample testing, and drawdown analysis on every strategy. We only publish what survives real scrutiny.', tag: 'Validation' },
                { img: '/img/blockchain/Annotation 2026-04-04 215528.jpg', title: 'Crypto-Native Infrastructure', body: 'Built specifically for crypto markets — on-chain signals, funding rate analysis, and exchange-native execution scripts included.', tag: 'Crypto Focus' },
              ].map(({ img, title, body, tag }) => (
                <div key={title} className="border border-white/[0.08] bg-[#0a0e1a] hover:border-[#9966ff]/30 transition-all group overflow-hidden">
                  <div className="relative h-52 overflow-hidden">
                    <img src={img} alt={title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/img/about/workers-it-company-working-computer.jpg'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/30 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-black text-[#9966ff] bg-[#9966ff]/15 border border-[#9966ff]/30 px-2 py-0.5">{tag}</span>
                    </div>
                  </div>
                  <div className="p-6 border-t border-white/[0.06]">
                    <h3 className="text-white font-black text-lg mb-2">{title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* â”€â”€ CTA â€” strong purple gradient bg â”€â”€ */}
      <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d0a1e 0%, #130d28 40%, #0a0e1a 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(153,102,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(153,102,255,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#9966ff]/[0.12] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-emerald-500/[0.05] rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <RevealSection variant="up">
            <div className="flex items-center justify-center gap-3 mb-5"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Get Started</span><div className="h-px w-8 bg-emerald-500" /></div>
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-4">Ready to trade smarter?</h2>
            <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">Join 1,200+ traders using CrowdPnL strategies to find their edge in crypto markets.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button onClick={() => navigate('/strategies')} className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#9966ff] to-[#7744dd] hover:from-[#aa77ff] hover:to-[#8855ee] text-white font-bold text-sm transition-all shadow-lg shadow-purple-900/40">Browse Strategies <ArrowRight className="w-4 h-4" /></button>
              <button onClick={() => navigate('/community')} className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#9966ff]/40 text-white/80 hover:text-white hover:border-[#9966ff]/70 hover:bg-[#9966ff]/10 font-semibold text-sm transition-all">Join Community</button>
            </div>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}









