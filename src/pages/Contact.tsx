import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate send
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">

        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-6 bg-emerald-500" />
          <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Contact Us</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white mb-4">Get in touch.</h1>
        <p className="text-white/50 text-lg mb-14">We're a small team and we read every message.</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: Mail, label: 'General', value: 'hello@crowdpnl.com', href: 'mailto:hello@crowdpnl.com' },
              { icon: Mail, label: 'Business', value: 'sales@crowdpnl.com', href: 'mailto:sales@crowdpnl.com' },
              { icon: Mail, label: 'Jobs', value: 'hr@crowdpnl.com', href: 'mailto:hr@crowdpnl.com' },
              { icon: Phone, label: 'Phone', value: '+1 (681) 553-4010', href: 'tel:+16815534010' },
              { icon: MapPin, label: 'Address', value: '43 King Street West, Toronto, ON, Canada', href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="w-9 h-9 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-white/30 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
                  {href
                    ? <a href={href} className="text-sm text-white/70 hover:text-white transition-colors">{value}</a>
                    : <p className="text-sm text-white/70">{value}</p>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Send className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Message sent!</h3>
                <p className="text-white/40 text-sm">We'll get back to you within 1–2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-1.5 block">Name</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-1.5 block">Email</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-1.5 block">Subject</label>
                  <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-1.5 block">Message</label>
                  <textarea required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us more..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none" />
                </div>
                <button type="submit" disabled={sending}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-semibold text-sm transition-all">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
