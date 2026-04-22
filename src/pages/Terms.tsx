import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealSection from '@/components/RevealSection';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CreditCard, Shield, Scale } from 'lucide-react';

const highlights = [
  { icon: Shield, label: 'Not Financial Advice', sub: 'Educational purposes only' },
  { icon: CreditCard, label: 'Cancel Anytime', sub: 'No lock-in contracts' },
  { icon: AlertTriangle, label: 'Trading Risk', sub: 'Capital at risk' },
  { icon: Scale, label: 'Ontario Law', sub: 'Toronto jurisdiction' },
];

const sections = [
  { title: 'Acceptance of Terms', content: 'By accessing or using the CrowdPnL platform, website, mobile application, or any related services (collectively, the "Platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree to these terms, please do not use our Platform. These terms constitute a legally binding agreement between you and CrowdPnL Inc. We reserve the right to update these terms at any time with reasonable notice, and your continued use of the Platform after any changes constitutes acceptance of the revised terms.' },
  { title: 'Description of Service', content: 'CrowdPnL provides a platform for accessing, reviewing, discussing, and downloading systematic trading strategies for cryptocurrency markets. Our services include: a library of backtested trading strategies with performance data; a community forum for traders to share insights and discuss strategies; premium subscription tiers with additional strategies and features; a desktop application for strategy execution and monitoring; and real-time market data and signal feeds. All strategies and content are provided for educational and informational purposes only.' },
  { title: 'Not Financial Advice', content: 'IMPORTANT: The content on CrowdPnL, including all strategies, signals, backtests, performance metrics, community discussions, and any other information, is for informational and educational purposes only and does not constitute financial advice, investment advice, trading recommendations, or any other type of professional advice. CrowdPnL is not a registered investment advisor, broker-dealer, or financial institution. You should consult a qualified financial advisor before making any investment decisions. Trading cryptocurrencies involves significant risk of loss, including the possible loss of all invested capital. Past performance of any strategy does not guarantee future results.' },
  { title: 'User Accounts', content: "To access certain features of the Platform, you must create an account. You are responsible for: maintaining the confidentiality of your account credentials; all activities that occur under your account; ensuring your account information is accurate and up to date; and notifying us immediately of any unauthorized use of your account at security@crowdpnl.com. You must be at least 18 years of age to create an account. You may not create multiple accounts, share your account with others, or use another person's account. We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a security risk." },
  { title: 'Subscription and Payments', content: 'CrowdPnL offers Free, Premium, and Elite subscription tiers. Premium and Elite subscriptions are billed on a recurring monthly or annual basis via Stripe. By subscribing, you authorize us to charge your payment method on a recurring basis. You may cancel your subscription at any time through your account settings or by contacting support@crowdpnl.com. Cancellations take effect at the end of the current billing period, and you will retain access to premium features until that date. We do not provide refunds for partial billing periods or unused time. Prices are subject to change with 30 days written notice.' },
  { title: 'Intellectual Property', content: 'All content on the CrowdPnL Platform, including but not limited to strategy descriptions, algorithms, source code, documentation, logos, design elements, graphics, and user interface, is the intellectual property of CrowdPnL Inc. or its licensors and is protected by applicable copyright, trademark, patent, and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to access and use the Platform for your personal, non-commercial use. You may not reproduce, distribute, modify, create derivative works, publicly display, publicly perform, republish, download, store, or transmit any content from our Platform without our express written permission.' },
  { title: 'Script Downloads & Usage', content: 'Premium and Elite subscribers may download trading scripts and automation tools provided by CrowdPnL. These scripts are licensed for personal use only and may not be resold, redistributed, or shared with third parties. You are solely responsible for how you use these scripts, including any trades executed, losses incurred, or technical issues arising from their use. CrowdPnL makes no warranty that scripts will perform as expected in live trading environments. Always test scripts in a paper trading environment before deploying with real capital.' },
  { title: 'User Content', content: 'By posting content in our community forums, discussions, or any other area of the Platform, you grant CrowdPnL a non-exclusive, royalty-free, worldwide, perpetual license to use, display, reproduce, modify, and distribute that content on our Platform and in our marketing materials. You represent and warrant that: you own or have the necessary rights to post the content; the content does not violate any third-party rights; and the content complies with these Terms. You are solely responsible for the content you post. We reserve the right to remove any content that violates these Terms or that we deem inappropriate, without notice.' },
  { title: 'Limitation of Liability', content: 'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CrowdPnL Inc. and its officers, directors, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including but not limited to: loss of profits or revenue; loss of data; trading losses or investment losses; business interruption; or any other commercial damages or losses, arising out of or in connection with your use of the Platform, any trading decisions made based on content found on the Platform, or any unauthorized access to your account. Our total aggregate liability to you for any claims arising under these Terms shall not exceed the greater of $100 USD or the amount you paid us in the 3 months preceding the claim.' },
  { title: 'Prohibited Activities', content: 'You agree not to engage in any of the following prohibited activities: using the Platform for any unlawful purpose or in violation of any applicable regulations; attempting to gain unauthorized access to any part of the Platform, its servers, or any connected systems; scraping, harvesting, or systematically collecting data from the Platform without prior written permission; impersonating any person or entity, or falsely claiming an affiliation with any person or entity; posting spam, unsolicited commercial messages, or malicious content; interfering with or disrupting the integrity or performance of the Platform; using automated tools, bots, or scripts to access the Platform in a manner that places excessive load on our servers; or attempting to reverse engineer, decompile, or disassemble any part of the Platform.' },
  { title: 'Disclaimers', content: 'THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not warrant that: the Platform will be uninterrupted or error-free; any defects will be corrected; the Platform is free of viruses or other harmful components; or the results obtained from using the Platform will be accurate or reliable. Market data, strategy performance data, and signals are provided for informational purposes only and may not be accurate, complete, or timely.' },
  { title: 'Governing Law & Dispute Resolution', content: 'These Terms of Service shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions. Any disputes arising under or in connection with these terms shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved exclusively through binding arbitration in Toronto, Ontario, under the rules of the ADR Institute of Canada. You consent to the personal jurisdiction of the courts of Toronto, Ontario for any matters not subject to arbitration. You waive any right to participate in class action lawsuits against CrowdPnL.' },
  { title: 'Contact', content: 'For questions about these Terms of Service, please contact our legal team at legal@crowdpnl.com. For general support, contact support@crowdpnl.com. For security concerns, contact security@crowdpnl.com. By mail: CrowdPnL Inc., 43 King Street West, Toronto, ON, Canada. We aim to respond to all legal inquiries within 5 business days.' },
];

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-end border-b border-white/[0.06]">
        <div className="absolute inset-0">
          <img src="/img/security/Annotation 2026-04-04 221150.jpg" alt="Terms" className="w-full h-full object-cover opacity-[0.15]" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a14]/70 via-[#0a0e1a]/85 to-[#0a0e1a]" />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 w-full container mx-auto px-6 pt-36 pb-0 max-w-6xl">
          <RevealSection variant="up">
            <div className="flex items-center gap-3 mb-6"><div className="h-px w-8 bg-emerald-500" /><span className="text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">Legal</span></div>
            <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-[1.0] mb-4">
              <span className="text-white">Terms of</span><br />
              <span className="bg-gradient-to-r from-[#9966ff] to-[#cc99ff] bg-clip-text text-transparent">Service.</span>
            </h1>
            <p className="text-white/30 text-sm mb-4">Effective: January 1, 2025 &middot; Last updated: January 1, 2025</p>
            <p className="text-white/50 text-base leading-relaxed max-w-2xl mb-10">Please read these terms carefully before using CrowdPnL. By using our platform, you agree to be bound by these terms and our Privacy Policy.</p>
            {/* Flat highlight row */}
            <div className="flex flex-col sm:flex-row border-t border-white/[0.07]">
              {highlights.map(({ icon: Icon, label, sub }, i) => (
                <div key={label} className={`flex items-center gap-4 py-5 flex-1 ${i < highlights.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-white/[0.07]' : ''} ${i > 0 ? 'sm:pl-8' : ''}`}>
                  <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{label}</p>
                    <p className="text-white/35 text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0 border border-white/[0.08]">
          {/* Sidebar */}
          <div className="border-r border-white/[0.08]">
            <div className="sticky top-24">
              <img src="/img/security/Annotation 2026-04-04 221316.jpg" alt="Terms" className="w-full h-44 object-cover opacity-75" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="p-6 bg-[#060a14]">
                <p className="text-[10px] font-black text-white/35 uppercase tracking-[0.2em] mb-4">Table of Contents</p>
                {sections.map(({ title }, i) => (
                  <div key={title} className="flex items-start gap-3 py-3 border-b border-white/[0.05] last:border-0">
                    <span className="text-[10px] font-black text-white/20 mt-0.5 shrink-0 tabular-nums w-5">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-xs text-white/45 hover:text-white/80 transition-colors cursor-default leading-snug">{title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Main */}
          <div>
            {sections.map(({ title, content }, i) => (
              <div key={title} className={`px-10 py-9 ${i < sections.length - 1 ? 'border-b border-white/[0.07]' : ''} ${i % 2 === 0 ? 'bg-transparent' : 'bg-[#0f1420]/50'}`}>
                <h2 className="text-white font-black text-base mb-3 flex items-center gap-3">
                  <span className="text-[10px] font-black text-white/20 tabular-nums w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  {title}
                </h2>
                <p className="text-white/45 text-sm leading-[1.95] pl-8">{content}</p>
              </div>
            ))}
            <div className="px-10 py-6 border-t border-white/[0.08] bg-[#060a14] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-white/25">Last updated: January 1, 2025</p>
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/privacy')} className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy Policy &rarr;</button>
                <button onClick={() => navigate('/contact')} className="text-xs text-white/30 hover:text-white/60 transition-colors">Contact Us &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
