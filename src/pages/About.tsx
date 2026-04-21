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
  { icon: Globe, title: 'Accessibility', body: 'Institutional-grade strategies available to every trader — free or premium, no gatekeeping.' },
  { icon: Lightbulb, title: 'Innovation', body: 'We continuously research new market regimes and adapt our strategies to evolving conditions.' },
];

const timeline = [
  { year: '2023', title: 'Founded', body: 'CrowdPnL was born in Toronto with a simple mission: democratize professional crypto trading strategies.' },
  { year: '2023', title: 'First Strategy', body: 'Launched our first systematic BTC momentum strategy, achieving a 71% win rate in live forward testing.' },
  { year: '2024', title: 'Community Launch', body: 'Opened the platform to the public. 500 traders joined in the first month. The community was alive.' },
  { year: '2024', title: 'Premium Launch', body: 'Introduced Premium and Elite tiers with advanced strategies, signals, and priority support.' },
  { year: '2025', title: 'Desktop App', body: 'Shipped the CrowdPnL desktop app for Windows and macOS — real-time alerts, one-click setup.' },
];

const stats = [
  { value: '12', suffix: '', label: 'Strategies', icon: BarChart3 },
  { value: '1,200', suffix: '+', label: 'Active Traders', icon: Users },
  { value: '67', suffix: '%', label: 'Avg Win Rate', icon: TrendingUp },
  { value: '2023', suffix: '', label: 'Founded', icon: Award },
];

