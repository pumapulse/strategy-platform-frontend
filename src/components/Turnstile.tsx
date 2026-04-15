import { useEffect, useRef } from 'react';

interface Props {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: object) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

export default function Turnstile({ onVerify, onExpire }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const render = () => {
    if (!containerRef.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      theme: 'dark',
      callback: (token: string) => onVerify(token),
      'expired-callback': () => {
        onExpire?.();
        if (widgetId.current) window.turnstile?.reset(widgetId.current);
      },
    });
  };

  useEffect(() => {
    if (window.turnstile) { render(); return; }

    if (!document.getElementById('cf-turnstile-script')) {
      window.onTurnstileLoad = render;
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) { render(); clearInterval(interval); }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
    };
  }, []);

  return <div ref={containerRef} className="mt-1" />;
}
