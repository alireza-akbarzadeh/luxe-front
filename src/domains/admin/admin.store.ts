// store/dashboard-store.ts
import { create } from 'zustand';

// Types for our State
export type NotificationType = 'system' | 'alert' | 'message';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: NotificationType;
}

export interface MessageItem {
  id: string;
  user: string;
  preview: string;
  time: string;
  unread: boolean;
}

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
  notifications: NotificationItem[];
  messages: MessageItem[];
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
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'read' | 'time'>) => void;
  setNotificationOpen: (open: boolean) => void;
  markMessageRead: (id: string) => void;
}

export const useDashboardStore = create<DashboardState & DashboardActions>()((set) => ({
  // initial state
  notifications: [
    {
      id: '1',
      title: 'New System Update',
      description: 'v2.4.0 is now live.',
      time: '2m ago',
      read: false,
      type: 'system'
    },
    {
      id: '2',
      title: 'Server Warning',
      description: 'High CPU usage detected.',
      time: '15m ago',
      read: false,
      type: 'alert'
    }
  ],
  messages: [
    {
      id: '1',
      user: 'John Doe',
      preview: "Hey, I can't access the library...",
      time: '1h ago',
      unread: true
    }
  ],
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

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    })),

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        {
          ...notif,
          id: Math.random().toString(),
          read: false,
          time: 'Just now'
        },
        ...state.notifications
      ]
    })),

  setNotificationOpen: (open) => set({ notificationOpen: open }),

  markMessageRead: (id) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, unread: false } : m))
    }))
}));
