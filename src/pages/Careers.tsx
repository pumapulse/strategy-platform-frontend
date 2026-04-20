import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Briefcase, MapPin, ArrowRight } from 'lucide-react';

const openings = [
  {
    title: 'Quantitative Researcher',
    type: 'Full-time',
    location: 'Remote / Toronto',
    team: 'Research',
    description: 'Develop and validate systematic trading strategies across crypto markets. You\'ll work with historical data, build backtesting frameworks, and publish new strategies to the platform.',
    requirements: ['3+ years in quantitative finance or algorithmic trading', 'Strong Python skills (pandas, numpy, backtrader)', 'Experience with crypto market data', 'Familiarity with statistical testing and walk-forward validation'],
  },
  {
    title: 'Full-Stack Engineer',
    type: 'Full-time',
    location: 'Remote',
    team: 'Engineering',
    description: 'Build and scale the CrowdPnL platform. You\'ll work across the React frontend and Node.js backend, shipping features that thousands of traders use daily.',
    requirements: ['3+ years with React and TypeScript', 'Experience with Node.js and PostgreSQL/Supabase', 'Familiarity with WebSockets and real-time data', 'Strong product sense and attention to detail'],
  },
  {
    title: 'Community Manager',
    type: 'Part-time',
    location: 'Remote',
    team: 'Growth',
    description: 'Grow and nurture our trader community. You\'ll moderate discussions, create educational content, and be the voice of CrowdPnL across social channels.',
    requirements: ['Passion for trading and crypto markets', 'Experience managing online communities', 'Strong written communication skills', 'Familiarity with Discord, Twitter/X, and Telegram'],
  },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">

        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-6 bg-emerald-500" />
          <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Careers</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white mb-4">Join the team.</h1>
        <p className="text-white/50 text-lg mb-4 max-w-2xl">
          We're a small, remote-first team building the best trading strategy platform in crypto. If you're passionate about markets and great products, we'd love to hear from you.
        </p>
        <p className="text-white/30 text-sm mb-14">
          Don't see a role that fits? Email us at{' '}
          <a href="mailto:hr@crowdpnl.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">hr@crowdpnl.com</a>
        </p>

        <div className="space-y-5">
          {openings.map((job) => (
            <div key={job.title} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] transition-colors group">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-lg">{job.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">{job.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/35">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.team}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  </div>
                </div>
                <a href={`mailto:hr@crowdpnl.com?subject=Application: ${job.title}`}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white/70 hover:text-white text-xs font-semibold transition-all">
                  Apply <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              <p className="text-white/45 text-sm leading-relaxed mb-4">{job.description}</p>
              <ul className="space-y-1.5">
                {job.requirements.map(r => (
                  <li key={r} className="flex items-start gap-2 text-xs text-white/30">
                    <span className="text-emerald-500 mt-0.5">✓</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
