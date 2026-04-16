import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#080c18] border-t border-white/[0.06] text-white font-sans">
      <div className="w-full px-6 md:px-16 xl:px-24 pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-14">

          {/* Brand col */}
          <div className="lg:col-span-1 lg:pr-6 max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="CrowdPnL" className="h-20 w-auto" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              A product by <a href="https://crowdpnl.com" target="_blank" rel="noopener noreferrer"
                className="text-white hover:text-white/70 transition-colors font-medium">CrowdPnL</a>.
              We deliver backtested trading strategies daily — built for crypto, forex, and equity traders who want a real edge.
            </p>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-5">Company</p>
            <ul className="space-y-3">
              {[
                { label: 'About Us',         href: 'https://crowdpnl.com/about/' },
                { label: 'Contact Us',       href: 'https://crowdpnl.com/contact/' },
                { label: 'Careers',          href: 'https://crowdpnl.com/careers/' },
                { label: 'Blog',             href: 'https://crowdpnl.com/blog/' },
                { label: 'Privacy Policy',   href: 'https://crowdpnl.com/privacy/' },
                { label: 'Terms of Service', href: 'https://crowdpnl.com/terms/' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-sm text-white/40 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-5">Platform</p>
            <ul className="space-y-3">
              {[
                { label: 'Strategies',    href: '/strategies' },
                { label: 'Dashboard',     href: '/dashboard' },
                { label: 'Community',     href: '/community' },
                { label: 'Premium Plans', href: '/subscription' },
                { label: 'Desktop App',   href: '/dashboard' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-sm text-white/40 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:pl-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-5">Get In Touch</p>
            <ul className="space-y-4">
              <li>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Business Inquiries</p>
                <a href="mailto:sales@crowdpnl.com" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5 shrink-0" />sales@crowdpnl.com
                </a>
              </li>
              <li>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Jobs</p>
                <a href="mailto:hr@crowdpnl.com" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5 shrink-0" />hr@crowdpnl.com
                </a>
              </li>
              <li>
                <a href="tel:+16815534010" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5 shrink-0" />+1 (681) 553-4010
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-white/40">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>43 King Street West,<br />Toronto, ON, Canada</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] mb-8" />

        {/* Bottom bar */}
        <div className="flex items-center justify-center">
          <p className="text-xs text-white/25 text-center">
            © 2025 CrowdPnL. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
