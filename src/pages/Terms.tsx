import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing or using the CrowdPnL platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and your continued use of the platform after any changes constitutes acceptance of the revised terms.' },
  { title: '2. Description of Service', content: 'CrowdPnL provides a platform for accessing, reviewing, and discussing systematic trading strategies for cryptocurrency markets. All strategies are provided for educational and informational purposes only. We do not provide financial advice, investment advice, or trading recommendations. Past performance of any strategy does not guarantee future results.' },
  { title: '3. Not Financial Advice', content: 'The content on CrowdPnL, including all strategies, signals, backtests, performance metrics, and community discussions, is for informational purposes only and does not constitute financial or investment advice. You should consult a qualified financial advisor before making any investment decisions. Trading cryptocurrencies involves significant risk of loss, including the possible loss of all invested capital.' },
  { title: '4. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. You must be at least 18 years of age to create an account. We reserve the right to terminate accounts that violate these terms or engage in fraudulent activity.' },
  { title: '5. Subscription and Payments', content: 'Premium and Elite subscriptions are billed on a recurring monthly or annual basis. You may cancel your subscription at any time through your account settings. Cancellations take effect at the end of the current billing period, and you will retain access until that date. We do not provide refunds for partial billing periods. Prices are subject to change with 30 days written notice.' },
  { title: '6. Intellectual Property', content: 'All content on the CrowdPnL platform, including strategy descriptions, algorithms, code, documentation, logos, and design elements, is the intellectual property of CrowdPnL or its licensors and is protected by applicable copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.' },
  { title: '7. User Content', content: 'By posting content in our community forums or discussions, you grant CrowdPnL a non-exclusive, royalty-free, worldwide license to use, display, reproduce, and distribute that content on our platform. You are solely responsible for the content you post and represent that you have all necessary rights to post it. You agree not to post content that is illegal, harmful, defamatory, or violates the rights of others.' },
  { title: '8. Limitation of Liability', content: 'CrowdPnL and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform, any trading decisions made based on content found on the platform, or any unauthorized access to your account. Our total aggregate liability shall not exceed the amount you paid us in the 12 months preceding the claim.' },
  { title: '9. Prohibited Activities', content: 'You agree not to: use the platform for any unlawful purpose or in violation of any regulations; attempt to gain unauthorized access to any part of the platform or its infrastructure; scrape, harvest, or systematically collect data without prior written permission; impersonate any person or entity; post spam or unsolicited commercial messages; or interfere with the proper functioning of the platform in any way.' },
  { title: '10. Governing Law', content: 'These Terms of Service shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions. Any disputes arising under or in connection with these terms shall be resolved exclusively in the courts of Toronto, Ontario. You consent to the personal jurisdiction of such courts.' },
  { title: '11. Contact', content: 'For questions about these Terms of Service, please contact our legal team at legal@crowdpnl.com or by mail at 43 King Street West, Toronto, ON, Canada. We aim to respond to all legal inquiries within 5 business days.' },
];

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-[#0a0e1a] to-[#0a0e1a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 pt-40 pb-16 max-w-3xl">
          <RevealSection variant="up">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-emerald-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Legal</span>
            </div>
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                <FileText className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight text-white mb-2">Terms of Service</h1>
                <p className="text-white/30 text-sm">Effective date: January 1, 2025 &middot; Last updated: January 1, 2025</p>
              </div>
            </div>
            <p className="text-white/45 text-base leading-relaxed mt-6">Please read these terms carefully before using CrowdPnL. By using our platform, you agree to be bound by these terms and our Privacy Policy.</p>
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
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-1">Questions about these terms?</p>
                <p className="text-white/40 text-sm mb-3">Our legal team is happy to clarify anything. We aim to respond within 5 business days.</p>
                <a href="mailto:legal@crowdpnl.com" className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                  legal@crowdpnl.com <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection variant="up">
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <button onClick={() => navigate('/privacy')} className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy Policy &rarr;</button>
            <button onClick={() => navigate('/contact')} className="text-xs text-white/30 hover:text-white/60 transition-colors">Contact Us &rarr;</button>
          </div>
        </RevealSection>
      </div>

      <Footer />
    </div>
  );
}
