import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { FileText } from 'lucide-react';

const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing or using the CrowdPnL platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and your continued use constitutes acceptance of any changes.' },
  { title: '2. Description of Service', content: 'CrowdPnL provides a platform for accessing, reviewing, and discussing trading strategies. All strategies are provided for educational and informational purposes only. We do not provide financial advice, investment advice, or trading recommendations. Past performance of any strategy does not guarantee future results.' },
  { title: '3. Not Financial Advice', content: 'The content on CrowdPnL, including all strategies, signals, backtests, and community discussions, is for informational purposes only and does not constitute financial or investment advice. You should consult a qualified financial advisor before making any investment decisions. Trading involves significant risk of loss.' },
  { title: '4. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these terms.' },
  { title: '5. Subscription and Payments', content: 'Premium and Elite subscriptions are billed on a recurring basis. You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period. We do not provide refunds for partial billing periods. Prices are subject to change with 30 days notice.' },
  { title: '6. Intellectual Property', content: 'All content on the CrowdPnL platform, including strategy descriptions, algorithms, code, and documentation, is the intellectual property of CrowdPnL or its licensors. You may not reproduce, distribute, or create derivative works without our express written permission.' },
  { title: '7. User Content', content: 'By posting content in our community, you grant CrowdPnL a non-exclusive, royalty-free license to use, display, and distribute that content on our platform. You are solely responsible for the content you post and agree not to post content that is illegal, harmful, or violates the rights of others.' },
  { title: '8. Limitation of Liability', content: 'CrowdPnL shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform or any trading decisions made based on content found on the platform. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.' },
  { title: '9. Prohibited Activities', content: 'You agree not to: use the platform for any unlawful purpose; attempt to gain unauthorized access to any part of the platform; scrape or harvest data without permission; impersonate any person or entity; or interfere with the proper functioning of the platform.' },
  { title: '10. Governing Law', content: 'These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Toronto, Ontario.' },
  { title: '11. Contact', content: 'For questions about these Terms of Service, please contact us at legal@crowdpnl.com or by mail at 43 King Street West, Toronto, ON, Canada.' },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/15 via-[#0a0e1a] to-[#0a0e1a]" />
        <div className="relative z-10 container mx-auto px-6 pt-40 pb-16 max-w-3xl">
          <RevealSection variant="up">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-6 bg-violet-500" />
              <span className="text-xs font-bold tracking-[0.25em] text-violet-400 uppercase">Legal</span>
            </div>
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-violet-400/10 border border-violet-400/20 flex items-center justify-center shrink-0 mt-1">
                <FileText className="w-7 h-7 text-violet-400" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight text-white mb-2">Terms of Service</h1>
                <p className="text-white/30 text-sm">Effective date: January 1, 2025 · Last updated: January 1, 2025</p>
              </div>
            </div>
            <p className="text-white/45 text-base leading-relaxed mt-6">
              Please read these terms carefully before using CrowdPnL. By using our platform, you agree to be bound by these terms.
            </p>
          </RevealSection>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <RevealSection variant="up">
          <div className="space-y-0">
            {sections.map(({ title, content }, i) => (
              <div key={title} className={`py-8 ${i < sections.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
                <h2 className="text-white font-bold text-base mb-3">{title}</h2>
                <p className="text-white/40 text-sm leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Contact box */}
        <RevealSection variant="up">
          <div className="mt-12 p-6 rounded-2xl border border-violet-400/20 bg-violet-400/5">
            <p className="text-white font-semibold text-sm mb-1">Questions about these terms?</p>
            <p className="text-white/40 text-sm">
              Contact us at{' '}
              <a href="mailto:legal@crowdpnl.com" className="text-violet-400 hover:text-violet-300 transition-colors">legal@crowdpnl.com</a>
            </p>
          </div>
        </RevealSection>
      </div>
      <Footer />
    </div>
  );
}
