import { create } from 'zustand';

interface AdminShellStoreState {
  searchOpen: boolean;
  isSidebarCollapsed: boolean;
  notificationOpen: boolean;
  mobileSidebarOpen: boolean;
}

interface AdminShellStoreActions {
  setSearchOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (open: boolean) => void;
  setNotificationOpen: (open: boolean) => void;
  reset: () => void;
}

type AdminShellStore = AdminShellStoreState & AdminShellStoreActions;

const initialState: AdminShellStoreState = {
  searchOpen: false,
  isSidebarCollapsed: false,
  notificationOpen: false,
  mobileSidebarOpen: false
};

/** Client UI state for admin shell overlays and sidebar layout. */
export const useAdminShellStore = create<AdminShellStore>()((set) => ({
  ...initialState,
  setSidebarCollapsed: (state) => set({ isSidebarCollapsed: state }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  setNotificationOpen: (open) => set({ notificationOpen: open }),
  reset: () => set(initialState)
}));

/** @deprecated Use useAdminShellStore */
export const useDashboardStore = useAdminShellStore;
