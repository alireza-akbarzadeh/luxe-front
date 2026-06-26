import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VendorPanelState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  commandOpen: boolean;
  notificationsOpen: boolean;
  activeStoreId: number;
  activeStoreName: string;
  activeStoreSlug: string;
  productViewMode: 'grid' | 'table';
}

interface VendorPanelActions {
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setActiveStore: (store: { id: number; name: string; slug: string }) => void;
  setProductViewMode: (mode: 'grid' | 'table') => void;
  reset: () => void;
}

type VendorPanelStore = VendorPanelState & VendorPanelActions;

const initialState: VendorPanelState = {
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  commandOpen: false,
  notificationsOpen: false,
  activeStoreId: 0,
  activeStoreName: '',
  activeStoreSlug: '',
  productViewMode: 'table'
};

/** Client UI state for the vendor dashboard shell (not server data). */
export const useVendorPanelStore = create<VendorPanelStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebarCollapsed: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      setCommandOpen: (open) => set({ commandOpen: open }),
      setNotificationsOpen: (open) => set({ notificationsOpen: open }),
      setActiveStore: (store) =>
        set({
          activeStoreId: store.id,
          activeStoreName: store.name,
          activeStoreSlug: store.slug
        }),
      setProductViewMode: (mode) => set({ productViewMode: mode }),
      reset: () => set(initialState)
    }),
    {
      name: 'luxe-vendor-panel',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        activeStoreId: state.activeStoreId,
        activeStoreName: state.activeStoreName,
        activeStoreSlug: state.activeStoreSlug,
        productViewMode: state.productViewMode
      })
    }
  )
);
