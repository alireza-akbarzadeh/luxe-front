'use client';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount: number;
}

interface SearchStoreState {
  recentSearches: SearchHistoryItem[];
  recentlyViewedProducts: number[];
  searchCount: number;
  isSearchSheetOpen: boolean;
  isFilterSheetOpen: boolean;
  /** AI interpretation of the last natural-language search (session only). */
  intentInterpretation: string | null;
  naturalQuery: string | null;
  /** Visual search context (session only). */
  visualInterpretation: string | null;
  visualImagePreview: string | null;
  isVisualSearchOpen: boolean;
}

interface SearchStoreActions {
  addRecentSearch: (query: string, resultCount: number) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  addRecentlyViewedProduct: (productId: number) => void;
  clearRecentlyViewedProducts: () => void;
  incrementSearchCount: () => void;
  setSearchSheetOpen: (open: boolean) => void;
  openSearchSheet: () => void;
  closeSearchSheet: () => void;
  setFilterSheetOpen: (open: boolean) => void;
  openFilterSheet: () => void;
  closeFilterSheet: () => void;
  setIntentContext: (naturalQuery: string, interpretation: string) => void;
  clearIntentContext: () => void;
  setVisualContext: (imagePreview: string, interpretation: string) => void;
  clearVisualContext: () => void;
  setVisualSearchOpen: (open: boolean) => void;
  openVisualSearch: () => void;
  reset: () => void;
}

type SearchStore = SearchStoreState & SearchStoreActions;

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      recentSearches: [],
      recentlyViewedProducts: [],
      searchCount: 0,
      isSearchSheetOpen: false,
      isFilterSheetOpen: false,
      intentInterpretation: null,
      naturalQuery: null,
      visualInterpretation: null,
      visualImagePreview: null,
      isVisualSearchOpen: false,

      setSearchSheetOpen: (open) => set({ isSearchSheetOpen: open }),
      openSearchSheet: () => set({ isSearchSheetOpen: true }),
      closeSearchSheet: () => set({ isSearchSheetOpen: false }),
      setFilterSheetOpen: (open) => set({ isFilterSheetOpen: open }),
      openFilterSheet: () => set({ isFilterSheetOpen: true }),
      closeFilterSheet: () => set({ isFilterSheetOpen: false }),

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

      incrementSearchCount: () => set((state) => ({ searchCount: state.searchCount + 1 })),

      setIntentContext: (naturalQuery, interpretation) =>
        set({
          naturalQuery,
          intentInterpretation: interpretation,
          visualInterpretation: null,
          visualImagePreview: null
        }),

      clearIntentContext: () => set({ naturalQuery: null, intentInterpretation: null }),

      setVisualContext: (imagePreview, interpretation) =>
        set({
          visualImagePreview: imagePreview,
          visualInterpretation: interpretation,
          naturalQuery: null,
          intentInterpretation: null
        }),

      clearVisualContext: () => set({ visualImagePreview: null, visualInterpretation: null }),

      setVisualSearchOpen: (open) => set({ isVisualSearchOpen: open }),
      openVisualSearch: () => set({ isVisualSearchOpen: true }),

      reset: () =>
        set({
          recentSearches: [],
          recentlyViewedProducts: [],
          searchCount: 0,
          isSearchSheetOpen: false,
          isFilterSheetOpen: false,
          intentInterpretation: null,
          naturalQuery: null,
          visualInterpretation: null,
          visualImagePreview: null,
          isVisualSearchOpen: false
        })
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
