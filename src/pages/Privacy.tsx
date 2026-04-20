import Header from '@/components/Header';
import Footer from '@/components/Footer';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us when you create an account, such as your name and email address. We also collect usage data including pages visited, features used, and interactions with the platform. We do not collect financial account information or trading credentials.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to provide, maintain, and improve our services; send you technical notices and support messages; respond to your comments and questions; and send you information about new strategies, features, and promotions (you may opt out at any time).`,
  },
  {
    title: '3. Information Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our platform, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.`,
  },
  {
    title: '4. Data Security',
    content: `We implement industry-standard security measures to protect your personal information. All data is encrypted in transit using TLS and at rest. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: '5. Cookies',
    content: `We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept cookies, some portions of our platform may not function properly.`,
  },
  {
    title: '6. Third-Party Services',
    content: `Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of those sites. We encourage you to review the privacy policies of any third-party sites you visit.`,
  },
  {
    title: '7. Children\'s Privacy',
    content: `Our platform is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date. Your continued use of the platform after any changes constitutes your acceptance of the new policy.`,
  },
  {
    title: '9. Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at privacy@crowdpnl.com or by mail at 43 King Street West, Toronto, ON, Canada.`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">

        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-6 bg-emerald-500" />
          <span className="text-xs font-bold tracking-[0.25em] text-emerald-500 uppercase">Legal</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white mb-3">Privacy Policy</h1>
        <p className="text-white/30 text-sm mb-14">Effective date: January 1, 2025</p>

        <div className="space-y-8">
          {sections.map(({ title, content }) => (
            <div key={title} className="border-b border-white/[0.06] pb-8 last:border-0">
              <h2 className="text-white font-bold text-base mb-3">{title}</h2>
              <p className="text-white/45 text-sm leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
