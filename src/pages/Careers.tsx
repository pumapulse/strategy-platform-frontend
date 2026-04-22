import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { Briefcase, MapPin, ArrowRight, Zap, Users, TrendingUp, Code, Globe, Heart, Star, Send, Loader2, CheckCircle } from 'lucide-react';

const cultureValues = [
  { icon: Globe, title: 'Remote-First', body: 'Work from anywhere. We have team members across 4 countries and async is our default.', img: '/img/about/remote2.jpg', pos: 'object-top' },
  { icon: TrendingUp, title: 'Rapid Growth', body: 'We move fast, ship often, and learn from real users. Your work has direct impact from day one.', img: '/img/about/Annotation 2026-04-05 154912.jpg', pos: 'object-top' },
  { icon: Heart, title: 'Real Impact', body: 'Every feature you build reaches thousands of active traders. You will see your work matter immediately.', img: '/img/about/young-employees-sitting-office-table-using-laptop-team-work-brainstorming-meeting-concept.jpg', pos: 'object-center' },
  { icon: Users, title: 'Diverse Team', body: 'We hire for curiosity and craft, not credentials. Our team spans quants, engineers, and traders.', img: '/img/about/Annotation 2026-04-04 225503.jpg', pos: 'object-top' },
];

const perks = [
  { icon: Zap, title: 'Competitive Salary', body: 'Market-rate compensation benchmarked against top fintech companies.' },
  { icon: TrendingUp, title: 'Equity', body: 'Everyone on the team has skin in the game. We share in the upside together.' },
  { icon: Globe, title: 'Fully Remote', body: 'Work from anywhere. We cover your home office setup and co-working memberships.' },
  { icon: Code, title: 'Learning Budget', body: '$2,000/year for courses, conferences, books, and trading tools. We invest in you.' },
  { icon: Heart, title: 'Health Benefits', body: 'Comprehensive health, dental, and vision coverage for you and your family.' },
  { icon: Star, title: 'Flexible Hours', body: 'We care about output, not hours. Work when you are most productive.' },
];

const openings = [
  { title: 'Quantitative Researcher', type: 'Full-time', location: 'Remote / Toronto', team: 'Research', description: 'Develop and validate systematic trading strategies across crypto markets. You will work with historical data, build backtesting frameworks, and publish new strategies to the platform.', requirements: ['3+ years in quantitative finance or algorithmic trading', 'Strong Python skills (pandas, numpy, backtrader)', 'Experience with crypto market data', 'Familiarity with statistical testing and walk-forward validation'] },
  { title: 'Full-Stack Engineer', type: 'Full-time', location: 'Remote', team: 'Engineering', description: 'Build and scale the CrowdPnL platform. You will work across the React frontend and Node.js backend, shipping features that thousands of traders use daily.', requirements: ['3+ years with React and TypeScript', 'Experience with Node.js and PostgreSQL/Supabase', 'Familiarity with WebSockets and real-time data', 'Strong product sense and attention to detail'] },
  { title: 'Community Manager', type: 'Part-time', location: 'Remote', team: 'Growth', description: 'Grow and nurture our trader community. You will moderate discussions, create educational content, and be the voice of CrowdPnL across social channels.', requirements: ['Passion for trading and crypto markets', 'Experience managing online communities', 'Strong written communication skills', 'Familiarity with Discord, Twitter/X, and Telegram'] },
];

interface ApplyForm { name: string; email: string; role: string; linkedin: string; message: string; }

