import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Completing sign in...');

  useEffect(() => {
    const handle = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const session = data.session;
        if (!session) {
          const { data: exchanged, error: exchErr } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (exchErr) throw exchErr;
          if (!exchanged.session) throw new Error('No session');
          await saveUser(exchanged.session);
        } else {
          await saveUser(session);
        }
      } catch (err: any) {
        setStatus('Sign in failed. Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    const saveUser = async (session: any) => {
      const googleUser = session.user;
      const name = googleUser.user_metadata?.full_name || googleUser.email?.split('@')[0] || 'User';
      const email = googleUser.email;
      const avatar_url = googleUser.user_metadata?.avatar_url || null;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/auth/google-callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar_url, google_id: googleUser.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('subscription', JSON.stringify({
        plan: 'free', active: true, isTrial: false,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      window.dispatchEvent(new Event('user-updated'));
      navigate('/dashboard');
    };

    handle();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-white/60 text-sm">{status}</p>
      </div>
    </div>
  );
}
