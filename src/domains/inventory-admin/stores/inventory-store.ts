import { create } from 'zustand';

import type { DtoInventoryItemResponse } from '@/services/-admin-inventory.schemas';

interface InventoryStoreState {
  adjustTarget: DtoInventoryItemResponse | null;
  historyProductId: number | null;
}

interface InventoryStoreActions {
  openAdjust: (item: DtoInventoryItemResponse) => void;
  closeAdjust: () => void;
  openHistory: (productId: number) => void;
  closeHistory: () => void;
  reset: () => void;
}

type InventoryStore = InventoryStoreState & InventoryStoreActions;

const initialState: InventoryStoreState = {
  adjustTarget: null,
  historyProductId: null
};

/** Client UI state for inventory adjust dialog and history sheet. */
export const useInventoryStore = create<InventoryStore>()((set) => ({
  ...initialState,
  openAdjust: (item) => set({ adjustTarget: item, historyProductId: null }),
  closeAdjust: () => set({ adjustTarget: null }),
  openHistory: (productId) => set({ historyProductId: productId, adjustTarget: null }),
  closeHistory: () => set({ historyProductId: null }),
  reset: () => set(initialState)
}));
