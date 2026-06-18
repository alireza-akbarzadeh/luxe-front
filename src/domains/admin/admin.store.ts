// store/dashboard-store.ts
import { create } from 'zustand';

// Types for our State
export type TimePeriod = '24h' | '7d' | '30d';

export type SubscriptionTier = 'Free' | 'Standard' | 'Premium' | 'All';
export type RiskLevel = 'all' | 'safe' | 'medium' | 'high';

export interface FilterState {
  dateRange: { from: Date | undefined; to: Date | undefined };
  verifiedOnly: boolean;
  tiers: SubscriptionTier[];
  region: string;
  riskThreshold: RiskLevel;
}

export interface DashboardState {
  searchOpen: boolean;
  isSidebarCollapsed: boolean;
  notificationOpen: boolean;
  mobileSidebarOpen: boolean;
  selectedPeriod: TimePeriod;
  stats: {
    revenue: number;
    subscribers: number;
    watchTime: number;
  };
  filters: FilterState;
}

interface DashboardActions {
  updateFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
  setPeriod: (period: TimePeriod) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (open: boolean) => void;
  setNotificationOpen: (open: boolean) => void;
}

export const useDashboardStore = create<DashboardState & DashboardActions>()((set) => ({
  // initial state
  searchOpen: false,
  isSidebarCollapsed: false,
  notificationOpen: false,
  mobileSidebarOpen: false,
  selectedPeriod: '24h',
  stats: {
    revenue: 0,
    subscribers: 0,
    watchTime: 0
  },
  filters: {
    dateRange: { from: undefined, to: undefined },
    verifiedOnly: true,
    tiers: ['Premium'],
    region: 'all',
    riskThreshold: 'safe'
  },

  // actions
  updateFilters: (updates) =>
    set((state) => {
      // Check if the values are actually different
      const isDifferent = Object.entries(updates).some(
        ([key, value]) =>
          JSON.stringify(state.filters[key as keyof FilterState]) !== JSON.stringify(value)
      );
      if (!isDifferent) return {};
      return {
        filters: { ...state.filters, ...updates }
      };
    }),

  resetFilters: () =>
    set({
      filters: {
        dateRange: { from: undefined, to: undefined },
        verifiedOnly: false,
        tiers: ['All'],
        region: 'all',
        riskThreshold: 'all'
      }
    }),

  setPeriod: (period) => set({ selectedPeriod: period }),
  setSidebarCollapsed: (state) => set({ isSidebarCollapsed: state }),

  setSearchOpen: (open) => set({ searchOpen: open }),

  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  setNotificationOpen: (open) => set({ notificationOpen: open })
}));
