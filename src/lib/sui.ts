/**
 * Sui / dApp Kit initialisation for Piper.
 *
 * - Uses @mysten/dapp-kit-react with SuiGrpcClient (not deprecated JSON-RPC).
 * - Sets Piper package ID on startup.
 * - Exports the dAppKit instance; import everywhere.
 */

import { createDAppKit } from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Piper } from '@usepiper/sdk';
import { PIPER_PACKAGE_ID, SUI_RPC_URL } from './constants';

// ── dApp Kit instance ─────────────────────────────────────────────────────────

export const dAppKit = createDAppKit({
  networks: ['testnet', 'mainnet'],
  createClient: (network) => {
    const url =
      network === 'mainnet'
        ? 'https://fullnode.mainnet.sui.io:443'
        : SUI_RPC_URL;
    return new SuiGrpcClient({ url });
  },
  defaultNetwork: 'testnet',
});

// ── TypeScript augmentation — typed hooks ─────────────────────────────────────

declare module '@mysten/dapp-kit-react' {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}

// ── Configure Piper SDK ───────────────────────────────────────────────────────

Piper.setPackageId(PIPER_PACKAGE_ID);
