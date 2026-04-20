import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { Users, Target, Zap, ShieldCheck, TrendingUp, BarChart3, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const team = [
  {
    name: 'Alex Rivera',
    role: 'Co-Founder & Head of Quant',
    bio: '8 years in algorithmic trading. Former prop desk at a Toronto hedge fund. Specializes in momentum and mean-reversion strategies.',
    img: '/img/about/serious-colleagues-office-talking-with-each-other.jpg',
    initials: 'AR',
  },
  {
    name: 'Mia Chen',
    role: 'Co-Founder & CTO',
    bio: 'Full-stack engineer with a background in fintech and distributed systems. Built trading infrastructure at two crypto startups.',
    img: '/img/about/women.jpg',
    initials: 'MC',
  },
  {
    name: 'Liam Park',
    role: 'Head of Research',
    bio: 'PhD in financial mathematics. Specializes in crypto market microstructure and on-chain analytics.',
    img: '/img/about/programmer-colleague-office-training-machine-learning-algorithms.jpg',
    initials: 'LP',
  },
  {
    name: 'Sofia Müller',
    role: 'Community Lead',
    bio: 'Former FX trader turned community builder. Manages our 1,200+ trader community and educational content.',
    img: '/img/about/remote.jpg',
    initials: 'SM',
  },
];

const values = [
  { icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', title: 'Transparency', body: 'Every strategy ships with full backtests, entry/exit rules, and risk parameters. No black boxes.' },
  { icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', title: 'Rigor', body: 'We only publish strategies that survive walk-forward validation and out-of-sample testing.' },
  { icon: Zap, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20', title: 'Edge', body: 'Our quant team combines ML, on-chain analytics, and classical TA to find strategies that hold up.' },
  { icon: Users, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', title: 'Community', body: 'Trading is better together. Our community of 1,200+ traders shares insights and holds each other accountable.' },
];

const stats = [
  { value: '12', label: 'Strategies', icon: BarChart3, color: 'text-emerald-400' },
  { value: '1,200+', label: 'Active Traders', icon: Users, color: 'text-blue-400' },
  { value: '67%', label: 'Avg Win Rate', icon: TrendingUp, color: 'text-violet-400' },
  { value: '2023', label: 'Founded', icon: Award, color: 'text-amber-400' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/img/algo trading/Annotation 2026-04-04 214747.jpg"
            alt="Trading"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/60 via-[#0a0e1a]/80 to-[#0a0e1a]" />
        </div>
        <div className="relative z-10 container mx-auto px-6 pt-40 pb-24 max-w-5xl">
          <RevealSection variant="up">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-6 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">About Us</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.0] mb-6">
              Built by traders,<br />
              <span className="text-emerald-400">for traders.</span>
            </h1>
            <p className="text-white/50 text-xl leading-relaxed max-w-2xl mb-10">
              CrowdPnL was founded with one goal: give every trader access to institutional-grade crypto strategies without the institutional price tag.
            </p>
            <button onClick={() => navigate('/strategies')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all">
              View Strategies <ArrowRight className="w-4 h-4" />
            </button>
          </RevealSection>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24 max-w-5xl space-y-24">

        {/* Stats */}
        <RevealSection variant="stagger">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] text-center hover-lift">
                <Icon className={`w-5 h-5 ${color} mx-auto mb-3`} />
                <p className="text-3xl font-black text-white mb-1">{value}</p>
                <p className="text-white/35 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Mission */}
        <RevealSection variant="up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-6 bg-emerald-500" />
                <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Our Mission</span>
              </div>
              <h2 className="text-4xl font-black text-white leading-tight mb-5">
                Democratize professional trading.
              </h2>
              <p className="text-white/45 text-base leading-relaxed mb-5">
                Systematic trading has always been the domain of hedge funds and prop desks. We're changing that. Every strategy on CrowdPnL is fully backtested, documented, and available to anyone — free or premium.
              </p>
              <p className="text-white/45 text-base leading-relaxed">
                We believe that with the right tools and data, any trader can develop an edge. Our platform provides the strategies, the community, and the infrastructure to make that possible.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.07]">
              <img
                src="/img/about/data-center-engineering-team-doing-brainstorming-monitoring-system-performance.jpg"
                alt="Trading charts"
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/60 to-transparent" />
            </div>
          </div>
        </RevealSection>

        {/* Values */}
        <RevealSection variant="up">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Our Values</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-10">What we stand for.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {values.map(({ icon: Icon, color, bg, border, title, body }) => (
                <div key={title} className={`p-6 rounded-2xl border ${border} bg-white/[0.02] hover-lift`}>
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Team */}
        <RevealSection variant="up">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">The Team</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-3">The people behind CrowdPnL.</h2>
            <p className="text-white/40 text-base mb-10">A small, focused team of quants, engineers, and traders.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map(({ name, role, bio, img, initials }) => (
                <div key={name} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden hover-lift group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/20 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <p className="text-white font-bold text-sm">{name}</p>
                      <p className="text-emerald-400 text-xs">{role}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-white/35 text-xs leading-relaxed">{bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* CTA */}
        <RevealSection variant="scale">
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.07]">
            <img
              src="/img/about/young-employees-sitting-office-table-using-laptop-team-work-brainstorming-meeting-concept.jpg"
              alt="bg"
              className="absolute inset-0 w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-[#0a0e1a] to-violet-900/20" />
            <div className="relative z-10 p-12 text-center">
              <h2 className="text-4xl font-black text-white mb-4">Ready to trade smarter?</h2>
              <p className="text-white/45 text-base mb-8 max-w-md mx-auto">Join 1,200+ traders using CrowdPnL strategies to find their edge in crypto markets.</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button onClick={() => navigate('/strategies')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all">
                  Browse Strategies <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/community')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-semibold text-sm transition-all">
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </RevealSection>

      </div>
      <Footer />
    </div>
  );
}
