import { create } from 'zustand';

import type { DtoInventoryItemResponse } from '@/services/-admin-inventory.schemas';

interface InventoryStoreState {
  adjustTarget: DtoInventoryItemResponse | null;
  historyProductId: number | null;
  bulkReceiveOpen: boolean;
}

interface InventoryStoreActions {
  openAdjust: (item: DtoInventoryItemResponse) => void;
  closeAdjust: () => void;
  openHistory: (productId: number) => void;
  closeHistory: () => void;
  openBulkReceive: () => void;
  closeBulkReceive: () => void;
  reset: () => void;
}

type InventoryStore = InventoryStoreState & InventoryStoreActions;

const initialState: InventoryStoreState = {
  adjustTarget: null,
  historyProductId: null,
  bulkReceiveOpen: false
};

/** Client UI state for inventory adjust dialog and history sheet. */
export const useInventoryStore = create<InventoryStore>()((set) => ({
  ...initialState,
  openAdjust: (item) => set({ adjustTarget: item, historyProductId: null }),
  closeAdjust: () => set({ adjustTarget: null }),
  openHistory: (productId) => set({ historyProductId: productId, adjustTarget: null }),
  closeHistory: () => set({ historyProductId: null }),
  openBulkReceive: () => set({ bulkReceiveOpen: true, adjustTarget: null, historyProductId: null }),
  closeBulkReceive: () => set({ bulkReceiveOpen: false }),
  reset: () => set(initialState)
}));
