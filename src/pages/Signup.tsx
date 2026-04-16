import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, TrendingUp, ShieldCheck, Zap, Mail, ArrowLeft, Clock } from 'lucide-react';
import Turnstile from '@/components/Turnstile';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [pendingEmail, setPendingEmail] = useState('');
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 min
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  // Start countdown when verify step begins
  useEffect(() => {
    if (step === 'verify') {
      setSecondsLeft(600);
      timerRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const validateEmail = (val: string) => {
    const re = /^[^\s@]{3,}@[^\s@]+\.[^\s@]{2,}$/;
    const valid = val && re.test(val) && !val.includes('..') && !val.split('@')[0].startsWith('.') && !val.split('@')[0].endsWith('.');
    if (!valid) { setEmailError('Invalid email address'); return false; }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', description: 'Please make sure both passwords are the same', variant: 'destructive' });
      return;
    }
    if (!captchaToken) {
      toast({ title: 'Human check required', description: 'Please complete the verification below', variant: 'destructive' });
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
        toast({ title: 'Email verified!', description: 'Welcome to CrowdPnL' });
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

  const Logo = () => (
    <img src="/logo.png" alt="CrowdPnL" style={{ height: '52px', width: 'auto' }} />
  );

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=90"
          alt="Trading" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#0a0e1a]/90" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
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

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0a0e1a] px-6 py-12">
        <div className="w-full max-w-md">

          {/* ── Verify step ── */}
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
                    disabled={secondsLeft === 0}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 text-2xl font-black tracking-[0.5em] text-center focus:outline-none focus:border-violet-500/60 transition-all disabled:opacity-40"
                  />
                  {/* Countdown */}
                  <div className={`flex items-center justify-center gap-2 mt-3 px-4 py-2.5 rounded-xl border ${
                    secondsLeft === 0
                      ? 'border-red-500/30 bg-red-500/[0.07]'
                      : secondsLeft < 60
                      ? 'border-amber-500/30 bg-amber-500/[0.07]'
                      : 'border-white/[0.07] bg-white/[0.03]'
                  }`}>
                    <Clock className={`w-3.5 h-3.5 ${secondsLeft === 0 ? 'text-red-400' : secondsLeft < 60 ? 'text-amber-400' : 'text-white/40'}`} />
                    {secondsLeft > 0 ? (
                      <span className={`text-sm font-semibold ${secondsLeft < 60 ? 'text-amber-400' : 'text-white/50'}`}>
                        This code will expire after{' '}
                        <span className={`font-black tabular-nums ${secondsLeft < 60 ? 'text-amber-300' : 'text-white'}`}>
                          {formatTime(secondsLeft)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-red-400">Code expired — please request a new one</span>
                    )}
                  </div>
                </div>
                <button type="submit" disabled={verifying || code.length !== 6 || secondsLeft === 0}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {verifying ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
              <p className="text-center text-white/30 text-sm mt-6">
                Didn't receive it?{' '}
                <button onClick={() => setStep('form')} className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Try again</button>
              </p>
            </div>

          ) : (
            /* ── Signup form ── */
            <div>
              <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
                <Logo />
              </Link>

              <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Create account</h1>
              <p className="text-white/40 text-sm mb-8">Start your free trial — no credit card required</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
                    onBlur={e => validateEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none transition-all ${
                      emailError ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-violet-500/60'
                    }`}
                  />
                  {emailError && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <span>⚠</span>{emailError}
                    </p>
                  )}
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
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" required
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 pr-11 text-white placeholder-white/20 text-sm focus:outline-none transition-all ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-red-500/60 focus:border-red-500'
                          : confirmPassword && confirmPassword === password
                          ? 'border-emerald-500/60'
                          : 'border-white/10 focus:border-violet-500/60'
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><span>⚠</span>Passwords do not match</p>
                  )}
                  {confirmPassword && confirmPassword === password && (
                    <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1"><span>✓</span>Passwords match</p>
                  )}
                </div>

                <Turnstile onVerify={setCaptchaToken} onExpire={() => setCaptchaToken('')} />

                <button type="submit" disabled={loading || !captchaToken}
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
