import { create } from 'zustand';
import type { Transaction } from '@mysten/sui/transactions';

interface EnokiTxState {
  isOpen: boolean;
  transaction: Transaction | null;
  resolve: ((approved: boolean) => void) | null;
  requestApproval: (tx: Transaction) => Promise<boolean>;
  approve: () => void;
  reject: () => void;
}

export const useEnokiTxStore = create<EnokiTxState>((set, get) => ({
  isOpen: false,
  transaction: null,
  resolve: null,
  
  requestApproval: (tx) => {
    return new Promise((resolve) => {
      set({ isOpen: true, transaction: tx, resolve });
    });
  },
  
  approve: () => {
    const { resolve } = get();
    if (resolve) resolve(true);
    set({ isOpen: false, transaction: null, resolve: null });
  },
  
  reject: () => {
    const { resolve } = get();
    if (resolve) resolve(false);
    set({ isOpen: false, transaction: null, resolve: null });
  }
}));