export default function Careers() {
  const [form, setForm] = useState<ApplyForm>({ name: '', email: '', role: '', linkedin: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    setSent(true);
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src="/img/about/Annotation 2026-04-04 230240.jpg" alt="Team" className="w-full h-full object-cover opacity-35" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a14]/50 via-[#0a0e1a]/75 to-[#0a0e1a]" />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 container mx-auto px-6 pt-36 pb-20 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <RevealSection variant="left">
              <div className="flex items-center gap-3 mb-6"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Careers</span></div>
              <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-[1.0] mb-6">
                <span className="text-white">Join the team.</span><br />
                <span className="bg-gradient-to-r from-[#9966ff] to-[#cc99ff] bg-clip-text text-transparent">Build the edge.</span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-6 max-w-lg">We are a small, remote-first team building trading strategy platform in crypto. If you are passionate about markets and great products, we would love to hear from you.</p>
              <p className="text-white/30 text-sm">{"Don't"} see a role? <a href="mailto:hr@crowdpnl.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">Email us directly</a></p>
            </RevealSection>
            <RevealSection variant="right">
              <div className="relative h-[440px]">
                <img src="/img/about/workers-it-company-working-computer (1).jpg" alt="Team" className="absolute top-0 left-0 w-3/4 h-[340px] object-cover object-[center_30%]" onError={(e) => { (e.target as HTMLImageElement).src = '/img/about/workers-it-company-working-computer.jpg'; }} />
                <div className="absolute top-0 left-0 w-3/4 h-[340px] bg-gradient-to-t from-[#0a0e1a]/50 to-transparent pointer-events-none" />
                <img src="/img/about/serious-colleagues-office-talking-with-each-other.jpg" alt="Office" className="absolute bottom-0 right-0 w-[55%] h-[240px] object-cover border-4 border-[#0a0e1a]" onError={(e) => { (e.target as HTMLImageElement).src = '/img/about/Annotation 2026-04-05 001857.jpg'; }} />
                <div className="absolute bottom-0 right-0 w-[55%] h-[240px] bg-gradient-to-t from-[#0a0e1a]/50 to-transparent pointer-events-none" />
                <div className="absolute top-[42%] left-[52%] -translate-x-1/2 -translate-y-1/2 z-10 bg-[#060a14] border border-white/[0.12] px-5 py-4 text-center shadow-2xl">
                  <div className="text-3xl font-black text-white">3<span className="text-emerald-400">+</span></div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Open Roles</div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Culture — lighter bg, clearly different from hero */}
      <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)' }}>
        <div className="absolute top-0 left-0 w-[500px] h-[400px] bg-[#9966ff]/[0.04] rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <RevealSection variant="up">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Our Culture</span></div>
              <h2 className="text-5xl font-black text-white mb-3">How we work.</h2>
              <p className="text-white/40 text-base max-w-xl">We are building something meaningful. Here is what it is like to be part of the team.</p>
            </div>
          </RevealSection>
          <RevealSection variant="stagger">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {cultureValues.map(({ icon: Icon, title, body, img, pos }) => (
                <div key={title} className="border border-white/[0.08] bg-[#0f1420] hover:border-[#9966ff]/30 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={img} alt={title} className={`w-full h-full object-cover ${pos} opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500`} onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1420] via-[#0f1420]/40 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/40 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 border-t border-white/[0.06]">
                    <h3 className="text-white font-black text-base mb-2 group-hover:text-emerald-400 transition-colors">{title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Perks — back to very dark with purple tint */}
      <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0e0b1e 50%, #0a0e1a 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(153,102,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(153,102,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#9966ff]/[0.04] rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <RevealSection variant="up">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Benefits & Perks</span></div>
              <h2 className="text-5xl font-black text-white">What we offer.</h2>
            </div>
          </RevealSection>
          <RevealSection variant="stagger">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
              {perks.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-[#0a0e1a] p-7 border-l-2 border-[#9966ff]/30 hover:border-[#9966ff] hover:bg-[#0e0b1e] hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="w-10 h-10 bg-[#9966ff]/10 border border-[#9966ff]/20 flex items-center justify-center mb-5 group-hover:bg-[#9966ff]/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-5 h-5 text-[#9966ff]" />
                  </div>
                  <h3 className="text-white font-black text-base mb-2 group-hover:text-[#cc99ff] transition-colors">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Open Roles — lighter again, clearly distinct */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <RevealSection variant="up">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Open Roles</span></div>
              <h2 className="text-5xl font-black text-white">Current openings.</h2>
            </div>
          </RevealSection>
          <div>
            {openings.map((job, i) => (
              <RevealSection key={job.title} variant="up">
                <div className={`py-8 px-4 hover:bg-white/[0.02] hover:pl-6 transition-all duration-300 ${i < openings.length - 1 ? 'border-b border-white/[0.07]' : ''}`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-white font-black text-xl">{job.title}</h3>
                        <span className="text-[10px] px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/30">
                        <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" />{job.team}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{job.location}</span>
                      </div>
                    </div>
                    <a href="#apply" onClick={() => setForm(prev => ({ ...prev, role: job.title }))} className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0f1420] border border-white/[0.10] hover:border-emerald-500/30 hover:bg-emerald-500/10 text-white/70 hover:text-emerald-400 text-xs font-semibold transition-all">
                      Apply <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed mb-4">{job.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {job.requirements.map(r => (
                      <li key={r} className="flex items-start gap-2 text-xs text-white/30">
                        <span className="text-emerald-400 mt-0.5 shrink-0">&#10003;</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Form — strong purple gradient, clearly the final CTA section */}
      <section id="apply" className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d0a1e 0%, #130d28 40%, #0a0e1a 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(153,102,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(153,102,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#9966ff]/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <RevealSection variant="up">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Apply Now</span></div>
            <h2 className="text-4xl font-black text-white mb-3">Ready to join us?</h2>
            <p className="text-white/40 text-sm">Fill out the form below and we will be in touch within a few days.</p>
          </div>
        </RevealSection>
        <RevealSection variant="up">
          {sent ? (
            <div className="flex flex-col items-center justify-center text-center p-16 border border-emerald-500/20 bg-emerald-500/[0.04]">
              <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-6"><CheckCircle className="w-9 h-9 text-emerald-400" /></div>
              <h3 className="text-white font-black text-3xl mb-3">Application sent!</h3>
              <p className="text-white/40 text-sm max-w-xs mb-8 leading-relaxed">Thanks for applying. We review every application and will be in touch within a few days.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', role: '', linkedin: '', message: '' }); }} className="inline-flex items-center gap-2 px-6 py-3 border border-white/[0.12] text-white/60 hover:text-white hover:border-white/25 text-sm font-semibold transition-all">Submit another application</button>
            </div>
          ) : (
            <div className="p-8 border border-white/[0.07] bg-[#0f1420]">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 block">Full Name</label>
                    <input required name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="w-full px-4 py-3 bg-[#060a14] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/40 transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 block">Email</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full px-4 py-3 bg-[#060a14] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/40 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 block">Role</label>
                  <select required name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-3 bg-[#060a14] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-emerald-500/40 transition-all appearance-none cursor-pointer">
                    <option value="" disabled className="bg-[#0a0e1a]">Select a role...</option>
                    {openings.map(j => <option key={j.title} value={j.title} className="bg-[#0a0e1a]">{j.title}</option>)}
                    <option value="General Application" className="bg-[#0a0e1a]">General Application</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 block">LinkedIn / Portfolio URL</label>
                  <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" className="w-full px-4 py-3 bg-[#060a14] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/40 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 block">Why CrowdPnL?</label>
                  <textarea required rows={5} name="message" value={form.message} onChange={handleChange} placeholder="Tell us about yourself and why you would be a great fit..." className="w-full px-4 py-3 bg-[#060a14] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/40 transition-all resize-none" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-white/20">We will review your application within a few days.</p>
                  <button type="submit" disabled={sending} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-bold text-sm transition-all">
                    {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Application</>}
                  </button>
                </div>
              </form>
            </div>
          )}
        </RevealSection>
      </section>

      <Footer />
    </div>
  );
}
