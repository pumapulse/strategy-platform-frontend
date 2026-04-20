// Shared in-memory signal store — LiveTradingTerminal writes, RecentSignalsFeed reads

export interface LiveSignal {
  id: number;
  type: 'buy' | 'sell';
  price: number;
  time: string;
  strategy: string;
  strength: 'strong' | 'moderate';
  reason: string;
  pnl?: string;
}

type Listener = (signals: LiveSignal[]) => void;

let signals: LiveSignal[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

export const signalStore = {
  push(signal: Omit<LiveSignal, 'id'>) {
    signals = [{ ...signal, id: nextId++ }, ...signals].slice(0, 20);
    listeners.forEach(l => l([...signals]));
  },
  get(): LiveSignal[] {
    return [...signals];
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    fn([...signals]);
    return () => listeners.delete(fn);
  },
};
