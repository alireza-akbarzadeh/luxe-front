import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PrivateShoppingState {
  enabled: boolean;
}

interface PrivateShoppingActions {
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
  reset: () => void;
}

type PrivateShoppingStore = PrivateShoppingState & PrivateShoppingActions;

const initialState: PrivateShoppingState = {
  enabled: false
};

/** Client preference to limit personalization signals while browsing. */
export const usePrivateShoppingStore = create<PrivateShoppingStore>()(
  persist(
    (set) => ({
      ...initialState,
      setEnabled: (enabled) => set({ enabled }),
      toggle: () => set((state) => ({ enabled: !state.enabled })),
      reset: () => set({ ...initialState })
    }),
    { name: 'luxe-private-shopping' }
  )
);
