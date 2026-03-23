import { useState } from 'react';
import { X, Copy, Check, ArrowRight, ArrowLeft, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WALLET = '0xd4062e68022ef5235898CBc4f069A0df4fF2Ea6C';

const CHAINS = [
  { id: 'eth',       label: 'Ethereum',       sub: 'ETH',       color: '#627EEA', icon: '⟠' },
  { id: 'usdt_erc',  label: 'Tether',         sub: 'USDT ERC-20', color: '#26A17B', icon: '₮' },
  { id: 'bnb',       label: 'BNB Chain',      sub: 'BNB',       color: '#F3BA2F', icon: '◈' },
  { id: 'usdt_bep',  label: 'Tether',         sub: 'USDT BEP-20', color: '#26A17B', icon: '₮' },
  { id: 'matic',     label: 'Polygon',        sub: 'MATIC',     color: '#8247E5', icon: '⬡' },
  { id: 'usdt_pol',  label: 'Tether',         sub: 'USDT Polygon', color: '#26A17B', icon: '₮' },
  { id: 'arb',       label: 'Arbitrum',       sub: 'ETH',       color: '#28A0F0', icon: '🔵' },
  { id: 'op',        label: 'Optimism',       sub: 'ETH',       color: '#FF0420', icon: '🔴' },
  { id: 'avax',      label: 'Avalanche',      sub: 'AVAX',      color: '#E84142', icon: '▲' },
  { id: 'usdt_avax', label: 'Tether',         sub: 'USDT AVAX', color: '#26A17B', icon: '₮' },
  { id: 'sol',       label: 'Solana',         sub: 'SOL',       color: '#9945FF', icon: '◎' },
  { id: 'usdt_sol',  label: 'Tether',         sub: 'USDT SPL',  color: '#26A17B', icon: '₮' },
  { id: 'trx',       label: 'TRON',           sub: 'TRX',       color: '#FF0013', icon: '◆' },
  { id: 'usdt_trc',  label: 'Tether',         sub: 'USDT TRC-20', color: '#26A17B', icon: '₮' },
  { id: 'btc',       label: 'Bitcoin',        sub: 'BTC',       color: '#F7931A', icon: '₿' },
  { id: 'ltc',       label: 'Litecoin',       sub: 'LTC',       color: '#BFBBBB', icon: 'Ł' },
  { id: 'xrp',       label: 'XRP',            sub: 'XRP',       color: '#00AAE4', icon: '✕' },
  { id: 'doge',      label: 'Dogecoin',       sub: 'DOGE',      color: '#C2A633', icon: 'Ð' },
  { id: 'base',      label: 'Base',           sub: 'ETH',       color: '#0052FF', icon: '🔷' },
  { id: 'ftm',       label: 'Fantom',         sub: 'FTM',       color: '#1969FF', icon: '👻' },
];

interface Props {
  plan: 'premium' | 'elite';
  onClose: () => void;
}

export default function PaymentModal({ plan, onClose }: Props) {
  const { toast } = useToast();
  const price = plan === 'premium' ? '$50' : '$99';
  const planColor = plan === 'elite' ? '#a855f7' : '#eab308';
  const [step, setStep] = useState<'chain' | 'pay' | 'confirm'>('chain');
  const [chain, setChain] = useState(CHAINS[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(WALLET)}&bgcolor=111827&color=ffffff&margin=12`;

  const submit = async () => {
    if (!name.trim() || !email.trim()) {
      toast({ title: 'Required', description: 'Please fill in your name and email', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${apiUrl}/payments/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, plan, chain: chain.label + ' ' + chain.sub, amount: price }),
      });
      if (!res.ok) throw new Error('Failed');
      setStep('confirm');
    } catch {
      toast({ title: 'Error', description: 'Failed to submit. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Glow */}
      <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: planColor, top: '30%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      <div className="relative w-full max-w-md bg-[#0d1117] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">

        {/* Top accent line */}
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${planColor}, transparent)` }} />

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all z-10">
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: planColor }}>
              {plan === 'elite' ? '⚡ Elite Plan' : '👑 Premium Plan'}
            </span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-white/40 text-xs font-medium">{price} / month</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {step === 'chain' ? 'Choose Network' : step === 'pay' ? 'Send Payment' : 'Request Sent'}
          </h2>

          {/* Step indicator */}
          {step !== 'confirm' && (
            <div className="flex items-center gap-2 mt-3">
              {['chain', 'pay'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s ? 'text-white' : step === 'pay' && s === 'chain' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'
                  }`} style={step === s ? { background: planColor } : {}}>
                    {step === 'pay' && s === 'chain' ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${step === s ? 'text-white' : 'text-white/30'}`}>
                    {s === 'chain' ? 'Network' : 'Payment'}
                  </span>
                  {i === 0 && <div className="w-8 h-px bg-white/10 mx-1" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-6">

          {/* ── STEP 1: Chain ── */}
          {step === 'chain' && (
            <div>
              <p className="text-xs text-white/40 mb-3">Select the blockchain network you'll use to send:</p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {CHAINS.map(c => (
                  <button key={c.id} onClick={() => setChain(c)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl border text-left transition-all group ${
                      chain.id === c.id
                        ? 'border-white/20 bg-white/[0.07]'
                        : 'border-white/[0.05] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                    }`}>
                    {/* Chain icon circle */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all"
                      style={{
                        background: chain.id === c.id ? `${c.color}25` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${chain.id === c.id ? c.color + '60' : 'rgba(255,255,255,0.06)'}`,
                        color: c.color,
                      }}>
                      {c.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{c.label}</p>
                      <p className="text-[10px] text-white/30 truncate">{c.sub}</p>
                    </div>
                    {chain.id === c.id && (
                      <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: planColor }}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button onClick={() => setStep('pay')}
                className="w-full mt-4 py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${planColor}, ${planColor}99)` }}>
                Continue with {chain.sub}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── STEP 2: Pay ── */}
          {step === 'pay' && (
            <div className="space-y-4">
              {/* Selected chain pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/[0.07]">
                  <span className="text-sm" style={{ color: chain.color }}>{chain.icon}</span>
                  <span className="text-xs font-semibold text-white">{chain.label}</span>
                  <span className="text-[10px] text-white/30">{chain.sub}</span>
                </div>
                <button onClick={() => setStep('chain')}
                  className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                  <ArrowLeft className="w-3 h-3" />Change
                </button>
              </div>

              {/* QR + address card */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex gap-4 items-start">
                  <img src={qrUrl} alt="QR" className="w-24 h-24 rounded-xl shrink-0 border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-white/40 mb-1">Send exactly</p>
                    <p className="text-2xl font-black text-white mb-1">{price}</p>
                    <p className="text-[11px] text-white/40 mb-2">worth of <span className="text-white/70 font-semibold">{chain.sub}</span> to this address:</p>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2">
                      <span className="text-[10px] text-white/50 font-mono flex-1 truncate">{WALLET}</span>
                      <button onClick={copy} className="shrink-0 transition-colors">
                        {copied
                          ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                          : <Copy className="w-3.5 h-3.5 text-white/30 hover:text-white" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* User details */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/30">Your details for verification</p>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Registered email address" type="email"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all" />
              </div>

              {/* Info row */}
              <div className="flex items-center gap-4 text-[11px] text-white/25">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" />Secure</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Activated within 24h</span>
              </div>

              <button onClick={submit} disabled={submitting}
                className="w-full py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
                style={{ background: `linear-gradient(135deg, ${planColor}, ${planColor}99)` }}>
                {submitting
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>
                  : <>"I've Sent the Payment" <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 'confirm' && (
            <div className="text-center py-6 space-y-5">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#10b981' }} />
                <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Check className="w-9 h-9 text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2">Request Submitted!</h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">
                  Our team will verify your payment and activate your{' '}
                  <span className="font-bold capitalize" style={{ color: planColor }}>{plan}</span>{' '}
                  plan within 24 hours.
                </p>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-white/40">
                Confirmation sent to <span className="text-white/70 font-medium">{email}</span>
              </div>
              <button onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.10] text-white font-bold text-sm transition-all">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
