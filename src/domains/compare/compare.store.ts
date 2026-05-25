'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products } from '../store/data';

const MAX_COMPARE_ITEMS = 4;

interface CompareState {
  items: number[];

  // Actions
  addItem: (productId: number) => boolean;
  removeItem: (productId: number) => void;
  toggleItem: (productId: number) => boolean;
  clearAll: () => void;

  // Queries
  isInCompare: (productId: number) => boolean;
  getItemCount: () => number;
  getItems: () => Array<(typeof products)[0]>;
  canAddMore: () => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        if (!get().canAddMore()) return false;
        if (get().isInCompare(productId)) return false;

        const product = products?.find((p) => p.id === productId);
        if (!product) return false;

        set((state) => ({
          items: [...state.items, productId]
        }));
        return true;
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId)
        }));
      },

      toggleItem: (productId) => {
        const { isInCompare, addItem, removeItem } = get();
        if (isInCompare(productId)) {
          removeItem(productId);
          return false;
        } else {
          return addItem(productId);
        }
      },

      clearAll: () => {
        set({ items: [] });
      },

      isInCompare: (productId) => {
        return get().items.includes(productId);
      },

      getItemCount: () => {
        return get().items.length;
      },

      getItems: () => {
        return get()
          .items.map((id) => products?.find((p) => p.id === id))
          .filter(Boolean) as Array<(typeof products)[0]>;
      },

      canAddMore: () => {
        return get().items.length < MAX_COMPARE_ITEMS;
      }
    }),
    {
      name: 'luxe-compare'
    }
  )
);

export const MAX_COMPARE = MAX_COMPARE_ITEMS;
