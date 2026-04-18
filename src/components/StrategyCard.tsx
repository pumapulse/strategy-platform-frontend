import { TrendingUp, TrendingDown, BarChart2, Target, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StrategyCardProps {
  id: number;
  name: string;
  market: string;
  timeframe: string;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  avgReturn: number;
}

const StrategyCard = ({ id, name, market, timeframe, winRate, profitFactor, maxDrawdown, avgReturn }: StrategyCardProps) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const requiresLogin = id >= 5;
  const locked = requiresLogin && !isLoggedIn;

  const handleClick = () => {
    if (locked) {
      navigate(`/login?redirect=/strategy/${id}`);
    } else {
      navigate(`/strategy/${id}`);
    }
  };

  return (
    <div
      className={`relative p-6 rounded-2xl border cursor-pointer transition-all group ${
        locked
          ? 'border-white/[0.05] bg-white/[0.02] hover:border-violet-500/30 hover:bg-violet-500/5'
          : 'border-white/[0.07] bg-white/[0.03] hover:bg-emerald-500/10 hover:border-emerald-500/30'
      }`}
      onClick={handleClick}
    >
      {/* Lock overlay for strategies 5-12 when not logged in */}
      {locked && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/25">
          <Lock className="w-3 h-3 text-violet-400" />
          <span className="text-[10px] font-bold text-violet-400">Login required</span>
        </div>
      )}

      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className={`text-lg font-bold mb-2 transition-colors ${locked ? 'text-white/60 group-hover:text-violet-400' : 'text-white group-hover:text-emerald-400'}`}>{name}</h3>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-xs font-medium">{market}</span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40 text-xs">{timeframe}</span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${locked ? 'bg-violet-400/10 group-hover:bg-violet-400/20' : 'bg-emerald-400/10 group-hover:bg-emerald-400/20'}`}>
          {locked ? <Lock className="w-5 h-5 text-violet-400" /> : <BarChart2 className="w-5 h-5 text-emerald-400" />}
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-4 ${locked ? 'opacity-60' : ''}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <Target className="w-3 h-3" /><span>Win Rate</span>
          </div>
          <p className="text-2xl font-black text-emerald-400">{winRate}%</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <TrendingUp className="w-3 h-3" /><span>Profit Factor</span>
          </div>
          <p className="text-2xl font-black text-white">{profitFactor}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <TrendingDown className="w-3 h-3" /><span>Max DD</span>
          </div>
          <p className="text-2xl font-black text-red-400">{maxDrawdown}%</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <BarChart2 className="w-3 h-3" /><span>Avg Return</span>
          </div>
          <p className="text-2xl font-black text-emerald-400">+{avgReturn}%</p>
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;
