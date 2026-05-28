'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount: number;
}

interface SearchStore {
  recentSearches: SearchHistoryItem[];
  addRecentSearch: (query: string, resultCount: number) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  recentlyViewedProducts: number[];
  addRecentlyViewedProduct: (productId: number) => void;
  clearRecentlyViewedProducts: () => void;

  searchCount: number;
  incrementSearchCount: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      recentSearches: [],
      recentlyViewedProducts: [],
      searchCount: 0,

      addRecentSearch: (query, resultCount) => {
        if (!query.trim()) return;
        set((state) => {
          const filtered = state.recentSearches.filter(
            (s) => s.query.toLowerCase() !== query.toLowerCase()
          );
          return {
            recentSearches: [{ query, timestamp: Date.now(), resultCount }, ...filtered].slice(
              0,
              10
            )
          };
        });
      },

      removeRecentSearch: (query) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter(
            (s) => s.query.toLowerCase() !== query.toLowerCase()
          )
        }));
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      addRecentlyViewedProduct: (productId) => {
        set((state) => {
          const filtered = state.recentlyViewedProducts.filter((id) => id !== productId);
          return { recentlyViewedProducts: [productId, ...filtered].slice(0, 12) };
        });
      },

      clearRecentlyViewedProducts: () => set({ recentlyViewedProducts: [] }),

      incrementSearchCount: () => set((state) => ({ searchCount: state.searchCount + 1 }))
    }),
    {
      name: 'luxe-search-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        recentlyViewedProducts: state.recentlyViewedProducts,
        searchCount: state.searchCount
      })
    }
  )
);
