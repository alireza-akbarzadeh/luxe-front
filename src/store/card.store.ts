'use client';
import { create } from 'zustand';

interface CartStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>()((set) => ({
  isOpen: false,
  items: [],
  setOpen: (open) => set({ isOpen: open })
}));
