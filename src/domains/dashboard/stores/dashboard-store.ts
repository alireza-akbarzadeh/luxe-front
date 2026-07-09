import { create } from 'zustand';

interface DashboardStoreState {
  insightsExpanded: boolean;
  exportDialogOpen: boolean;
}

interface DashboardStoreActions {
  setInsightsExpanded: (expanded: boolean) => void;
  toggleInsightsExpanded: () => void;
  setExportDialogOpen: (open: boolean) => void;
  reset: () => void;
}

type DashboardStore = DashboardStoreState & DashboardStoreActions;

const initialState: DashboardStoreState = {
  insightsExpanded: true,
  exportDialogOpen: false
};

/** Client UI state for dashboard panels and export dialog visibility. */
export const useDashboardStore = create<DashboardStore>()((set) => ({
  ...initialState,
  setInsightsExpanded: (expanded) => set({ insightsExpanded: expanded }),
  toggleInsightsExpanded: () => set((state) => ({ insightsExpanded: !state.insightsExpanded })),
  setExportDialogOpen: (open) => set({ exportDialogOpen: open }),
  reset: () => set(initialState)
}));
