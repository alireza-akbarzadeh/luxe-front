import { create } from 'zustand';

interface ShoppingAssistantState {
  isOpen: boolean;
}

interface ShoppingAssistantActions {
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
  reset: () => void;
}

type ShoppingAssistantStore = ShoppingAssistantState & ShoppingAssistantActions;

const initialState: ShoppingAssistantState = {
  isOpen: false
};

/** Client UI state for the store-wide AI shopping assistant sheet. */
export const useShoppingAssistantStore = create<ShoppingAssistantStore>((set) => ({
  ...initialState,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setOpen: (open) => set({ isOpen: open }),
  reset: () => set({ ...initialState })
}));
