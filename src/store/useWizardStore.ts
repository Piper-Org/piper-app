/**
 * Stream creation wizard state.
 *
 * Zustand owns wizard UI state only.
 * Blockchain state lives in TanStack Query.
 */

import { create } from 'zustand';
import type { StreamMode, CoinSymbol } from '@/lib/constants';

export interface SplitConfig {
  recipient: string;
  percent: number;
}

export interface WizardDraft {
  mode: StreamMode;
  coinSymbol: CoinSymbol;
  amount: string;          // user-typed deposit amount
  flowRatePerSec: string;  // user-typed or computed
  durationSecs: string;    // user-typed or computed
  recipient: string;
  authorizedSpender: string; // pay-per-use only
  splits: SplitConfig[];
}

interface WizardStore {
  step: number;
  direction: 'forward' | 'backward';
  draft: WizardDraft;
  // Actions
  setStep: (step: number, direction?: 'forward' | 'backward') => void;
  nextStep: () => void;
  prevStep: () => void;
  updateDraft: (partial: Partial<WizardDraft>) => void;
  addSplit: (split: SplitConfig) => void;
  removeSplit: (index: number) => void;
  reset: () => void;
}

const defaultDraft: WizardDraft = {
  mode: 'continuous',
  coinSymbol: 'SUI',
  amount: '',
  flowRatePerSec: '',
  durationSecs: '',
  recipient: '',
  authorizedSpender: '',
  splits: [],
};

export const useWizardStore = create<WizardStore>((set) => ({
  step: 0,
  direction: 'forward',
  draft: defaultDraft,

  setStep: (step, direction = 'forward') =>
    set({ step, direction }),

  nextStep: () =>
    set((s) => ({ step: Math.min(s.step + 1, 3), direction: 'forward' })),

  prevStep: () =>
    set((s) => ({ step: Math.max(s.step - 1, 0), direction: 'backward' })),

  updateDraft: (partial) =>
    set((s) => ({ draft: { ...s.draft, ...partial } })),

  addSplit: (split) =>
    set((s) => ({ draft: { ...s.draft, splits: [...s.draft.splits, split] } })),

  removeSplit: (index) =>
    set((s) => ({
      draft: {
        ...s.draft,
        splits: s.draft.splits.filter((_, i) => i !== index),
      },
    })),

  reset: () => set({ step: 0, direction: 'forward', draft: defaultDraft }),
}));
