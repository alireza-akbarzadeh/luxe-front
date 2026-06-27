import { create } from 'zustand';

import type { PlusPaymentReceipt } from '@/domains/plus/lib/confirm-plus-stripe';

interface PlusActivationState {
  receipt: PlusPaymentReceipt | null;
  setReceipt: (receipt: PlusPaymentReceipt | null) => void;
  clearReceipt: () => void;
}

/** Holds the latest Plus Stripe activation receipt for the account success banner. */
export const usePlusActivationStore = create<PlusActivationState>()((set) => ({
  receipt: null,
  setReceipt: (receipt) => set({ receipt }),
  clearReceipt: () => set({ receipt: null })
}));
