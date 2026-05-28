import { create } from 'zustand';

interface StoreState {
  // Favorite products per store
  favoriteProducts: Record<string, number[]>;
  toggleFavoriteProduct: (storeId: string, productId: number) => void;
  isFavoriteProduct: (storeId: string, productId: number) => boolean;
  getFavoriteCount: (storeId: string) => number;
  filterMobileSheetOpen: boolean;
  setFilterMobileSheetOpen: (open: boolean) => void;
  toggleFilterMobileSheet: () => void;
}

export const useStoreStore = create<StoreState>()((set, get) => ({
  favoriteProducts: {},
  toggleFavoriteProduct: (storeId, productId) =>
    set((state) => {
      const storeProducts = state.favoriteProducts[storeId] || [];
      const isFavorite = storeProducts.includes(productId);
      return {
        favoriteProducts: {
          ...state.favoriteProducts,
          [storeId]: isFavorite
            ? storeProducts.filter((id) => id !== productId)
            : [...storeProducts, productId]
        }
      };
    }),
  isFavoriteProduct: (storeId, productId) => {
    const storeProducts = get().favoriteProducts[storeId] || [];
    return storeProducts.includes(productId);
  },
  getFavoriteCount: (storeId) => {
    const storeProducts = get().favoriteProducts[storeId] || [];
    return storeProducts.length;
  },
  filterMobileSheetOpen: false,
  setFilterMobileSheetOpen: (open) => set({ filterMobileSheetOpen: open }),
  toggleFilterMobileSheet: () =>
    set((state) => ({ filterMobileSheetOpen: !state.filterMobileSheetOpen }))
}));
