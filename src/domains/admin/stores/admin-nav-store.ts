import { create } from 'zustand';

interface AdminNavStoreState {
  favoritePendingHref: string | null;
}

interface AdminNavStoreActions {
  setFavoritePendingHref: (href: string | null) => void;
  reset: () => void;
}

type AdminNavStore = AdminNavStoreState & AdminNavStoreActions;

const initialState: AdminNavStoreState = {
  favoritePendingHref: null
};

/** Optimistic UI state for admin navigation favorites. */
export const useAdminNavStore = create<AdminNavStore>()((set) => ({
  ...initialState,
  setFavoritePendingHref: (href) => set({ favoritePendingHref: href }),
  reset: () => set(initialState)
}));
