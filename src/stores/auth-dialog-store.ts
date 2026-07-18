import { create } from 'zustand';

interface AuthDialogState {
  isOpen: boolean;
  /** Safe same-origin path to return to after sign-in (or stay when matching current URL). */
  callbackUrl: string;
  /** Optional context for analytics / future copy variants. */
  reason: string | null;
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
  reason: null
};

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
    set({
      isOpen: true,
      callbackUrl: resolveCallbackUrl(options?.callbackUrl),
      reason: options?.reason ?? null
    }),
  closeAuthDialog: () => set({ isOpen: false, reason: null }),
  setOpen: (open) => set({ isOpen: open, ...(open ? {} : { reason: null }) }),
  reset: () => set(initialState)
}));
