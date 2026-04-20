import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare, Clock, CheckCircle } from 'lucide-react';

const contactMethods = [
  { icon: Mail, label: 'General Inquiries', value: 'hello@crowdpnl.com', href: 'mailto:hello@crowdpnl.com', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { icon: Mail, label: 'Business & Partnerships', value: 'sales@crowdpnl.com', href: 'mailto:sales@crowdpnl.com', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { icon: Mail, label: 'Careers', value: 'hr@crowdpnl.com', href: 'mailto:hr@crowdpnl.com', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
  { icon: Phone, label: 'Phone', value: '+1 (681) 553-4010', href: 'tel:+16815534010', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { icon: MapPin, label: 'Office', value: '43 King Street West, Toronto, ON, Canada', href: undefined, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' },
  { icon: Clock, label: 'Response Time', value: 'Within 1–2 business days', href: undefined, color: 'text-teal-400', bg: 'bg-teal-400/10', border: 'border-teal-400/20' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1920&q=80"
            alt="Contact"
            className="w-full h-full object-cover opacity-8"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/70 via-[#0a0e1a]/85 to-[#0a0e1a]" />
        </div>
        <div className="relative z-10 container mx-auto px-6 pt-40 pb-20 max-w-5xl">
          <RevealSection variant="up">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-6 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Contact Us</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.0] mb-5">
              Let's talk.
            </h1>
            <p className="text-white/50 text-xl leading-relaxed max-w-xl">
              We're a small team and we read every message. Whether it's a question, a partnership idea, or just feedback — we'd love to hear from you.
            </p>
          </RevealSection>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Contact methods */}
          <RevealSection variant="left" className="lg:col-span-2">
            <div className="space-y-3">
              {contactMethods.map(({ icon: Icon, label, value, href, color, bg, border }) => (
                <div key={label} className={`flex items-start gap-4 p-4 rounded-2xl border ${border} bg-white/[0.02] hover-lift`}>
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-white/30 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
                    {href
                      ? <a href={href} className="text-sm text-white/65 hover:text-white transition-colors">{value}</a>
                      : <p className="text-sm text-white/65">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>

          {/* Form */}
          <RevealSection variant="right" className="lg:col-span-3">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-5">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-white font-black text-2xl mb-3">Message sent!</h3>
                <p className="text-white/40 text-sm max-w-xs">We'll get back to you within 1–2 business days. Check your inbox.</p>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <p className="text-white font-bold text-base">Send us a message</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-1.5 block">Name</label>
                      <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-1.5 block">Email</label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-1.5 block">Subject</label>
                    <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                      placeholder="What's this about?"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-1.5 block">Message</label>
                    <textarea required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us more..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none" />
                  </div>
                  <button type="submit" disabled={sending}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-semibold text-sm transition-all">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}
          </RevealSection>
        </div>
      </div>
      <Footer />
    </div>
  );
}
