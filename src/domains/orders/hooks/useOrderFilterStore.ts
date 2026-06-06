// State type
import { create } from 'zustand';

export interface OrdersFilterState {
  advancedOpen: boolean;
  selected: Record<string, boolean>;
}

// Actions type
export interface OrdersFilterActions {
  setAdvancedOpen: (open: boolean) => void;
  setSelected: (selected: Record<string, boolean>) => void;
  toggleRow: (id: string) => void;
  clearSelected: () => void;
}

// Combined store type (state + actions)
export type OrdersFilterStore = OrdersFilterState & OrdersFilterActions;

export const useOrdersFilterStore = create<OrdersFilterStore>((set) => ({
  advancedOpen: false,
  setAdvancedOpen: (open) => set({ advancedOpen: open }),
  selected: {},
  setSelected: (selected) => set({ selected }),
  toggleRow: (id) => set((s) => ({ selected: { ...s.selected, [id]: !s.selected[id] } })),
  clearSelected: () => set({ selected: {} })
}));
