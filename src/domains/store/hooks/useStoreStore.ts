import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Store {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

interface StoreState {
  // Following stores
  followedStores: string[];
  followStore: (storeId: string) => void;
  unfollowStore: (storeId: string) => void;
  isFollowing: (storeId: string) => boolean;

  // Recently viewed stores
  recentlyViewedStores: Store[];
  addRecentlyViewed: (store: Store) => void;
  clearRecentlyViewed: () => void;

  // Favorite products per store
  favoriteProducts: Record<string, number[]>;
  toggleFavoriteProduct: (storeId: string, productId: number) => void;
  isFavoriteProduct: (storeId: string, productId: number) => boolean;
  getFavoriteCount: (storeId: string) => number;
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set, get) => ({
      followedStores: [],
      followStore: (storeId) =>
        set((state) => ({
          followedStores: [...state.followedStores, storeId]
        })),
      unfollowStore: (storeId) =>
        set((state) => ({
          followedStores: state.followedStores.filter((id) => id !== storeId)
        })),
      isFollowing: (storeId) => get().followedStores.includes(storeId),

      // Recently viewed stores
      recentlyViewedStores: [],
      addRecentlyViewed: (store) =>
        set((state) => {
          const filtered = state.recentlyViewedStores.filter((s) => s.id !== store.id);
          return {
            recentlyViewedStores: [store, ...filtered].slice(0, 10)
          };
        }),
      clearRecentlyViewed: () => set({ recentlyViewedStores: [] }),

      // Favorite products per store
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
      }
    }),
    {
      name: 'store-storage'
    }
  )
);
