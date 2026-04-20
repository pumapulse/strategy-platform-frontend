import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const sections = [
  { title: '1. Information We Collect', content: 'We collect information you provide directly to us when you create an account, such as your name and email address. We also collect usage data including pages visited, features used, and interactions with the platform. We do not collect financial account information or trading credentials from external exchanges.' },
  { title: '2. How We Use Your Information', content: 'We use the information we collect to provide, maintain, and improve our services; send you technical notices and support messages; respond to your comments and questions; and send you information about new strategies, features, and promotions. You may opt out of marketing communications at any time.' },
  { title: '3. Information Sharing', content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our platform, conducting our business, or servicing you, as long as those parties agree to keep this information confidential and use it only for the purposes we specify.' },
  { title: '4. Data Security', content: 'We implement industry-standard security measures to protect your personal information. All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We conduct regular security audits and penetration tests. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.' },
  { title: '5. Cookies & Tracking', content: 'We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies help us remember your preferences, keep you logged in, and understand how you use the platform. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept cookies, some portions of our platform may not function properly.' },
  { title: '6. Third-Party Services', content: 'Our platform may contain links to third-party websites or services, including payment processors and analytics providers. We are not responsible for the privacy practices of those sites. We encourage you to review the privacy policies of any third-party sites you visit. We use Stripe for payment processing and Supabase for data storage, both of which maintain their own privacy policies.' },
  { title: "7. Children's Privacy", content: 'Our platform is not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information without parental consent, please contact us immediately and we will take steps to remove that information.' },
  { title: '8. Your Rights', content: 'Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete your data; the right to data portability; and the right to object to or restrict certain processing. To exercise these rights, please contact us at privacy@crowdpnl.com. We will respond to your request within 30 days.' },
  { title: '9. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page, updating the effective date, and sending an email notification to registered users. Your continued use of the platform after any changes constitutes your acceptance of the new policy.' },
];

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-[#0a0e1a] to-[#0a0e1a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 pt-40 pb-16 max-w-3xl">
          <RevealSection variant="up">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Legal</span>
            </div>
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight text-white mb-2">Privacy Policy</h1>
                <p className="text-white/30 text-sm">Effective date: January 1, 2025 · Last updated: January 1, 2025</p>
              </div>
            </div>
            <p className="text-white/45 text-base leading-relaxed mt-6">Your privacy matters to us. This policy explains what data we collect, how we use it, and the choices you have. We keep it plain and honest — no legalese.</p>
          </RevealSection>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <RevealSection variant="up">
          <div>
            {sections.map(({ title, content }, i) => (
              <div key={title} className={`py-8 ${i < sections.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
                <h2 className="text-white font-bold text-base mb-3">{title}</h2>
                <p className="text-white/40 text-sm leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
        </RevealSection>

        <RevealSection variant="up">
          <div className="mt-12 p-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-1">Questions about this policy?</p>
                <p className="text-white/40 text-sm mb-3">We're happy to explain anything in plain language. Reach out any time.</p>
                <a href="mailto:privacy@crowdpnl.com" className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                  privacy@crowdpnl.com <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection variant="up">
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <button onClick={() => navigate('/terms')} className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms of Service →</button>
            <button onClick={() => navigate('/contact')} className="text-xs text-white/30 hover:text-white/60 transition-colors">Contact Us →</button>
          </div>
        </RevealSection>
      </div>

      <Footer />
    </div>
  );
}
