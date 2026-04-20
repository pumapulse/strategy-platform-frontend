import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { useNavigate } from 'react-router-dom';
import {
  Users, Target, Zap, ShieldCheck, TrendingUp, BarChart3,
  Award, ArrowRight, Globe, Lightbulb,
} from 'lucide-react';

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

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0e1a] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <RevealSection variant="left">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-emerald-500" />
                <span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">About CrowdPnL</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.0] mb-6">
                Built by traders,<br /><span className="text-emerald-400">for traders.</span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
                CrowdPnL was founded with one goal: give every trader access to institutional-grade crypto strategies without the institutional price tag.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <button onClick={() => navigate('/strategies')} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all">
                  View Strategies <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/community')} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/[0.15] text-white/60 hover:text-white hover:border-white/30 font-semibold text-sm transition-all">
                  Join Community
                </button>
              </div>
            </RevealSection>

            <RevealSection variant="right">
              <div className="relative h-[420px]">
                <img src="/img/about/workers-it-company-working-computer.jpg" alt="Team" className="absolute top-0 left-0 w-3/4 h-[320px] object-cover rounded-xl"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'; }} />
                <img src="/img/about/programmer-colleague-office-training-machine-learning-algorithms.jpg" alt="Programmer" className="absolute bottom-0 right-0 w-1/2 h-[220px] object-cover rounded-xl border-4 border-[#0a0e1a]"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80'; }} />
                <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 bg-[#060a14]/90 backdrop-blur border border-white/10 p-4 text-center z-10 rounded-xl">
                  <div className="text-2xl font-black text-white">12<span className="text-emerald-400">+</span></div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Strategies</div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/10 bg-[#060a14]">
        <RevealSection variant="stagger">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.06]">
              {stats.map(({ value, suffix, label, icon: Icon }) => (
                <div key={label} className="py-10 px-8 text-center">
                  <p className="text-4xl font-black text-white mb-1">{value}<span className="text-emerald-400">{suffix}</span></p>
                  <p className="text-white/35 text-xs font-bold uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Who We Are */}
      <section className="py-28 container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <RevealSection variant="left">
            <div className="relative h-[420px]">
              <img src="/img/about/data-center-engineering-team-doing-brainstorming-monitoring-system-performance.jpg" alt="Team" className="absolute top-0 left-0 w-3/4 h-[320px] object-cover rounded-xl"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80'; }} />
              <img src="/img/about/serious-colleagues-office-talking-with-each-other.jpg" alt="Colleagues" className="absolute bottom-0 right-0 w-1/2 h-[220px] object-cover rounded-xl border-4 border-[#0a0e1a]"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80'; }} />
              <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 bg-[#060a14]/90 backdrop-blur border border-white/10 p-4 text-center z-10 rounded-xl">
                <div className="text-2xl font-black text-white">1,200<span className="text-emerald-400">+</span></div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Traders</div>
              </div>
            </div>
          </RevealSection>
          <RevealSection variant="right">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Who We Are</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-tight mb-6">A quant team that<br /><span className="text-emerald-400">ships real edge.</span></h2>
            <p className="text-white/50 text-base leading-relaxed mb-5">We're a small, remote-first team of quantitative researchers, engineers, and traders. Every strategy on CrowdPnL is built in-house, rigorously backtested, and validated on live markets before it ever reaches you.</p>
            <p className="text-white/50 text-base leading-relaxed mb-8">Systematic trading has always been the domain of hedge funds and prop desks. We're changing that. With the right tools and data, any trader can develop an edge — and we're here to provide both.</p>
            <div className="flex items-center gap-6">
              {[{ v: '67%', l: 'Avg Win Rate' }, { v: '2yrs', l: 'Track Record' }, { v: '12+', l: 'Strategies' }].map(({ v, l }, i) => (
                <div key={l} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-10 bg-white/10" />}
                  <div>
                    <p className="text-2xl font-black text-white">{v.replace(/(\d+)/, '$1').replace(/[%+a-z]+/, m => `<span class="text-emerald-400">${m}</span>`)}</p>
                    <p className="text-white/35 text-xs uppercase tracking-widest font-bold">{l}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#060a14] border-t border-b border-white/[0.05]">
        <div className="container mx-auto px-6 max-w-6xl">
          <RevealSection variant="up">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-emerald-500" />
                <span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Our Values</span>
                <div className="h-px w-8 bg-emerald-500" />
              </div>
              <h2 className="text-5xl font-black text-white">What we stand for.</h2>
            </div>
          </RevealSection>
          <RevealSection variant="stagger">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map(({ icon: Icon, title, body }) => (
                <div key={title} className="p-7 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all group">
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
      <section className="py-28 container mx-auto px-6 max-w-4xl">
        <RevealSection variant="up">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Our Journey</span>
              <div className="h-px w-8 bg-emerald-500" />
            </div>
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
                  <div className="hidden lg:flex w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#0a0e1a] shrink-0 mt-6 relative z-10" />
                  <div className="flex-1 hidden lg:block" />
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28 container mx-auto px-6 max-w-6xl">
        <RevealSection variant="scale">
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.07]">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <img src="/img/about/young-employees-sitting-office-table-using-laptop-team-work-brainstorming-meeting-concept.jpg" alt="Team" className="absolute inset-0 w-full h-full object-cover opacity-[0.08]"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=80'; }} />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-[#0a0e1a]/80 to-[#060a14]" />
            <div className="relative z-10 p-16 text-center">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-8 bg-emerald-500" />
                <span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Get Started</span>
                <div className="h-px w-8 bg-emerald-500" />
              </div>
              <h2 className="text-5xl font-black text-white mb-4">Ready to trade smarter?</h2>
              <p className="text-white/45 text-lg mb-10 max-w-md mx-auto">Join 1,200+ traders using CrowdPnL strategies to find their edge in crypto markets.</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button onClick={() => navigate('/strategies')} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-all">
                  Browse Strategies <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/community')} className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-semibold text-sm transition-all">
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
