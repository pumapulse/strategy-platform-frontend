import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Eye, Database, Bell, Globe, UserCheck, Trash2, RefreshCw } from 'lucide-react';

const highlights = [
  { icon: Lock, label: 'TLS 1.3 Encryption', sub: 'All data in transit' },
  { icon: Database, label: 'AES-256 at Rest', sub: 'Encrypted storage' },
  { icon: Eye, label: 'No Data Selling', sub: 'Ever, to anyone' },
  { icon: UserCheck, label: 'GDPR Aligned', sub: 'Your rights respected' },
];

const sections = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide directly to us when you create an account, such as your name and email address. We also collect usage data including pages visited, features used, time spent on the platform, and interactions with strategies and community content. Device information such as browser type, operating system, and IP address may also be collected for security and analytics purposes. We do not collect financial account information, private keys, wallet addresses, or trading credentials from external exchanges.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use the information we collect to: provide, maintain, and improve our services; authenticate your identity and keep your account secure; send you technical notices, security alerts, and support messages; respond to your comments, questions, and requests; send you information about new strategies, features, and promotions (you may opt out at any time); monitor and analyze usage patterns to improve the platform; detect, investigate, and prevent fraudulent transactions and other illegal activities; and comply with legal obligations.',
  },
  {
    title: '3. Information Sharing',
    content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with: trusted service providers who assist us in operating our platform (such as cloud hosting, email delivery, and analytics), as long as those parties agree to keep this information confidential; law enforcement or government authorities when required by law or to protect our rights; and business partners in the event of a merger, acquisition, or sale of assets, in which case we will notify you before your information is transferred.',
  },
  {
    title: '4. Data Security',
    content: 'We implement multiple layers of security to protect your personal information. All data transmitted between your browser and our servers is encrypted using TLS 1.3. Data stored in our databases is encrypted at rest using AES-256. We conduct regular security audits, vulnerability assessments, and penetration tests. Access to user data is restricted to authorized personnel on a need-to-know basis. We maintain incident response procedures and will notify affected users within 72 hours of discovering a data breach. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: '5. Cookies & Tracking',
    content: 'We use cookies and similar tracking technologies to track activity on our platform and hold certain information. We use three types of cookies: essential cookies (required for the platform to function, such as authentication tokens), preference cookies (to remember your settings and preferences), and analytics cookies (to understand how users interact with the platform). You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept essential cookies, some portions of our platform may not function properly. We do not use advertising cookies or sell cookie data to third parties.',
  },
  {
    title: '6. Third-Party Services',
    content: 'Our platform integrates with the following third-party services: Supabase (database and authentication), Stripe (payment processing), Resend (transactional email), and Binance API (market data). Each of these services has its own privacy policy and data handling practices. We encourage you to review their policies. We are not responsible for the privacy practices of third-party sites linked from our platform. We carefully vet all third-party integrations and only work with providers that meet our security standards.',
  },
  {
    title: '7. Data Retention',
    content: 'We retain your personal information for as long as your account is active or as needed to provide you services. If you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal, regulatory, or legitimate business purposes (such as fraud prevention or tax records). Usage data and analytics may be retained in anonymized form for up to 2 years for platform improvement purposes.',
  },
  {
    title: "8. Children's Privacy",
    content: 'Our platform is not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information without your consent, please contact us immediately at privacy@crowdpnl.com. We will take steps to remove that information from our systems within 30 days of receiving your request.',
  },
  {
    title: '9. Your Rights',
    content: 'Depending on your location, you may have the following rights regarding your personal data: the right to access a copy of the personal data we hold about you; the right to correct inaccurate or incomplete data; the right to delete your personal data (right to be forgotten); the right to restrict or object to certain processing; the right to data portability (receive your data in a machine-readable format); and the right to withdraw consent at any time. To exercise any of these rights, please contact us at privacy@crowdpnl.com. We will respond to your request within 30 days. We may need to verify your identity before processing your request.',
  },
  {
    title: '10. International Data Transfers',
    content: 'CrowdPnL is based in Canada and our servers are located in North America. If you access our platform from outside Canada or the United States, your information may be transferred to, stored, and processed in a country with different data protection laws than your own. By using our platform, you consent to the transfer of your information to Canada and the United States. We take appropriate safeguards to ensure your data is protected in accordance with this Privacy Policy regardless of where it is processed.',
  },
  {
    title: '11. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the new policy on this page, updating the effective date at the top, and sending an email notification to registered users at least 14 days before the changes take effect. Your continued use of the platform after any changes constitutes your acceptance of the new policy. We encourage you to review this policy periodically.',
  },
];

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[55vh] flex items-center border-b border-white/[0.06]">
        <div className="absolute inset-0">
          <img src="/img/security/Annotation 2026-04-04 220851.jpg" alt="Security" className="w-full h-full object-cover opacity-[0.15]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a14]/70 via-[#0a0e1a]/85 to-[#0a0e1a]" />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 pt-36 pb-16 max-w-5xl">
          <RevealSection variant="up">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Legal</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white mb-2">Privacy Policy</h1>
                    <p className="text-white/30 text-sm">Effective: January 1, 2025 &middot; Last updated: January 1, 2025</p>
                  </div>
                </div>
                <p className="text-white/50 text-base leading-relaxed">Your privacy matters to us. This policy explains what data we collect, how we use it, and the choices you have. We keep it plain and honest â€” no legalese.</p>
              </div>
              {/* Security highlights */}
              <div className="grid grid-cols-2 gap-3">
                {highlights.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">{label}</p>
                      <p className="text-white/35 text-[10px] mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-white/[0.07]">
                <img src="/img/security/Annotation 2026-04-04 221253.jpg" alt="Security" className="w-full h-36 object-cover opacity-70" />
              </div>
              <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Quick Nav</p>
                <div className="space-y-1.5">
                  {sections.slice(0, 6).map(({ title }) => (
                    <p key={title} className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-default leading-relaxed">{title}</p>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04]">
                <p className="text-xs font-bold text-emerald-400 mb-2">Questions?</p>
                <a href="mailto:privacy@crowdpnl.com" className="text-xs text-white/50 hover:text-emerald-400 transition-colors">privacy@crowdpnl.com</a>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <RevealSection variant="up">
              <div>
                {sections.map(({ title, content }, i) => (
                  <div key={title} className={`py-8 ${i < sections.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
                    <h2 className="text-white font-black text-lg mb-3">{title}</h2>
                    <p className="text-white/45 text-sm leading-[1.9]">{content}</p>
                  </div>
                ))}
              </div>
            </RevealSection>

            {/* Contact box */}
            <RevealSection variant="up">
              <div className="mt-12 p-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm mb-1">Questions about this policy?</p>
                    <p className="text-white/40 text-sm mb-3">We are happy to explain anything in plain language. Reach out any time and we will respond within 2 business days.</p>
                    <a href="mailto:privacy@crowdpnl.com" className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                      privacy@crowdpnl.com <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </RevealSection>

            <RevealSection variant="up">
              <div className="mt-6 flex items-center gap-4 flex-wrap">
                <button onClick={() => navigate('/terms')} className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms of Service &rarr;</button>
                <button onClick={() => navigate('/contact')} className="text-xs text-white/30 hover:text-white/60 transition-colors">Contact Us &rarr;</button>
              </div>
            </RevealSection>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

