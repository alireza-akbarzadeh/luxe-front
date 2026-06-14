'use client';

import { create } from 'zustand';

interface CartStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>()((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false })
}));
