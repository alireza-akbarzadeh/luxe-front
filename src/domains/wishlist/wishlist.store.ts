'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products } from '../store/data';

export interface WishlistItem {
  id: number;
  addedAt: number;
  priceWhenAdded: number;
  notifyOnSale: boolean;
}

interface WishlistState {
  items: WishlistItem[];

  // Actions
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  toggleItem: (productId: number) => void;
  clearWishlist: () => void;
  toggleNotifyOnSale: (productId: number) => void;
  moveToCart: (productId: number) => void;

  // Queries
  isInWishlist: (productId: number) => boolean;
  getItemCount: () => number;
  getItems: () => Array<WishlistItem & { product: (typeof products)[0] | undefined }>;
  getPriceDrops: () => Array<WishlistItem & { product: (typeof products)[0]; priceDrop: number }>;
  getTotalSavings: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        set((state) => {
          if (state.items.some((item) => item.id === productId)) {
            return state;
          }
          return {
            items: [
              ...state.items,
              {
                id: productId,
                addedAt: Date.now(),
                priceWhenAdded: product.price,
                notifyOnSale: false
              }
            ]
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId)
        }));
      },

      toggleItem: (productId) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(productId)) {
          removeItem(productId);
        } else {
          addItem(productId);
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      toggleNotifyOnSale: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, notifyOnSale: !item.notifyOnSale } : item
          )
        }));
      },

      moveToCart: (productId) => {
        // This will be called from the UI which will also add to cart
        get().removeItem(productId);
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      getItemCount: () => {
        return get().items.length;
      },

      getItems: () => {
        return get().items.map((item) => ({
          ...item,
          product: products.find((p) => p.id === item.id)
        }));
      },

      getPriceDrops: () => {
        return get()
          .items.map((item) => {
            const product = products.find((p) => p.id === item.id);
            if (!product) return null;
            const priceDrop = item.priceWhenAdded - product.price;
            if (priceDrop <= 0) return null;
            return { ...item, product, priceDrop };
          })
          .filter(Boolean) as Array<
          WishlistItem & { product: (typeof products)[0]; priceDrop: number }
        >;
      },

      getTotalSavings: () => {
        return get().items.reduce((total, item) => {
          const product = products.find((p) => p.id === item.id);
          if (!product || !product.originalPrice) return total;
          return total + (product.originalPrice - product.price);
        }, 0);
      }
    }),
    {
      name: 'luxe-wishlist'
    }
  )
);
