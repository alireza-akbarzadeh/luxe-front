'use client';

import { create } from 'zustand';

/**
 * Client-only auth UI state.
 * Session tokens and user identity live in httpOnly cookies + AuthProvider.
 */
interface AuthUIState {
  isSubmitting: boolean;
  setSubmitting: (value: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthUIState>()((set) => ({
  isSubmitting: false,
  setSubmitting: (value) => set({ isSubmitting: value }),
  reset: () => set({ isSubmitting: false })
}));
