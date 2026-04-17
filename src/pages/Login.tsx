import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('subscription', JSON.stringify({
          plan: 'free', active: true, isTrial: false,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        }));
        toast({ title: 'Welcome back!', description: 'Logged in successfully' });
        navigate('/dashboard');
      } else {
        toast({ title: 'Login failed', description: data.error || 'Invalid credentials', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to connect to server', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=90"
          alt="Trading" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#0a0e1a]/90" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo height={44} />
          </Link>
          <div>
            <span className="text-5xl font-black text-white leading-tight mb-5 block">
              Trade smarter.<br /><span className="text-violet-400">Not harder.</span>
            </span>
            <p className="text-white/60 text-lg max-w-sm leading-relaxed mt-4">
              Access 12 professional strategies free. Premium members get new strategies daily.
            </p>
            <div className="flex gap-10 mt-10">
              {[
                { icon: TrendingUp, label: 'Free Strategies', value: '12' },
                { icon: Zap,        label: 'Best Win Rate',   value: '71%' },
                { icon: ShieldCheck,label: 'Backtested',      value: '100%' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <div className="flex items-center gap-1.5 text-violet-400 mb-1">
                    <Icon className="w-5 h-5" />
                    <span className="text-3xl font-black text-white">{value}</span>
                  </div>
                  <p className="text-white/40 text-sm tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-white/10 rounded-2xl p-5 bg-white/5 backdrop-blur-sm">
            <p className="text-white/70 text-sm leading-relaxed italic">
              "CrowdPnL completely changed how I approach the markets. The backtested data gives me real confidence."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">JM</div>
              <div>
                <p className="text-white text-xs font-semibold">James M.</p>
                <p className="text-white/40 text-xs">Forex Trader · 3 years</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0a0e1a] px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <Logo height={40} />
          </Link>

          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Welcome back</h1>
          <p className="text-white/40 text-sm mb-8">Sign in to access your strategies</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-emerald-500/60 transition-all" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-white/20 text-sm focus:outline-none focus:border-emerald-500/60 transition-all" />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
