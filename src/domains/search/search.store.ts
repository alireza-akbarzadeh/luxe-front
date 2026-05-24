'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { productCategories } from '@/lib/data';
import { products, stores } from '../store/data';

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount: number;
}

export interface SearchSuggestion {
  type: 'product' | 'store' | 'category' | 'query';
  id?: number | string;
  name: string;
  image?: string;
  price?: number;
  category?: string;
  slug?: string;
}

interface SearchStore {
  // Recent searches
  recentSearches: SearchHistoryItem[];
  addRecentSearch: (query: string, resultCount: number) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Search suggestions
  getSuggestions: (query: string) => SearchSuggestion[];

  // Trending searches (static for demo)
  trendingSearches: string[];

  // Popular categories
  popularCategories: string[];

  // Recently viewed products
  recentlyViewedProducts: number[];
  addRecentlyViewedProduct: (productId: number) => void;
  clearRecentlyViewedProducts: () => void;

  // Search analytics
  searchCount: number;
  incrementSearchCount: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      trendingSearches: [
        'wireless headphones',
        'leather bag',
        'minimalist watch',
        'smart speaker',
        'design system',
        'running shoes'
      ],
      popularCategories: [
        'Electronics',
        'Accessories',
        'Home',
        'Watches',
        'Sneakers',
        'Design Assets'
      ],
      recentlyViewedProducts: [],
      searchCount: 0,

      addRecentSearch: (query: string, resultCount: number) => {
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

      removeRecentSearch: (query: string) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter(
            (s) => s.query.toLowerCase() !== query.toLowerCase()
          )
        }));
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      getSuggestions: (query: string): SearchSuggestion[] => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        const suggestions: SearchSuggestion[] = [];

        // Match products
        const matchedProducts = products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q)
          )
          .slice(0, 4)
          .map((p) => ({
            type: 'product' as const,
            id: p.id,
            name: p.name,
            image: p.image,
            price: p.price,
            category: p.category
          }));
        suggestions.push(...matchedProducts);

        // Match stores
        const matchedStores = stores
          .filter(
            (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
          )
          .slice(0, 2)
          .map((s) => ({
            type: 'store' as const,
            id: s.id,
            name: s.name,
            image: s.logo,
            slug: s.slug
          }));
        suggestions.push(...matchedStores);

        // Match categories
        const matchedCategories = productCategories
          .filter((c) => c.toLowerCase().includes(q) && c !== 'All')
          .slice(0, 3)
          .map((c) => ({
            type: 'category' as const,
            name: c
          }));
        suggestions.push(...matchedCategories);

        return suggestions.slice(0, 8);
      },

      addRecentlyViewedProduct: (productId: number) => {
        set((state) => {
          const filtered = state.recentlyViewedProducts.filter((id) => id !== productId);
          return {
            recentlyViewedProducts: [productId, ...filtered].slice(0, 12)
          };
        });
      },

      clearRecentlyViewedProducts: () => {
        set({ recentlyViewedProducts: [] });
      },

      incrementSearchCount: () => {
        set((state) => ({ searchCount: state.searchCount + 1 }));
      }
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
