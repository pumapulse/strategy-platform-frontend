import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  loading: boolean;
}

export default function MarketTicker() {
  const [markets, setMarkets] = useState<MarketData[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 0, change24h: 0, loading: true },
    { symbol: 'ETH', name: 'Ethereum', price: 0, change24h: 0, loading: true },
    { symbol: 'SOL', name: 'Solana', price: 0, change24h: 0, loading: true },
    { symbol: 'BNB', name: 'BNB', price: 0, change24h: 0, loading: true },
    { symbol: 'XRP', name: 'Ripple', price: 0, change24h: 0, loading: true },
  ]);

  const fetchMarketData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await response.json();

      setMarkets([
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: data.bitcoin?.usd || 0,
          change24h: data.bitcoin?.usd_24h_change || 0,
          loading: false,
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          price: data.ethereum?.usd || 0,
          change24h: data.ethereum?.usd_24h_change || 0,
          loading: false,
        },
        {
          symbol: 'SOL',
          name: 'Solana',
          price: data.solana?.usd || 0,
          change24h: data.solana?.usd_24h_change || 0,
          loading: false,
        },
        {
          symbol: 'BNB',
          name: 'BNB',
          price: data.binancecoin?.usd || 0,
          change24h: data.binancecoin?.usd_24h_change || 0,
          loading: false,
        },
        {
          symbol: 'XRP',
          name: 'Ripple',
          price: data.ripple?.usd || 0,
          change24h: data.ripple?.usd_24h_change || 0,
          loading: false,
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      setMarkets(prev => prev.map(m => ({ ...m, loading: false })));
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, symbol: string) => {
    if (price === 0) return '—';
    if (symbol === 'BTC' || symbol === 'ETH') return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    return `$${price.toFixed(2)}`;
  };

  // Repeat 6x so the ticker always fills the full screen width
  const repeated = [...markets, ...markets, ...markets, ...markets, ...markets, ...markets];

  return (
    <div className="bg-[#0d1120] border-y border-white/[0.06] overflow-hidden">
      <div className="flex animate-ticker">
        {repeated.map((market, idx) => {
          const isPositive = market.change24h >= 0;
          return (
            <div
              key={`${market.symbol}-${idx}`}
              className="flex items-center gap-2.5 px-8 py-4 whitespace-nowrap shrink-0"
            >
              <span className="text-white/50 text-xs font-bold tracking-widest uppercase">{market.symbol}</span>
              {market.loading ? (
                <span className="text-white/20 text-sm">—</span>
              ) : (
                <>
                  <span className="text-white font-bold text-sm">${formatPrice(market.price, market.symbol)}</span>
                  <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? '+' : ''}{market.change24h.toFixed(2)}%
                  </div>
                </>
              )}
              <div className="w-px h-4 bg-white/10 ml-1" />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 60s linear infinite;
          width: max-content;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
