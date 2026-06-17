import { create } from 'zustand';

import type { DtoAdminSalesFeedSnapshotResponse } from '@/services/-admin-sales-feed-snapshot-get.schemas';

import { normalizeStatusKey, SALES_FEED_STATUS_KEYS, type SalesFeedStatusKey } from './constants';

export type SaleEventType =
  | 'new_order'
  | 'status_change'
  | 'cancellation'
  | 'shipment'
  | 'payment'
  | 'refund';

export type SaleEvent = {
  id: string;
  type: SaleEventType;
  title: string;
  subtitle: string;
  amount?: number;
  timestamp: number | Date;
};

export type RevenueSnapshot = {
  time: string;
  revenue: number;
  orders: number;
};

export type StatusCounts = Record<SalesFeedStatusKey, number>;

const INITIAL_STATUS_COUNTS = SALES_FEED_STATUS_KEYS.reduce((acc, key) => {
  acc[key] = 0;
  return acc;
}, {} as StatusCounts);

const MAX_REVENUE_POINTS = 30;
const MAX_EVENTS = 60;

function mapStatusCounts(rows?: { status?: string; count?: number }[]): StatusCounts {
  const counts = { ...INITIAL_STATUS_COUNTS };
  for (const row of rows ?? []) {
    const key = row.status ? normalizeStatusKey(row.status) : null;
    if (key) counts[key] = row.count ?? 0;
  }
  return counts;
}

function mapSnapshotEvents(
  events?: DtoAdminSalesFeedSnapshotResponse['recent_events']
): SaleEvent[] {
  return (events ?? []).map((event) => ({
    id: event.id ?? String(event.timestamp ?? Date.now()),
    type: (event.type as SaleEventType) ?? 'status_change',
    title: event.title ?? 'Activity',
    subtitle: event.subtitle ?? '',
    amount: event.amount,
    timestamp: event.timestamp ?? Date.now()
  }));
}

function mapRevenueSeries(
  series?: DtoAdminSalesFeedSnapshotResponse['revenue_series']
): RevenueSnapshot[] {
  return (series ?? []).map((point) => ({
    time: point.date ?? '',
    revenue: point.revenue ?? 0,
    orders: point.orders ?? 0
  }));
}

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
  snapshotLoaded: boolean;
  lastRevDelta: number;
  lastOrderDelta: number;

  setPaused: (paused: boolean) => void;
  setConnected: (connected: boolean) => void;
  clearEvents: () => void;
  hydrateFromSnapshot: (snapshot: DtoAdminSalesFeedSnapshotResponse) => void;
  ingestEvent: (evt: SaleEvent) => void;
  ingestRevenueSnapshot: (snap: RevenueSnapshot) => void;
  setActiveUsers: (n: number) => void;
  setEventsPerMin: (n: number) => void;
}

export const useSalesFeedStore = create<SalesFeedState>((set, get) => ({
  events: [],
  revenueData: [],
  statusCounts: INITIAL_STATUS_COUNTS,
  totalOrders: 0,
  totalRevenue: 0,
  activeUsers: 0,
  eventsPerMin: 0,
  paused: false,
  connected: false,
  snapshotLoaded: false,
  lastRevDelta: 0,
  lastOrderDelta: 0,

  setPaused: (paused) => set({ paused }),
  setConnected: (connected) => set({ connected }),
  clearEvents: () => set({ events: [] }),

  hydrateFromSnapshot: (snapshot) => {
    set({
      snapshotLoaded: true,
      totalOrders: snapshot.total_orders_today ?? 0,
      totalRevenue: snapshot.total_revenue_today ?? 0,
      statusCounts: mapStatusCounts(snapshot.status_counts),
      events: mapSnapshotEvents(snapshot.recent_events),
      revenueData: mapRevenueSeries(snapshot.revenue_series)
    });
  },

  ingestEvent: (evt) => {
    if (get().paused) return;

    set((state) => {
      const events = [evt, ...state.events].slice(0, MAX_EVENTS);
      let totalOrders = state.totalOrders;
      let totalRevenue = state.totalRevenue;
      let lastOrderDelta = state.lastOrderDelta;
      const statusCounts = { ...state.statusCounts };

      if (evt.type === 'new_order' || evt.type === 'payment') {
        totalOrders += 1;
        totalRevenue += evt.amount ?? 0;
        lastOrderDelta = 2.1;
        statusCounts.paid += 1;
      }

      if (evt.type === 'cancellation') {
        statusCounts.cancelled += 1;
      }

      if (evt.type === 'refund') {
        statusCounts.refunded += 1;
      }

      if (evt.type === 'shipment') {
        statusCounts.shipped += 1;
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

  setActiveUsers: (n) => set({ activeUsers: Math.max(0, n) }),
  setEventsPerMin: (n) => set({ eventsPerMin: Math.max(0, n) })
}));
