import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { Briefcase, MapPin, ArrowRight, Zap, Users, TrendingUp, Code } from 'lucide-react';

const perks = [
  { icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Remote-first', body: 'Work from anywhere. We have team members across 4 countries.' },
  { icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Equity', body: 'Everyone on the team has skin in the game. We share in the upside.' },
  { icon: Users, color: 'text-violet-400', bg: 'bg-violet-400/10', title: 'Small team', body: 'No bureaucracy. Your work ships fast and has real impact.' },
  { icon: Code, color: 'text-amber-400', bg: 'bg-amber-400/10', title: 'Learn & grow', body: 'Budget for courses, conferences, and trading tools. We invest in you.' },
];

const openings = [
  {
    title: 'Quantitative Researcher',
    type: 'Full-time',
    location: 'Remote / Toronto',
    team: 'Research',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    description: 'Develop and validate systematic trading strategies across crypto markets. You\'ll work with historical data, build backtesting frameworks, and publish new strategies to the platform.',
    requirements: ['3+ years in quantitative finance or algorithmic trading', 'Strong Python skills (pandas, numpy, backtrader)', 'Experience with crypto market data', 'Familiarity with statistical testing and walk-forward validation'],
  },
  {
    title: 'Full-Stack Engineer',
    type: 'Full-time',
    location: 'Remote',
    team: 'Engineering',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    description: 'Build and scale the CrowdPnL platform. You\'ll work across the React frontend and Node.js backend, shipping features that thousands of traders use daily.',
    requirements: ['3+ years with React and TypeScript', 'Experience with Node.js and PostgreSQL/Supabase', 'Familiarity with WebSockets and real-time data', 'Strong product sense and attention to detail'],
  },
  {
    title: 'Community Manager',
    type: 'Part-time',
    location: 'Remote',
    team: 'Growth',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    description: 'Grow and nurture our trader community. You\'ll moderate discussions, create educational content, and be the voice of CrowdPnL across social channels.',
    requirements: ['Passion for trading and crypto markets', 'Experience managing online communities', 'Strong written communication skills', 'Familiarity with Discord, Twitter/X, and Telegram'],
  },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
            alt="Team"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/60 via-[#0a0e1a]/80 to-[#0a0e1a]" />
        </div>
        <div className="relative z-10 container mx-auto px-6 pt-40 pb-20 max-w-5xl">
          <RevealSection variant="up">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-6 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Careers</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.0] mb-5">
              Join the team.
            </h1>
            <p className="text-white/50 text-xl leading-relaxed max-w-2xl mb-6">
              We're a small, remote-first team building the best trading strategy platform in crypto. If you're passionate about markets and great products, we'd love to hear from you.
            </p>
            <p className="text-white/30 text-sm">
              Don't see a role that fits?{' '}
              <a href="mailto:hr@crowdpnl.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">Email us directly</a>
            </p>
          </RevealSection>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24 max-w-5xl space-y-16">

        {/* Perks */}
        <RevealSection variant="stagger">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Why CrowdPnL</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-8">What we offer.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {perks.map(({ icon: Icon, color, bg, title, body }) => (
                <div key={title} className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover-lift">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <p className="text-white font-bold text-sm mb-1.5">{title}</p>
                  <p className="text-white/35 text-xs leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Open roles */}
        <RevealSection variant="up">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Open Roles</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-8">Current openings.</h2>
            <div className="space-y-5">
              {openings.map((job) => (
                <div key={job.title} className={`p-6 rounded-2xl border ${job.border} bg-white/[0.02] hover:bg-white/[0.04] transition-colors group`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-white font-bold text-lg">{job.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${job.bg} border ${job.border} ${job.color} font-bold`}>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/30">
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.team}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                      </div>
                    </div>
                    <a href={`mailto:hr@crowdpnl.com?subject=Application: ${job.title}`}
                      className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white/70 hover:text-white text-xs font-semibold transition-all">
                      Apply <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed mb-4">{job.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {job.requirements.map(r => (
                      <li key={r} className="flex items-start gap-2 text-xs text-white/30">
                        <span className={`${job.color} mt-0.5 shrink-0`}>✓</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* CTA */}
        <RevealSection variant="scale">
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.07] p-10 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-[#0a0e1a] to-emerald-900/15" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white mb-3">Don't see your role?</h2>
              <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">We're always looking for exceptional people. Send us your CV and tell us how you'd contribute.</p>
              <a href="mailto:hr@crowdpnl.com"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all">
                Get in touch <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </RevealSection>

      </div>
      <Footer />
    </div>
  );
}
