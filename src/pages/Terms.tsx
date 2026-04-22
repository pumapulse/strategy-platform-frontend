import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, AlertTriangle, CreditCard, Shield, Users, Ban, Scale, Mail } from 'lucide-react';

const highlights = [
  { icon: Shield, label: 'Not Financial Advice', sub: 'Educational purposes only' },
  { icon: CreditCard, label: 'Cancel Anytime', sub: 'No lock-in contracts' },
  { icon: AlertTriangle, label: 'Trading Risk', sub: 'Capital at risk' },
  { icon: Scale, label: 'Ontario Law', sub: 'Toronto jurisdiction' },
];

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using the CrowdPnL platform, website, mobile application, or any related services (collectively, the "Platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree to these terms, please do not use our Platform. These terms constitute a legally binding agreement between you and CrowdPnL Inc. We reserve the right to update these terms at any time with reasonable notice, and your continued use of the Platform after any changes constitutes acceptance of the revised terms.',
  },
  {
    title: '2. Description of Service',
    content: 'CrowdPnL provides a platform for accessing, reviewing, discussing, and downloading systematic trading strategies for cryptocurrency markets. Our services include: a library of backtested trading strategies with performance data; a community forum for traders to share insights and discuss strategies; premium subscription tiers with additional strategies and features; a desktop application for strategy execution and monitoring; and real-time market data and signal feeds. All strategies and content are provided for educational and informational purposes only.',
  },
  {
    title: '3. Not Financial Advice',
    content: 'IMPORTANT: The content on CrowdPnL, including all strategies, signals, backtests, performance metrics, community discussions, and any other information, is for informational and educational purposes only and does not constitute financial advice, investment advice, trading recommendations, or any other type of professional advice. CrowdPnL is not a registered investment advisor, broker-dealer, or financial institution. You should consult a qualified financial advisor before making any investment decisions. Trading cryptocurrencies involves significant risk of loss, including the possible loss of all invested capital. Past performance of any strategy does not guarantee future results.',
  },
  {
    title: '4. User Accounts',
    content: 'To access certain features of the Platform, you must create an account. You are responsible for: maintaining the confidentiality of your account credentials; all activities that occur under your account; ensuring your account information is accurate and up to date; and notifying us immediately of any unauthorized use of your account at security@crowdpnl.com. You must be at least 18 years of age to create an account. You may not create multiple accounts, share your account with others, or use another person\'s account. We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a security risk.',
  },
  {
    title: '5. Subscription and Payments',
    content: 'CrowdPnL offers Free, Premium, and Elite subscription tiers. Premium and Elite subscriptions are billed on a recurring monthly or annual basis via Stripe. By subscribing, you authorize us to charge your payment method on a recurring basis. You may cancel your subscription at any time through your account settings or by contacting support@crowdpnl.com. Cancellations take effect at the end of the current billing period, and you will retain access to premium features until that date. We do not provide refunds for partial billing periods or unused time. Prices are subject to change with 30 days written notice. If your payment fails, we will attempt to retry the charge and may suspend your account if payment cannot be collected.',
  },
  {
    title: '6. Intellectual Property',
    content: 'All content on the CrowdPnL Platform, including but not limited to strategy descriptions, algorithms, source code, documentation, logos, design elements, graphics, and user interface, is the intellectual property of CrowdPnL Inc. or its licensors and is protected by applicable copyright, trademark, patent, and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to access and use the Platform for your personal, non-commercial use. You may not reproduce, distribute, modify, create derivative works, publicly display, publicly perform, republish, download, store, or transmit any content from our Platform without our express written permission.',
  },
  {
    title: '7. Script Downloads & Usage',
    content: 'Premium and Elite subscribers may download trading scripts and automation tools provided by CrowdPnL. These scripts are licensed for personal use only and may not be resold, redistributed, or shared with third parties. You are solely responsible for how you use these scripts, including any trades executed, losses incurred, or technical issues arising from their use. CrowdPnL makes no warranty that scripts will perform as expected in live trading environments. Always test scripts in a paper trading environment before deploying with real capital.',
  },
  {
    title: '8. User Content',
    content: 'By posting content in our community forums, discussions, or any other area of the Platform, you grant CrowdPnL a non-exclusive, royalty-free, worldwide, perpetual license to use, display, reproduce, modify, and distribute that content on our Platform and in our marketing materials. You represent and warrant that: you own or have the necessary rights to post the content; the content does not violate any third-party rights; and the content complies with these Terms. You are solely responsible for the content you post. We reserve the right to remove any content that violates these Terms or that we deem inappropriate, without notice.',
  },
  {
    title: '9. Limitation of Liability',
    content: 'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CrowdPnL Inc. and its officers, directors, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including but not limited to: loss of profits or revenue; loss of data; trading losses or investment losses; business interruption; or any other commercial damages or losses, arising out of or in connection with your use of the Platform, any trading decisions made based on content found on the Platform, or any unauthorized access to your account. Our total aggregate liability to you for any claims arising under these Terms shall not exceed the greater of $100 USD or the amount you paid us in the 3 months preceding the claim.',
  },
  {
    title: '10. Prohibited Activities',
    content: 'You agree not to engage in any of the following prohibited activities: using the Platform for any unlawful purpose or in violation of any applicable regulations; attempting to gain unauthorized access to any part of the Platform, its servers, or any connected systems; scraping, harvesting, or systematically collecting data from the Platform without prior written permission; impersonating any person or entity, or falsely claiming an affiliation with any person or entity; posting spam, unsolicited commercial messages, or malicious content; interfering with or disrupting the integrity or performance of the Platform; using automated tools, bots, or scripts to access the Platform in a manner that places excessive load on our servers; or attempting to reverse engineer, decompile, or disassemble any part of the Platform.',
  },
  {
    title: '11. Disclaimers',
    content: 'THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not warrant that: the Platform will be uninterrupted or error-free; any defects will be corrected; the Platform is free of viruses or other harmful components; or the results obtained from using the Platform will be accurate or reliable. Market data, strategy performance data, and signals are provided for informational purposes only and may not be accurate, complete, or timely.',
  },
  {
    title: '12. Governing Law & Dispute Resolution',
    content: 'These Terms of Service shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions. Any disputes arising under or in connection with these terms shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved exclusively through binding arbitration in Toronto, Ontario, under the rules of the ADR Institute of Canada. You consent to the personal jurisdiction of the courts of Toronto, Ontario for any matters not subject to arbitration. You waive any right to participate in class action lawsuits against CrowdPnL.',
  },
  {
    title: '13. Contact',
    content: 'For questions about these Terms of Service, please contact our legal team at legal@crowdpnl.com. For general support, contact support@crowdpnl.com. For security concerns, contact security@crowdpnl.com. By mail: CrowdPnL Inc., 43 King Street West, Toronto, ON, Canada. We aim to respond to all legal inquiries within 5 business days.',
  },
];

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[55vh] flex items-center border-b border-white/[0.06]">
        <div className="absolute inset-0">
          <img src="/img/security/Annotation 2026-04-04 221150.jpg" alt="Security" className="w-full h-full object-cover opacity-[0.15]" />
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
                    <FileText className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white mb-2">Terms of Service</h1>
                    <p className="text-white/30 text-sm">Effective: January 1, 2025 &middot; Last updated: January 1, 2025</p>
                  </div>
                </div>
                <p className="text-white/50 text-base leading-relaxed">Please read these terms carefully before using CrowdPnL. By using our platform, you agree to be bound by these terms and our Privacy Policy.</p>
              </div>
              {/* Key highlights */}
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
                <img src="/img/security/Annotation 2026-04-04 221316.jpg" alt="Security" className="w-full h-36 object-cover opacity-70" />
              </div>
              <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Quick Nav</p>
                <div className="space-y-1.5">
                  {sections.slice(0, 7).map(({ title }) => (
                    <p key={title} className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-default leading-relaxed">{title}</p>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <p className="text-xs font-bold text-amber-400">Risk Warning</p>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">Trading crypto involves significant risk. Never invest more than you can afford to lose.</p>
              </div>
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04]">
                <p className="text-xs font-bold text-emerald-400 mb-2">Legal Questions?</p>
                <a href="mailto:legal@crowdpnl.com" className="text-xs text-white/50 hover:text-emerald-400 transition-colors">legal@crowdpnl.com</a>
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
                    <Mail className="w-5 h-5 text-emerald-400" />
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
        </div>
      </div>

      <Footer />
    </div>
  );
}

