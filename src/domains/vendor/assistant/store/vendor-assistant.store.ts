import { create } from 'zustand';

interface VendorAssistantState {
  isOpen: boolean;
}

interface VendorAssistantActions {
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
  reset: () => void;
}

type VendorAssistantStore = VendorAssistantState & VendorAssistantActions;

const initialState: VendorAssistantState = {
  isOpen: false
};

/** Client UI state for the vendor AI assistant sheet. */
export const useVendorAssistantStore = create<VendorAssistantStore>((set) => ({
  ...initialState,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setOpen: (open) => set({ isOpen: open }),
  reset: () => set({ ...initialState })
}));
