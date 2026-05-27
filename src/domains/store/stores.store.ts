import { create } from 'zustand';
type UIState = {
  filterDrawerOpen: boolean;
  hoveredStoreId: number | null;
  quickPreviewId: number | null;
  setFilterDrawerOpen: (open: boolean) => void;
  setHoveredStoreId: (id: number | null) => void;
  setQuickPreviewId: (id: number | null) => void;
};
export const useUIStore = create<UIState>((set) => ({
  filterDrawerOpen: false,
  hoveredStoreId: null,
  quickPreviewId: null,
  setFilterDrawerOpen: (filterDrawerOpen) => set({ filterDrawerOpen }),
  setHoveredStoreId: (hoveredStoreId) => set({ hoveredStoreId }),
  setQuickPreviewId: (quickPreviewId) => set({ quickPreviewId })
}));
