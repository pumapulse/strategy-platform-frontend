import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';

type Step = 'email' | 'code' | 'newpass' | 'done';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(600);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    if (step === 'code') {
      setSecondsLeft(600);
      timerRef.current = setInterval(() => {
        setSecondsLeft(s => { if (s <= 1) { clearInterval(timerRef.current!); return 0; } return s - 1; });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep('code');
        toast({ title: 'Code sent!', description: `Check ${email} for your reset code` });
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to connect', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (secondsLeft === 0) {
      setCodeError('Code expired. Please request a new one.');
      return;
    }
    setLoading(true);
    setCodeError('');
    try {
      // Verify code exists and is valid before proceeding
      const res = await fetch(`${API}/auth/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep('newpass');
      } else {
        setCodeError(data.error || 'Invalid code. Please try again.');
      }
    } catch {
      setCodeError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setCodeError('');
    setCode('');
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSecondsLeft(600);
        toast({ title: 'New code sent!', description: `Check ${email} for your new reset code` });
      } else {
        toast({ title: 'Error', description: 'Failed to resend code', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to resend', variant: 'destructive' });
    } finally {
      setResending(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep('done');
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
        if (data.error?.includes('expired')) setStep('code');
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to reset password', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/60 transition-all";

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <Logo height={44} />
        </Link>

        {/* ── Step 1: Email ── */}
        {step === 'email' && (
          <div>
            <Link to="/login" className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />Back to login
            </Link>
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-violet-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Forgot password?</h1>
            <p className="text-white/40 text-sm mb-8">Enter your email and we'll send you a reset code.</p>
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required className={inputClass} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          </div>
        )}

        {/* ── Step 2: Code ── */}
        {step === 'code' && (
          <div>
            <button onClick={() => setStep('email')} className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />Back
            </button>
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-violet-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Check your email</h1>
            <p className="text-white/40 text-sm mb-2">We sent a reset code to</p>
            <p className="text-violet-400 font-semibold text-sm mb-8">{email}</p>
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Reset Code</label>
                <input type="text" value={code}
                  onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setCodeError(''); }}
                  placeholder="000000" maxLength={6} required disabled={secondsLeft === 0}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-4 text-white placeholder-white/20 text-2xl font-black tracking-[0.5em] text-center focus:outline-none transition-all disabled:opacity-40 ${
                    codeError ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-violet-500/60'
                  }`} />
                {codeError && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1 justify-center">
                    <span>⚠</span>{codeError}
                  </p>
                )}
                <div className={`flex items-center justify-center gap-2 mt-3 px-4 py-2.5 rounded-xl border ${
                  secondsLeft === 0 ? 'border-red-500/30 bg-red-500/[0.07]'
                  : secondsLeft < 60 ? 'border-amber-500/30 bg-amber-500/[0.07]'
                  : 'border-white/[0.07] bg-white/[0.03]'
                }`}>
                  <Clock className={`w-3.5 h-3.5 ${secondsLeft === 0 ? 'text-red-400' : secondsLeft < 60 ? 'text-amber-400' : 'text-white/40'}`} />
                  {secondsLeft > 0
                    ? <span className={`text-sm font-semibold ${secondsLeft < 60 ? 'text-amber-400' : 'text-white/50'}`}>
                        This code will expire after <span className="font-black tabular-nums text-white">{formatTime(secondsLeft)}</span>
                      </span>
                    : <span className="text-sm font-bold text-red-400">Code expired — request a new one</span>}
                </div>
              </div>
              <button type="submit" disabled={code.length !== 6 || secondsLeft === 0 || loading}
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all disabled:opacity-50">
                {loading ? 'Verifying...' : 'Continue'}
              </button>
            </form>
            <p className="text-center text-white/30 text-sm mt-6">
              Didn't receive it?{' '}
              <button onClick={handleResend} disabled={resending}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors disabled:opacity-50">
                {resending ? 'Sending...' : 'Resend code'}
              </button>
            </p>
          </div>
        )}

        {/* ── Step 3: New password ── */}
        {step === 'newpass' && (
          <div>
            <button onClick={() => setStep('code')} className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />Back
            </button>
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7 text-violet-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Set new password</h1>
            <p className="text-white/40 text-sm mb-8">Choose a strong password for your account.</p>
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">New Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••" required minLength={6} className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-white/25 mt-1.5">Must be at least 6 characters</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" required
                    className={`${inputClass} pr-11 ${
                      confirmPassword && confirmPassword !== newPassword ? 'border-red-500/60' :
                      confirmPassword && confirmPassword === newPassword ? 'border-emerald-500/60' : ''
                    }`} />
                  <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-400 mt-1.5">⚠ Passwords do not match</p>
                )}
                {confirmPassword && confirmPassword === newPassword && (
                  <p className="text-xs text-emerald-400 mt-1.5">✓ Passwords match</p>
                )}
              </div>
              <button type="submit" disabled={loading || newPassword !== confirmPassword}
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all disabled:opacity-50">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        )}

        {/* ── Step 4: Done ── */}
        {step === 'done' && (
          <div className="text-center">
            <div className="relative mx-auto w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-emerald-500" />
              <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-9 h-9 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Password reset!</h1>
            <p className="text-white/40 text-sm mb-8">Your password has been updated successfully. You can now sign in with your new password.</p>
            <button onClick={() => navigate('/login')}
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all">
              Back to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
