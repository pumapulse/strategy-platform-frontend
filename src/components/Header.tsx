import { Crown, Sparkles, Bell } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkSubscription } from "@/lib/metamask";

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/strategies', label: 'Strategies' },
  { to: '/subscription', label: 'Subscription' },
  { to: '/community', label: 'Community' },
  { to: '/profile', label: 'Profile' },
];

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const load = () => {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
      setSubscription(checkSubscription());
    };
    load();
    window.addEventListener('user-updated', load);
    return () => window.removeEventListener('user-updated', load);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = !scrolled;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
      }`}
    >
      <div className="container mx-auto pl-4 pr-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="eth-top" x1="0" y1="0" x2="24" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a78bfa"/>
                <stop offset="1" stopColor="#6366f1"/>
              </linearGradient>
              <linearGradient id="eth-bot" x1="0" y1="16" x2="24" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8"/>
                <stop offset="1" stopColor="#4f46e5"/>
              </linearGradient>
            </defs>
            <polygon points="12,1 23,13 12,17 1,13" fill="url(#eth-top)" opacity="0.95"/>
            <polygon points="12,31 23,18 12,22 1,18" fill="url(#eth-bot)" opacity="0.85"/>
            <polygon points="12,17 23,13 12,22 1,13" fill="white" opacity="0.12"/>
          </svg>
          <span className={`text-[19px] font-bold tracking-[-0.01em] whitespace-nowrap leading-none select-none ${transparent ? 'text-white' : 'text-foreground'}`}>
            Tradex<span className={transparent ? 'text-[#a78bfa]' : 'text-violet-400'}>Strategies</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  active
                    ? transparent
                      ? 'bg-white/15 text-white'
                      : 'bg-foreground/8 text-foreground'
                    : transparent
                      ? 'text-white/70 hover:text-white hover:bg-white/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Bell icon */}
              <button className={`relative p-2 rounded-full transition-all ${transparent ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'}`}>
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-400" />
              </button>
              {subscription?.active && !subscription?.expired && (
                <Link to="/subscription">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    subscription.isTrial
                      ? transparent ? 'bg-white/10 text-white/80' : 'bg-blue-500/10 text-blue-500'
                      : transparent ? 'bg-white/10 text-white/80' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {subscription.isTrial
                      ? <><Sparkles className="w-3 h-3" />Free Trial</>
                      : <><Crown className="w-3 h-3" />Premium</>}
                  </span>
                </Link>
              )}

              <div className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full text-sm transition-colors ${
                transparent ? 'text-white/80' : 'text-foreground'
              }`}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-white/20" />
                ) : (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    transparent ? 'bg-white/20 text-white' : 'bg-primary/15 text-primary'
                  }`}>
                    {user.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                )}
                <span className="font-medium">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  transparent
                    ? 'border-white/25 text-white hover:bg-white/10'
                    : 'border-border text-foreground hover:bg-foreground/5'
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-foreground hover:bg-foreground/5'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  transparent
                    ? 'bg-white text-slate-900 hover:bg-white/90'
                    : 'bg-foreground text-background hover:opacity-80'
                }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
