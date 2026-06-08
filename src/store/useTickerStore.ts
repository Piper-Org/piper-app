/**
 * Optimistic ticker store.
 *
 * Tracks per-second balance counters for active streams.
 * The ticker increments locally every second between TanStack Query polls,
 * then resets to the on-chain value when the query refetches.
 *
 * Key: streamId
 * Value: { balance (raw bigint), flowRatePerSec (bigint), lastSyncAt (ms timestamp) }
 */

import { create } from 'zustand';

interface TickerEntry {
  /** On-chain balance at last sync, in smallest units */
  balance: bigint;
  /** Flow rate per second, in smallest units */
  flowRatePerSec: bigint;
  /** Unix ms timestamp of last on-chain sync */
  lastSyncAt: number;
}

interface TickerStore {
  tickers: Record<string, TickerEntry>;
  sync: (streamId: string, entry: TickerEntry) => void;
  remove: (streamId: string) => void;
  /** Compute the current optimistic balance for a stream */
  getOptimistic: (streamId: string, mode?: 'remaining' | 'earned') => bigint | null;
}

export const useTickerStore = create<TickerStore>((set, get) => ({
  tickers: {},

  sync: (streamId, entry) =>
    set((s) => ({ tickers: { ...s.tickers, [streamId]: entry } })),

  remove: (streamId) =>
    set((s) => {
      const { [streamId]: _, ...rest } = s.tickers;
      return { tickers: rest };
    }),

  getOptimistic: (streamId, mode = 'remaining') => {
    const entry = get().tickers[streamId];
    if (!entry) return null;

    // If flow rate is 0 (Pay-Per-Use), it doesn't tick.
    if (entry.flowRatePerSec === 0n) {
      return mode === 'remaining' ? entry.balance : 0n;
    }

    const elapsedSecs = BigInt(Math.floor((Date.now() - entry.lastSyncAt) / 1000));
    let earned = entry.flowRatePerSec * elapsedSecs;
    
    // The amount earned since last sync cannot exceed the total remaining balance in the stream!
    if (earned > entry.balance) {
      earned = entry.balance;
    }

    if (mode === 'earned') {
      return earned;
    }
    
    // Remaining balance decreases by the earned amount
    return entry.balance - earned;
  },
}));
