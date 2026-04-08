import contractABI from '../../contract/SubscriptionManager.json';

declare global {
  interface Window { ethereum?: any; }
}

// ── Config ────────────────────────────────────────────────────────────────────
// After deploying on Sepolia, paste the contract address here
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';
export const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111

const PLAN_PREMIUM = 1;
const PLAN_ELITE   = 2;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Encode a contract call (no ethers.js needed — raw ABI encoding) */
function encodeSubscribe(plan: number): string {
  // subscribe(uint8) selector = keccak256("subscribe(uint8)")[0:4]
  const selector = '0x0b0a6bd1'; // precomputed
  const planHex  = plan.toString(16).padStart(64, '0');
  return selector + planHex;
}

function encodeGetSubscription(address: string): string {
  // getSubscription(address) selector
  const selector = '0x7b6a8777'; // precomputed
  const addrHex  = address.toLowerCase().replace('0x', '').padStart(64, '0');
  return selector + addrHex;
}

function encodePremiumPrice(): string { return '0x5b9af12b'; }
function encodeElitePrice():   string { return '0x1a2d4e6f'; }

/** Decode getSubscription result: (uint8 plan, uint256 expiry, bool active) */
function decodeSubscription(hex: string): { plan: number; expiry: number; active: boolean } {
  const data = hex.replace('0x', '');
  const plan   = parseInt(data.slice(0, 64), 16);
  const expiry = parseInt(data.slice(64, 128), 16);
  const active = parseInt(data.slice(128, 192), 16) === 1;
  return { plan, expiry, active };
}

// ── MetaMask connection ───────────────────────────────────────────────────────

export const connectMetaMask = async (): Promise<string> => {
  if (!window.ethereum) throw new Error('MetaMask is not installed');
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return accounts[0];
};

export const checkMetaMaskConnection = async (): Promise<string | null> => {
  if (!window.ethereum) return null;
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0 ? accounts[0] : null;
  } catch { return null; }
};

/** Switch MetaMask to Sepolia */
export const switchToSepolia = async () => {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: SEPOLIA_CHAIN_ID }],
  });
};

// ── Contract reads ────────────────────────────────────────────────────────────

export const getOnChainSubscription = async (userAddress: string) => {
  if (!CONTRACT_ADDRESS || !window.ethereum) return null;
  try {
    const result = await window.ethereum.request({
      method: 'eth_call',
      params: [{
        to:   CONTRACT_ADDRESS,
        data: encodeGetSubscription(userAddress),
      }, 'latest'],
    });
    if (!result || result === '0x') return null;
    const { plan, expiry, active } = decodeSubscription(result);
    return {
      plan:      plan === PLAN_ELITE ? 'elite' : 'premium',
      expiry:    expiry * 1000, // to ms
      active,
      expired:   !active,
      isTrial:   false,
      startDate: new Date(Date.now()).toISOString(),
      endDate:   new Date(expiry * 1000).toISOString(),
    };
  } catch { return null; }
};

export const getContractPrices = async (): Promise<{ premium: bigint; elite: bigint } | null> => {
  if (!CONTRACT_ADDRESS || !window.ethereum) return null;
  try {
    const [p, e] = await Promise.all([
      window.ethereum.request({ method: 'eth_call', params: [{ to: CONTRACT_ADDRESS, data: encodePremiumPrice() }, 'latest'] }),
      window.ethereum.request({ method: 'eth_call', params: [{ to: CONTRACT_ADDRESS, data: encodeElitePrice()   }, 'latest'] }),
    ]);
    return {
      premium: BigInt(p),
      elite:   BigInt(e),
    };
  } catch { return null; }
};

// ── Contract write ────────────────────────────────────────────────────────────

export const subscribeOnChain = async (
  plan: 'premium' | 'elite',
  valueWei: bigint
): Promise<string> => {
  if (!CONTRACT_ADDRESS) throw new Error('Contract not deployed yet');
  if (!window.ethereum)  throw new Error('MetaMask not installed');

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const from = accounts[0];

  // Ensure Sepolia
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (chainId !== SEPOLIA_CHAIN_ID) await switchToSepolia();

  const planId = plan === 'premium' ? PLAN_PREMIUM : PLAN_ELITE;

  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [{
      from,
      to:    CONTRACT_ADDRESS,
      data:  encodeSubscribe(planId),
      value: '0x' + valueWei.toString(16),
    }],
  });

  return txHash;
};

// ── Legacy localStorage subscription (free trial + manual payments) ───────────

export const checkSubscription = () => {
  const stored = localStorage.getItem('subscription');
  if (!stored) return null;
  const sub = JSON.parse(stored);
  const expired = new Date() > new Date(sub.endDate);
  return { ...sub, active: !expired, expired };
};

export const isSubscriptionActive = () => {
  const sub = checkSubscription();
  return sub?.active && !sub?.expired;
};

export const saveOnChainSubscription = (plan: 'premium' | 'elite', expiryMs: number) => {
  const sub = {
    active:    true,
    isTrial:   false,
    plan,
    startDate: new Date().toISOString(),
    endDate:   new Date(expiryMs).toISOString(),
    onChain:   true,
  };
  localStorage.setItem('subscription', JSON.stringify(sub));
  window.dispatchEvent(new Event('user-updated'));
};
