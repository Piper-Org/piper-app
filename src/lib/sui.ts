/**
 * Sui / dApp Kit initialisation for Piper.
 *
 * - Uses @mysten/dapp-kit-react with SuiGrpcClient (not deprecated JSON-RPC).
 * - Sets Piper package ID on startup.
 * - Exports the dAppKit instance; import everywhere.
 */

import { createDAppKit } from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { Piper } from '@usepiper/sdk';
import { PIPER_PACKAGE_ID, SUI_GRPC_URL, SUI_GRAPHQL_URL, NETWORK } from './constants';

// ── Shared GraphQL Client ─────────────────────────────────────────────────────

export const GRPC_URLS = {
  testnet: SUI_GRPC_URL,
  mainnet: 'https://fullnode.mainnet.sui.io:443',
} as const;

export const GRAPHQL_URLS = {
  testnet: SUI_GRAPHQL_URL,
  mainnet: 'https://graphql.mainnet.sui.io/graphql',
} as const;

export const suiGraphQLClient = new SuiGraphQLClient({
  url: GRAPHQL_URLS[NETWORK] ?? GRAPHQL_URLS.testnet,
  network: NETWORK,
});

export function getGraphQLClient(network: 'testnet' | 'mainnet' = NETWORK) {
  return new SuiGraphQLClient({
    url: GRAPHQL_URLS[network] ?? GRAPHQL_URLS.testnet,
    network,
  });
}

// ── dApp Kit instance with SuiGrpcClient ──────────────────────────────────────

export const dAppKit = createDAppKit({
  networks: ['testnet', 'mainnet'],
  createClient: (network) => {
    const baseUrl =
      network === 'mainnet'
        ? GRPC_URLS.mainnet
        : GRPC_URLS.testnet;
    return new SuiGrpcClient({ baseUrl, network });
  },
  defaultNetwork: NETWORK,
});

// ── TypeScript augmentation — typed hooks ─────────────────────────────────────

declare module '@mysten/dapp-kit-react' {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}

// ── Configure Piper SDK ───────────────────────────────────────────────────────

Piper.setPackageId(PIPER_PACKAGE_ID);
