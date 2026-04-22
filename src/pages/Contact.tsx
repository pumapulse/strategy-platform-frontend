import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const contactItems = [
  { icon: Mail, label: 'General Inquiries', value: 'hello@crowdpnl.com', href: 'mailto:hello@crowdpnl.com', sub: 'Questions, feedback, anything' },
  { icon: Phone, label: 'Phone', value: '+1 (681) 553-4010', href: 'tel:+16815534010', sub: 'Mon-Fri, 9am-5pm EST' },
  { icon: MapPin, label: 'Office', value: '43 King Street West', href: undefined, sub: 'Toronto, ON, Canada' },
  { icon: Clock, label: 'Response Time', value: '1-2 business days', href: undefined, sub: 'We read every message' },
];

interface FormState { name: string; email: string; subject: string; message: string; }

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
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
      <section className="relative overflow-hidden min-h-[65vh] flex items-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=90" alt="Contact" className="w-full h-full object-cover opacity-35" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a14]/60 via-[#0a0e1a]/80 to-[#0a0e1a]" />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 container mx-auto px-6 pt-36 pb-20 max-w-6xl">
          <RevealSection variant="up">
            <div className="flex items-center gap-3 mb-6"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Contact Us</span></div>
            <h1 className="text-7xl lg:text-8xl font-black tracking-tight leading-[1.0] mb-5">
              <span className="text-white">{"Let's"}</span><br />
              <span className="bg-gradient-to-r from-[#9966ff] to-[#cc99ff] bg-clip-text text-transparent">talk.</span>
            </h1>
            <p className="text-white/50 text-xl leading-relaxed max-w-xl">We are a small team and we read every message. Whether it is a question, a partnership idea, or just feedback â€” we would love to hear from you.</p>
          </RevealSection>
        </div>
      </section>

      {/* Main */}
      <section className="relative pb-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9966ff]/[0.04] rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="container mx-auto px-6 pt-16 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          <RevealSection variant="left" className="lg:col-span-2">
            <div>
              {contactItems.map(({ icon: Icon, label, value, href, sub }, i) => (
                <div key={label} className={`flex items-start gap-4 py-6 ${i < contactItems.length - 1 ? 'border-b border-white/[0.07]' : ''}`}>
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">{label}</p>
                    {href ? <a href={href} className="text-sm font-semibold text-white/80 hover:text-emerald-400 transition-colors block">{value}</a>
                      : <p className="text-sm font-semibold text-white/80">{value}</p>}
                    <p className="text-xs text-white/30 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
              <div className="pt-6 border-t border-white/[0.07]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-4">Other contacts</p>
                {[{ label: 'Business & Partnerships', email: 'sales@crowdpnl.com' }, { label: 'Careers', email: 'hr@crowdpnl.com' }, { label: 'Legal', email: 'legal@crowdpnl.com' }].map(({ label, email }) => (
                  <div key={email} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                    <span className="text-xs text-white/35">{label}</span>
                    <a href={`mailto:${email}`} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">{email}</a>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>

          <RevealSection variant="right" className="lg:col-span-3">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center p-16 border border-emerald-500/20 bg-emerald-500/[0.04] min-h-[480px]">
                <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <CheckCircle className="w-9 h-9 text-emerald-400" />
                </div>
                <h3 className="text-white font-black text-3xl mb-3">Message sent!</h3>
                <p className="text-white/40 text-sm max-w-xs mb-8 leading-relaxed">We will get back to you within 1-2 business days.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="inline-flex items-center gap-2 px-6 py-3 border border-white/[0.12] text-white/60 hover:text-white hover:border-white/25 text-sm font-semibold transition-all">Send another message</button>
              </div>
            ) : (
              <div className="p-8 border border-white/[0.07] bg-[#0f1420]">
                <div className="flex items-center gap-3 mb-7 pb-5 border-b border-white/[0.06]">
                  <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-white font-bold text-base">Send us a message</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 block">Your Name</label>
                      <input required name="name" value={form.name} onChange={handleChange} placeholder="Alex Rivera" className="w-full px-4 py-3 bg-[#060a14] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/40 transition-all" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 block">Email Address</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full px-4 py-3 bg-[#060a14] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/40 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 block">Subject</label>
                    <select required name="subject" value={form.subject} onChange={handleChange} className="w-full px-4 py-3 bg-[#060a14] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-emerald-500/40 transition-all appearance-none cursor-pointer">
                      <option value="" disabled className="bg-[#0a0e1a]">Select a topic...</option>
                      {['General Question', 'Strategy Support', 'Billing & Subscription', 'Partnership', 'Bug Report', 'Other'].map(o => <option key={o} value={o} className="bg-[#0a0e1a]">{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 block">Message</label>
                    <textarea required name="message" rows={6} value={form.message} onChange={handleChange} placeholder="Tell us more about what you need..." className="w-full px-4 py-3 bg-[#060a14] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/40 transition-all resize-none" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-white/20">We will reply within 1-2 business days.</p>
                    <button type="submit" disabled={sending} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-bold text-sm transition-all">
                      {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </RevealSection>
        </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[#060a14] py-10">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">Looking for legal or privacy information?</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/privacy')} className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors font-semibold">Privacy Policy <ArrowRight className="w-3 h-3" /></button>
            <button onClick={() => navigate('/terms')} className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors font-semibold">Terms of Service <ArrowRight className="w-3 h-3" /></button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}



