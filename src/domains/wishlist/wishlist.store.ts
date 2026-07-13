import { create } from 'zustand';

export type SortOption = 'price-asc' | 'price-desc' | 'name';
export type ViewMode = 'grid' | 'list';

interface WishlistState {
  sortBy: SortOption;
  viewMode: ViewMode;
  selectedItems: number[];
  isCopied: boolean;
  isSheetOpen: boolean;
}

interface WishlistActions {
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setIsCopied: (copied: boolean) => void;
  toggleSelectItem: (productId: number) => void;
  toggleSelectAll: (productIds: number[]) => void;
  removeItem: (productId: number) => void;
  clearSelection: () => void;
  setSheetOpen: (open: boolean) => void;
  openSheet: () => void;
  closeSheet: () => void;
  reset: () => void;
}

type WishlistStore = WishlistState & WishlistActions;

const initialState: WishlistState = {
  sortBy: 'name',
  viewMode: 'grid',
  selectedItems: [],
  isCopied: false,
  isSheetOpen: false
};

/** Client UI state for wishlist page + navbar sheet. */
export const useWishlistStore = create<WishlistStore>()((set) => ({
  ...initialState,

  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),
  setIsCopied: (isCopied) => set({ isCopied }),

  toggleSelectItem: (productId) =>
    set((state) => ({
      selectedItems: state.selectedItems.includes(productId)
        ? state.selectedItems.filter((id) => id !== productId)
        : [...state.selectedItems, productId]
    })),

  toggleSelectAll: (productIds) =>
    set((state) => ({
      selectedItems: state.selectedItems.length === productIds.length ? [] : productIds
    })),

  removeItem: (productId) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((id) => id !== productId)
    })),

  clearSelection: () => set({ selectedItems: [] }),

  setSheetOpen: (isSheetOpen) => set({ isSheetOpen }),
  openSheet: () => set({ isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false }),
  reset: () => set(initialState)
}));
