'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DtoCartItemData } from '../services/-cart-items-post.schemas';

interface CartStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  items: DtoCartItemData[];
  setItems: (items: DtoCartItemData[]) => void;
  addOptimisticItem: (item: DtoCartItemData) => void;
  updateOptimisticQuantity: (id: number, quantity: number) => void;
  removeOptimisticItem: (id: number) => void;
  reset: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      isOpen: false,
      items: [],
      setOpen: (open) => set({ isOpen: open }),
      setItems: (items) => set({ items }),
      addOptimisticItem: (newItem) =>
        set((state) => ({
          items: [...state.items, newItem],
          isOpen: true
        })),
      updateOptimisticQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
        })),
      removeOptimisticItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        })),
      reset: () => set({ items: [], isOpen: false })
    }),
    {
      name: 'luxe-cart-ui',
      partialize: (state) => ({ isOpen: state.isOpen })
    }
  )
);
