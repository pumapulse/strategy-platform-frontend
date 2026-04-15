import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, TrendingUp, ShieldCheck, Zap, Mail, ArrowLeft } from 'lucide-react';
import Turnstile from '@/components/Turnstile';
import { signInWithGoogle } from '@/lib/supabase';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [pendingEmail, setPendingEmail] = useState('');
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      toast({ title: 'Human check required', description: 'Please complete the verification', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.requiresVerification) {
        setPendingEmail(email);
        setStep('verify');
        toast({ title: 'Check your inbox!', description: `Verification code sent to ${email}` });
      } else if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('subscription', JSON.stringify({
          plan: 'free', active: true, isTrial: false,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        }));
        navigate('/dashboard');
      } else {
        toast({ title: 'Error', description: data.error || 'Signup failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to connect to server', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    try {
      const res = await fetch(`${API}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, code }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('subscription', JSON.stringify({
          plan: 'free', active: true, isTrial: false,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        }));
        toast({ title: 'Email verified!', description: 'Welcome to CrowdPnl' });
        navigate('/dashboard');
      } else {
        toast({ title: 'Invalid code', description: data.error || 'Please check the code and try again', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to verify', variant: 'destructive' });
    } finally {
      setVerifying(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      toast({ title: 'Google sign-in failed', description: err.message, variant: 'destructive' });
      setGoogleLoading(false);
    }
  };

  const LeftPanel = () => (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=90"
        alt="Trading" className="absolute inset-0 w-full h-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#0a0e1a]/90" />
      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
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
          <span className="text-white text-[17px] font-bold tracking-tight">Crowd<span className="text-violet-400">Pnl</span></span>
        </Link>
        <div>
          <span className="text-5xl font-black text-white leading-tight mb-5 block">
            Join thousands<br /><span className="text-violet-400">of traders.</span>
          </span>
          <p className="text-white/60 text-lg max-w-sm leading-relaxed mt-4">
            Access 730+ backtested strategies trusted by traders worldwide.
          </p>
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
        <div className="border border-white/10 rounded-2xl p-5 bg-white/5 backdrop-blur-sm">
          <p className="text-white/70 text-sm leading-relaxed italic">
            "I signed up and within a week I had my first profitable trade using one of their crypto strategies."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">SK</div>
            <div>
              <p className="text-white text-xs font-semibold">Sarah K.</p>
              <p className="text-white/40 text-xs">Crypto Trader · 1 year</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0a0e1a] px-6 py-12">
        <div className="w-full max-w-md">

          {/* ── Verification step ── */}
          {step === 'verify' ? (
            <div>
              <button onClick={() => setStep('form')} className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />Back
              </button>

              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-violet-400" />
              </div>

              <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Check your email</h1>
              <p className="text-white/40 text-sm mb-2">We sent a 6-digit code to</p>
              <p className="text-violet-400 font-semibold text-sm mb-8">{pendingEmail}</p>

              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 text-2xl font-black tracking-[0.5em] text-center focus:outline-none focus:border-violet-500/60 transition-all"
                  />
                  <p className="text-xs text-white/25 mt-1.5 text-center">Code expires in 10 minutes</p>
                </div>
                <button type="submit" disabled={verifying || code.length !== 6}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {verifying ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>

              <p className="text-center text-white/30 text-sm mt-6">
                Didn't receive it?{' '}
                <button onClick={() => setStep('form')} className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                  Try again
                </button>
              </p>
            </div>

          ) : (
            /* ── Signup form ── */
            <div>
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
                <span className="text-white text-[16px] font-bold">Crowd<span className="text-violet-400">Pnl</span></span>
              </Link>

              <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Create account</h1>
              <p className="text-white/40 text-sm mb-8">Start your free trial — no credit card required</p>

              <button onClick={handleGoogle} disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white hover:bg-white/90 text-gray-800 font-semibold text-sm transition-all mb-5 disabled:opacity-60">
                {googleLoading
                  ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  : <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>}
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-white/20 text-xs">or sign up with email</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" required minLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-white/25 mt-1.5">Must be at least 6 characters</p>
                </div>
                <Turnstile onVerify={setCaptchaToken} onExpire={() => setCaptchaToken('')} />
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Sending code...' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-white/30 text-sm mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Sign in</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