const team = [
  { name: 'Marcus Chen', role: 'Co-Founder & Head of Quant', bio: 'Former prop trader at a Toronto hedge fund. Built systematic strategies for 8 years before founding CrowdPnL.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Sofia Reyes', role: 'Co-Founder & CEO', bio: 'Ex-fintech product lead. Passionate about making institutional tools accessible to every trader.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name: 'James Okafor', role: 'Lead Engineer', bio: 'Full-stack engineer with a background in real-time financial data systems and distributed architecture.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name: 'Priya Nair', role: 'Quantitative Researcher', bio: 'PhD in computational finance. Specializes in crypto market microstructure and ML-driven signal generation.', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=90" alt="Crypto" className="w-full h-full object-cover opacity-[0.18]" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a14]/70 via-[#0a0e1a]/80 to-[#0a0e1a]" />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/[0.07] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 pt-36 pb-24 max-w-5xl text-center">
          <RevealSection variant="up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">About CrowdPnL</span>
              <div className="h-px w-8 bg-emerald-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[1.0] mb-6">
              <span className="text-white">Built by traders,</span><br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">for traders.</span>
            </h1>
            <p className="text-white/50 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              CrowdPnL was founded with one goal: give every trader access to institutional-grade crypto strategies without the institutional price tag.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button onClick={() => navigate('/strategies')} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
                View Strategies <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/community')} className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/[0.15] text-white/60 hover:text-white hover:border-white/30 font-semibold text-sm transition-all backdrop-blur-sm bg-white/[0.03]">
                Join Community
              </button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-b border-white/[0.07] bg-[#060a14]">
        <RevealSection variant="stagger">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.06]">
              {stats.map(({ value, suffix, label }) => (
                <div key={label} className="py-10 px-8 text-center">
                  <p className="text-5xl font-black text-white mb-1">{value}<span className="text-emerald-400">{suffix}</span></p>
                  <p className="text-white/35 text-xs font-bold uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Mission */}
      <section className="py-32 container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <RevealSection variant="left">
            <div className="relative h-[460px]">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" alt="Analytics" className="absolute top-0 left-0 w-3/4 h-[340px] object-cover rounded-2xl" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80'; }} />
              <div className="absolute top-0 left-0 w-3/4 h-[340px] rounded-2xl bg-gradient-to-t from-[#0a0e1a]/60 to-transparent pointer-events-none" />
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80" alt="Charts" className="absolute bottom-0 right-0 w-[55%] h-[240px] object-cover rounded-2xl border-4 border-[#0a0e1a]" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80'; }} />
              <div className="absolute bottom-0 right-0 w-[55%] h-[240px] rounded-2xl bg-gradient-to-t from-[#0a0e1a]/50 to-transparent pointer-events-none" />
              <div className="absolute top-[42%] left-[52%] -translate-x-1/2 -translate-y-1/2 z-10 bg-[#060a14]/90 backdrop-blur-md border border-white/[0.1] px-5 py-4 rounded-2xl text-center shadow-2xl">
                <div className="text-3xl font-black text-white">1,200<span className="text-emerald-400">+</span></div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Traders</div>
              </div>
            </div>
          </RevealSection>
          <RevealSection variant="right">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Our Mission</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              A quant team that<br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">ships real edge.</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-5">We are a small, remote-first team of quantitative researchers, engineers, and traders. Every strategy on CrowdPnL is built in-house, rigorously backtested, and validated on live markets before it ever reaches you.</p>
            <p className="text-white/50 text-base leading-relaxed mb-8">Systematic trading has always been the domain of hedge funds and prop desks. We are changing that. With the right tools and data, any trader can develop an edge.</p>
            <div className="flex items-center gap-6 flex-wrap">
              {[{ v: '67%', l: 'Avg Win Rate' }, { v: '2yrs', l: 'Track Record' }, { v: '12+', l: 'Strategies' }].map(({ v, l }, i) => (
                <div key={l} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-10 bg-white/10" />}
                  <div><p className="text-2xl font-black text-white">{v}</p><p className="text-white/35 text-xs uppercase tracking-widest font-bold">{l}</p></div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Values */}
      <section className="py-28 bg-[#060a14] border-t border-b border-white/[0.05]">
        <div className="container mx-auto px-6 max-w-6xl">
          <RevealSection variant="up">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Our Values</span><div className="h-px w-8 bg-emerald-500" /></div>
              <h2 className="text-5xl font-black text-white">What we stand for.</h2>
            </div>
          </RevealSection>
          <RevealSection variant="stagger">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map(({ icon: Icon, title, body }) => (
                <div key={title} className="p-7 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all group cursor-default">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/15 transition-colors">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-black text-lg mb-2">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32 container mx-auto px-6 max-w-4xl">
        <RevealSection variant="up">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Our Journey</span><div className="h-px w-8 bg-emerald-500" /></div>
            <h2 className="text-5xl font-black text-white">How we got here.</h2>
          </div>
        </RevealSection>
        <div className="relative">
          <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-px bg-white/[0.07] hidden lg:block" />
          <div className="space-y-10">
            {timeline.map((item, i) => (
              <RevealSection key={item.title} variant={i % 2 === 0 ? 'left' : 'right'}>
                <div className={`flex items-start gap-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="flex-1 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:border-emerald-500/20 transition-colors">
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block mb-3">{item.year}</span>
                    <h3 className="text-white font-black text-xl mb-2">{item.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
                  </div>
                  <div className="hidden lg:flex w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#0a0e1a] shrink-0 mt-6 relative z-10 shadow-lg shadow-emerald-500/40" />
                  <div className="flex-1 hidden lg:block" />
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-28 bg-[#060a14] border-t border-b border-white/[0.05]">
        <div className="container mx-auto px-6 max-w-6xl">
          <RevealSection variant="up">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">The Team</span><div className="h-px w-8 bg-emerald-500" /></div>
              <h2 className="text-5xl font-black text-white">The people behind it.</h2>
              <p className="text-white/40 text-base mt-3 max-w-xl mx-auto">A small, focused team of traders, quants, and engineers obsessed with building the best strategy platform in crypto.</p>
            </div>
          </RevealSection>
          <RevealSection variant="stagger">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map(({ name, role, bio, img }) => (
                <div key={name} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden hover:border-emerald-500/20 hover:bg-white/[0.05] transition-all group">
                  <div className="relative h-56 overflow-hidden">
                    <img src={img} alt={name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/20 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-black text-base mb-0.5">{name}</h3>
                    <p className="text-emerald-400 text-xs font-bold mb-3">{role}</p>
                    <p className="text-white/40 text-xs leading-relaxed">{bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 container mx-auto px-6 max-w-6xl">
        <RevealSection variant="scale">
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.07]">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-[#0a0e1a]/80 to-[#060a14]" />
            <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 p-16 lg:p-24 text-center">
              <div className="flex items-center justify-center gap-3 mb-5"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Get Started</span><div className="h-px w-8 bg-emerald-500" /></div>
              <h2 className="text-5xl lg:text-6xl font-black text-white mb-4">Ready to trade smarter?</h2>
              <p className="text-white/45 text-lg mb-10 max-w-md mx-auto">Join 1,200+ traders using CrowdPnL strategies to find their edge in crypto markets.</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button onClick={() => navigate('/strategies')} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
                  Browse Strategies <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/community')} className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-semibold text-sm transition-all backdrop-blur-sm">
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      <Footer />
    </div>
  );
}
