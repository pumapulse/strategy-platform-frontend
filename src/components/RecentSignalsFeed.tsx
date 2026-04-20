import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight, Activity } from 'lucide-react';
import { signalStore, LiveSignal } from '@/lib/signalStore';

const STRATEGY_LINKS: Record<string, number> = {
  'EMA Crossover Trend': 5,
  'Mean Reversion RSI': 2,
  'Breakout Momentum': 1,
};

export default function RecentSignalsFeed() {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<LiveSignal[]>([]);

  useEffect(() => {
    return signalStore.subscribe(s => setSignals(s.slice(0, 6)));
  }, []);

  if (signals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Activity className="w-8 h-8 text-white/15 mb-3 animate-pulse" />
        <p className="text-white/30 text-sm">Waiting for live signals...</p>
        <p className="text-white/20 text-xs mt-1">Signals appear from the Live Trading Terminal above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {signals.map((s, i) => (
        <div key={s.id}
          onClick={() => navigate(`/strategy/${STRATEGY_LINKS[s.strategy] ?? 1}`)}
          className="flex items-center justify-between p-4 rounded-xl border border-white/[0.05] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer group animate-fade-up"
          style={{ animationDelay: `${i * 0.04}s` }}>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.type === 'buy' ? 'bg-emerald-400/10' : 'bg-red-400/10'}`}>
              {s.type === 'buy'
                ? <TrendingUp className="w-5 h-5 text-emerald-400" />
                : <TrendingDown className="w-5 h-5 text-red-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{s.strategy}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  s.strength === 'strong'
                    ? s.type === 'buy' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                    : 'bg-white/8 text-white/35'
                }`}>{s.strength}</span>
              </div>
              <p className="text-sm text-white/30 mt-0.5">BTC/USDT · {s.time}</p>
              <p className="text-xs text-white/20 mt-0.5">{s.reason}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-sm font-black text-white">
                ${s.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {s.pnl && (
                <p className={`text-xs font-bold ${s.pnl.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  P&L: {s.pnl}
                </p>
              )}
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              s.type === 'buy' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
            }`}>
              {s.type.toUpperCase()}
            </span>
            <ArrowRight className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      ))}
    </div>
  );
}
