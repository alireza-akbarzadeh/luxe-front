import { create } from 'zustand';

interface AuthDialogState {
  isOpen: boolean;
  /** Safe same-origin path to return to after sign-in (or stay when matching current URL). */
  callbackUrl: string;
  /** Optional context for analytics / future copy variants. */
  reason: string | null;
  /** Ignore open requests briefly after a successful sign-in close. */
  suppressOpenUntil: number;
}

interface AuthDialogActions {
  openAuthDialog: (options?: { callbackUrl?: string; reason?: string }) => void;
  closeAuthDialog: () => void;
  setOpen: (open: boolean) => void;
  reset: () => void;
}

type AuthDialogStore = AuthDialogState & AuthDialogActions;

const initialState: AuthDialogState = {
  isOpen: false,
  callbackUrl: '/',
  reason: null,
  suppressOpenUntil: 0
};

const SUPPRESS_REOPEN_MS = 600;

function resolveCallbackUrl(callbackUrl?: string): string {
  if (callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//')) {
    return callbackUrl;
  }
  if (typeof window !== 'undefined') {
    return `${window.location.pathname}${window.location.search}` || '/';
  }
  return '/';
}

/** Global soft sign-in dialog — opened from CTAs (cart, wishlist, gift cards, nav). */
export const useAuthDialogStore = create<AuthDialogStore>()((set) => ({
  ...initialState,
  openAuthDialog: (options) =>
    set((state) => {
      if (Date.now() < state.suppressOpenUntil) {
        return state;
      }

      return {
        isOpen: true,
        callbackUrl: resolveCallbackUrl(options?.callbackUrl),
        reason: options?.reason ?? null,
        suppressOpenUntil: 0
      };
    }),
  closeAuthDialog: () =>
    set({
      isOpen: false,
      reason: null,
      suppressOpenUntil: Date.now() + SUPPRESS_REOPEN_MS
    }),
  setOpen: (open) => set({ isOpen: open, ...(open ? {} : { reason: null }) }),
  reset: () => set(initialState)
}));
