import { create } from 'zustand';

import { STATUS_COLORS } from './mock-data';

export type SaleEvent = {
  id: string;
  type: 'new_order' | 'status_change' | 'cancellation' | 'shipment';
  message: string;
  amount?: number;
  timestamp: number;
};

export type RevenueSnapshot = {
  timestamp: number;
  revenue: number;
};

export type StatusCounts = Record<keyof typeof STATUS_COLORS, number>;

const INITIAL_STATUS_COUNTS: StatusCounts = {
  Pending: 12,
  Processing: 8,
  Fulfilled: 34,
  Shipped: 21,
  Delivered: 55,
  Cancelled: 7,
  Refunded: 4
};

const MAX_REVENUE_POINTS = 30;
const MAX_EVENTS = 60;

interface SalesFeedState {
  events: SaleEvent[];
  revenueData: RevenueSnapshot[];
  statusCounts: StatusCounts;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  eventsPerMin: number;
  paused: boolean;
  connected: boolean;
  lastRevDelta: number;
  lastOrderDelta: number;

  setPaused: (paused: boolean) => void;
  setConnected: (connected: boolean) => void;
  clearEvents: () => void;
  ingestEvent: (evt: SaleEvent) => void;
  ingestRevenueSnapshot: (snap: RevenueSnapshot) => void;
  setActiveUsers: (n: number) => void;
  setEventsPerMin: (n: number) => void;
  hydrate: (events: SaleEvent[], revenueData: RevenueSnapshot[]) => void;
}

export const useSalesFeedStore = create<SalesFeedState>((set, get) => ({
  events: [],
  revenueData: [],
  statusCounts: INITIAL_STATUS_COUNTS,
  totalOrders: 141,
  totalRevenue: 24850.5,
  activeUsers: 38,
  eventsPerMin: 0,
  paused: false,
  connected: false,
  lastRevDelta: 0,
  lastOrderDelta: 0,

  setPaused: (paused) => set({ paused }),
  setConnected: (connected) => set({ connected }),
  clearEvents: () => set({ events: [] }),

  hydrate: (events, revenueData) => set({ events, revenueData }),

  ingestEvent: (evt) => {
    if (get().paused) return;

    set((state) => {
      const events = [evt, ...state.events].slice(0, MAX_EVENTS);
      const statusCounts = { ...state.statusCounts };
      let totalOrders = state.totalOrders;
      let totalRevenue = state.totalRevenue;
      let lastOrderDelta = state.lastOrderDelta;

      switch (evt.type) {
        case 'new_order':
          totalOrders += 1;
          lastOrderDelta = 2.1;
          totalRevenue += evt.amount ?? 0;
          statusCounts.Pending += 1;
          break;
        case 'status_change':
          statusCounts.Processing += 1;
          statusCounts.Pending = Math.max(0, statusCounts.Pending - 1);
          break;
        case 'cancellation':
          statusCounts.Cancelled += 1;
          break;
        case 'shipment':
          statusCounts.Shipped += 1;
          statusCounts.Fulfilled = Math.max(0, statusCounts.Fulfilled - 1);
          break;
      }

      return { events, statusCounts, totalOrders, totalRevenue, lastOrderDelta };
    });
  },

  ingestRevenueSnapshot: (snap) => {
    if (get().paused) return;

    set((state) => {
      const prevVal = state.revenueData[state.revenueData.length - 1]?.revenue ?? snap.revenue;
      const lastRevDelta = prevVal === 0 ? 0 : ((snap.revenue - prevVal) / prevVal) * 100;
      const revenueData = [...state.revenueData, snap].slice(-MAX_REVENUE_POINTS);
      return { revenueData, lastRevDelta };
    });
  },

  setActiveUsers: (n) => set({ activeUsers: Math.max(5, Math.min(120, n)) }),
  setEventsPerMin: (n) => set({ eventsPerMin: n })
}));
