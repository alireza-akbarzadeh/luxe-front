'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DtoCartItemDetail } from '../services/-cart-get.schemas';

interface CartStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  items: DtoCartItemDetail[];
  setItems: (items: DtoCartItemDetail[]) => void;
  addOptimisticItem: (item: DtoCartItemDetail) => void;
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
          items: [
            ...state.items,
            {
              id: Date.now(),
              product_id: newItem.product_id,
              quantity: newItem.quantity,
              selected_color: newItem.selected_color,
              selected_size: newItem.selected_size
            }
          ],
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
