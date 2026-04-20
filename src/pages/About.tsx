import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Target, Zap, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-6 bg-emerald-500" />
          <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">About Us</span>
        </div>

        <h1 className="text-5xl font-black tracking-tight text-white mb-6">
          Built by traders,<br />
          <span className="text-emerald-400">for traders.</span>
        </h1>
        <p className="text-white/50 text-lg leading-relaxed mb-16 max-w-2xl">
          CrowdPnL was founded with one goal: give every trader access to institutional-grade strategies without the institutional price tag. We believe systematic trading should be accessible, transparent, and backed by real data.
        </p>

        {/* Mission cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {[
            { icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Our Mission', body: 'Democratize professional trading strategies. Every strategy on our platform is fully backtested, documented, and available to anyone — free or premium.' },
            { icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Our Standards', body: 'We only publish strategies with verifiable backtests. No black boxes, no vague signals — every entry, exit, and risk rule is documented in plain language.' },
            { icon: Zap, color: 'text-violet-400', bg: 'bg-violet-400/10', title: 'Our Edge', body: 'Our team combines quantitative research, machine learning, and on-chain analytics to surface strategies that hold up across market cycles.' },
            { icon: Users, color: 'text-amber-400', bg: 'bg-amber-400/10', title: 'Our Community', body: 'Over 1,200 active traders share insights, discuss strategies, and hold each other accountable in our community hub. Trading is better together.' },
          ].map(({ icon: Icon, color, bg, title, body }) => (
            <div key={title} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-white mb-2">The Team</h2>
          <p className="text-white/40 text-sm mb-8">A small, focused team of quants, engineers, and traders.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { name: 'Alex Rivera', role: 'Co-Founder & Quant', bio: '8 years in algorithmic trading. Former prop desk at a Toronto hedge fund.' },
              { name: 'Mia Chen', role: 'Co-Founder & CTO', bio: 'Full-stack engineer with a background in fintech and distributed systems.' },
              { name: 'Liam Park', role: 'Head of Research', bio: 'PhD in financial mathematics. Specializes in crypto market microstructure.' },
            ].map(({ name, role, bio }) => (
              <div key={name} className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                <div className="w-12 h-12 rounded-full bg-white/[0.08] flex items-center justify-center text-white font-black text-lg mb-4">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-white font-semibold text-sm">{name}</p>
                <p className="text-emerald-400 text-xs mb-2">{role}</p>
                <p className="text-white/35 text-xs leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          {[
            { value: '12', label: 'Strategies' },
            { value: '1,200+', label: 'Active Traders' },
            { value: '2023', label: 'Founded' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="text-white/35 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
