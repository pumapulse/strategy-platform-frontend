import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
<<<<<<< HEAD
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
=======
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
  const [showPass, setShowPass] = useState(false);
=======
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
<<<<<<< HEAD
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
=======

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/login`, {
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
<<<<<<< HEAD
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Auto-assign free plan so user goes straight to dashboard
        localStorage.setItem('subscription', JSON.stringify({
          plan: 'free',
          active: true,
          isTrial: false,
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
=======

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast({
          title: 'Success!',
          description: 'Logged in successfully',
        });
        
        // Check if user has active subscription
        const subscription = localStorage.getItem('subscription');
        if (subscription) {
          const sub = JSON.parse(subscription);
          const endDate = new Date(sub.endDate);
          if (new Date() <= endDate && sub.active) {
            navigate('/dashboard');
          } else {
            // Expired subscription - create new free trial
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 30);
            
            const newSubscription = {
              active: true,
              isTrial: true,
              startDate: new Date().toISOString(),
              endDate: trialEndDate.toISOString(),
              plan: 'Free Trial'
            };
            
            localStorage.setItem('subscription', JSON.stringify(newSubscription));
            navigate('/dashboard');
          }
        } else {
          // No subscription - create free trial automatically
          const trialEndDate = new Date();
          trialEndDate.setDate(trialEndDate.getDate() + 30);
          
          const newSubscription = {
            active: true,
            isTrial: true,
            startDate: new Date().toISOString(),
            endDate: trialEndDate.toISOString(),
            plan: 'Free Trial'
          };
          
          localStorage.setItem('subscription', JSON.stringify(newSubscription));
          navigate('/dashboard');
        }
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Login failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to server',
        variant: 'destructive',
      });
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex">

      {/* Left — background image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=90"
          alt="People celebrating success"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#0a0e1a]/90" />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <svg width="22" height="30" viewBox="0 0 24 32" fill="none">
              <defs>
                <linearGradient id="eth-top-l" x1="0" y1="0" x2="24" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a78bfa"/><stop offset="1" stopColor="#6366f1"/>
                </linearGradient>
                <linearGradient id="eth-bot-l" x1="0" y1="16" x2="24" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8"/><stop offset="1" stopColor="#4f46e5"/>
                </linearGradient>
              </defs>
              <polygon points="12,1 23,13 12,17 1,13" fill="url(#eth-top-l)" opacity="0.95"/>
              <polygon points="12,31 23,18 12,22 1,18" fill="url(#eth-bot-l)" opacity="0.85"/>
              <polygon points="12,17 23,13 12,22 1,13" fill="white" opacity="0.12"/>
            </svg>
            <span className="text-white text-[17px] font-bold tracking-tight">
              Tradex<span className="text-violet-400">Strategies</span>
            </span>
          </Link>

          {/* Center quote */}
          <div>
            <span className="text-5xl font-black text-white leading-tight mb-5 block">
              Trade smarter.<br />
              <span className="text-violet-400">Not harder.</span>
            </span>
            <p className="text-white/60 text-lg max-w-sm leading-relaxed mt-4">
              Access 730+ backtested strategies trusted by thousands of traders worldwide.
            </p>

            {/* Stats row */}
            <div className="flex gap-10 mt-10">
              {[
                { icon: TrendingUp, label: 'Avg. Win Rate', value: '68%' },
                { icon: Zap,        label: 'Strategies',   value: '730+' },
                { icon: ShieldCheck,label: 'Backtested',   value: '100%' },
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

          {/* Bottom testimonial */}
          <div className="border border-white/10 rounded-2xl p-5 bg-white/5 backdrop-blur-sm">
            <p className="text-white/70 text-sm leading-relaxed italic">
              "TradexStrategies completely changed how I approach the markets. The backtested data gives me real confidence."
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

      {/* Right — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0a0e1a] px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <svg width="20" height="26" viewBox="0 0 24 32" fill="none">
              <defs>
                <linearGradient id="eth-top-m" x1="0" y1="0" x2="24" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a78bfa"/><stop offset="1" stopColor="#6366f1"/>
                </linearGradient>
                <linearGradient id="eth-bot-m" x1="0" y1="16" x2="24" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8"/><stop offset="1" stopColor="#4f46e5"/>
                </linearGradient>
              </defs>
              <polygon points="12,1 23,13 12,17 1,13" fill="url(#eth-top-m)" opacity="0.95"/>
              <polygon points="12,31 23,18 12,22 1,18" fill="url(#eth-bot-m)" opacity="0.85"/>
              <polygon points="12,17 23,13 12,22 1,13" fill="white" opacity="0.12"/>
            </svg>
            <span className="text-white text-[16px] font-bold">Tradex<span className="text-violet-400">Strategies</span></span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Welcome back</h1>
          <p className="text-white/40 text-sm mb-8">Sign in to access your strategies</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-emerald-500/60 focus:bg-white/8 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-white/20 text-sm focus:outline-none focus:border-emerald-500/60 focus:bg-white/8 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/20 text-xs">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <p className="text-center text-white/30 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
=======
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
>>>>>>> 1f5628b314e16b48d2341fe649cfad7b8eff92a9
    </div>
  );
}
