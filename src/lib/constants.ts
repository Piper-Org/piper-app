/**
 * Piper App — Constants
 *
 * All environment-sourced config and app-wide constants in one place.
 */

// ── Piper contract ────────────────────────────────────────────────────────────

export const PIPER_PACKAGE_ID =
  import.meta.env.VITE_PIPER_PACKAGE_ID ??
  '0x8f33eecb14d7990f19374499622f8ac4f9d493ace3368209f3969ccc149d3da7';

export const NETWORK = (import.meta.env.VITE_NETWORK ?? 'testnet') as 'testnet' | 'mainnet';

// ── Sui RPC endpoints ─────────────────────────────────────────────────────────

export const SUI_RPC_URL =
  import.meta.env.VITE_SUI_RPC_URL ?? 'https://fullnode.testnet.sui.io:443';

export const SUI_WS_URL =
  import.meta.env.VITE_SUI_WS_URL ?? 'wss://fullnode.testnet.sui.io:443';

// ── zkLogin / Enoki ───────────────────────────────────────────────────────────

export const ZKLOGIN_CLIENT_ID = import.meta.env.VITE_ZKLOGIN_CLIENT_ID ?? '';
export const ENOKI_API_KEY = import.meta.env.VITE_ENOKI_API_KEY ?? '';

// ── Data fetching ─────────────────────────────────────────────────────────────

/** Base polling interval for TanStack Query stream queries (7 seconds) */
export const POLL_INTERVAL_MS = 7_000;

/** WebSocket reconnect delays (exponential backoff) */
export const WS_RECONNECT_DELAYS = [3_000, 6_000, 12_000];

// ── Supported coins ───────────────────────────────────────────────────────────

export const SUPPORTED_COINS = {
  SUI: {
    type: '0x2::sui::SUI',
    symbol: 'SUI',
    decimals: 9,
    color: '#4DA2FF',
  },
  USDC: {
    type: '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC',
    symbol: 'USDC',
    decimals: 6,
    color: '#2775CA',
  },
} as const;

export type CoinSymbol = keyof typeof SUPPORTED_COINS;

// ── Stream modes ──────────────────────────────────────────────────────────────

export const STREAM_MODES = {
  continuous: {
    label: 'Continuous Stream',
    description: 'Pay by the second. Perfect for rides, freelance, subscriptions.',
    icon: '⏱',
  },
  onDemand: {
    label: 'Pay-Per-Use Credit',
    description: 'Pre-fund a credit line. Billed per action by an authorized service.',
    icon: '💳',
  },
  dca: {
    label: 'DCA Stream',
    description: 'Auto-buy tokens over time. Dollar-cost average into any asset.',
    icon: '📈',
    comingSoon: true,
  },
} as const;

export type StreamMode = keyof typeof STREAM_MODES;
