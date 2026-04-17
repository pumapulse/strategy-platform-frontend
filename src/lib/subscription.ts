import { checkSubscription } from './metamask';

export type PlanTier = 'free' | 'premium' | 'elite';

export function getPlanTier(): PlanTier {
  const sub = checkSubscription();
  if (!sub || !sub.active || sub.expired) return 'free';
  const plan = (sub.plan || '').toLowerCase();
  if (plan === 'elite') return 'elite';
  if (plan === 'premium') return 'premium';
  if (sub.isTrial) return 'free'; // trial = free tier
  return 'free';
}

export function canDownloadScript(): boolean {
  const tier = getPlanTier();
  return tier === 'premium' || tier === 'elite';
}

export function getMonthlyDownloads(): number {
  const tier = getPlanTier();
  if (tier === 'elite')   return 4;
  if (tier === 'premium') return 2;
  return 0;
}

export function getDailyNewStrategies(): number {
  const tier = getPlanTier();
  if (tier === 'elite')   return 2;
  if (tier === 'premium') return 1;
  return 0;
}

// Track downloads in localStorage (resets monthly)
export function getRemainingDownloads(): number {
  const tier = getPlanTier();
  if (tier === 'free') return 0;

  const key = `downloads_${new Date().getFullYear()}_${new Date().getMonth()}`;
  const used = parseInt(localStorage.getItem(key) || '0');
  const max  = getMonthlyDownloads();
  return Math.max(0, max - used);
}

export function recordDownload(): void {
  const key = `downloads_${new Date().getFullYear()}_${new Date().getMonth()}`;
  const used = parseInt(localStorage.getItem(key) || '0');
  localStorage.setItem(key, String(used + 1));
}
