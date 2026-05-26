import { create } from 'zustand';

export type SortOption = 'price-asc' | 'price-desc' | 'name';
export type ViewMode = 'grid' | 'list';

interface WishlistState {
  sortBy: SortOption;
  viewMode: ViewMode;
  selectedItems: number[];
  isCopied: boolean;

  // Actions
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setIsCopied: (copied: boolean) => void;
  toggleSelectItem: (productId: number) => void;
  toggleSelectAll: (productIds: number[]) => void;
  removeItem: (productId: number) => void;
  clearSelection: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  sortBy: 'name',
  viewMode: 'grid',
  selectedItems: [],
  isCopied: false,

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
      // If everything is already selected, clear it. Otherwise, select everything passed in.
      selectedItems: state.selectedItems.length === productIds.length ? [] : productIds
    })),

  removeItem: (productId) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((id) => id !== productId)
    })),

  clearSelection: () => set({ selectedItems: [] })
}));
