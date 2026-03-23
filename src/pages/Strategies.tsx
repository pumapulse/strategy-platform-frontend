import Header from '@/components/Header';
import StrategyGrid from '@/components/StrategyGrid';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Strategies = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-28 pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Trading Strategies</h1>
          <p className="text-muted-foreground">Browse and discover proven trading strategies</p>
        </div>

        {!isLoggedIn && (
          <div className="mb-8 flex items-center gap-3 px-5 py-4 rounded-2xl border border-yellow-500/40 bg-yellow-500/10">
            <Lock className="w-5 h-5 text-yellow-400 shrink-0" />
            <p className="text-sm text-yellow-300">
              Showing 4 sample strategies.{' '}
              <Link to="/login" className="font-semibold underline underline-offset-2 hover:text-yellow-200">
                Sign in
              </Link>{' '}
              or{' '}
              <Link to="/signup" className="font-semibold underline underline-offset-2 hover:text-yellow-200">
                create an account
              </Link>{' '}
              to unlock all strategies.
            </p>
          </div>
        )}

        <StrategyGrid limitedView={!isLoggedIn} />
      </div>
    </div>
  );
};

export default Strategies;
