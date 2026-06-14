import { useEffect, useRef } from 'react';

import { useRealtime, useRealtimeSubscribe } from '@/lib/realtime/realtime-provider';
import { SALES_FEED_ROOM } from '@/lib/realtime/ws-client';

import { generateEvent, generateRevenueSnapshot } from '../mock-data';
import { type RevenueSnapshot, type SaleEvent, useSalesFeedStore } from '../sales-store';

type SalesFeedMessage =
  | { type: 'event'; payload: SaleEvent }
  | { type: 'revenue_snapshot'; payload: RevenueSnapshot }
  | { type: 'active_users'; payload: number }
  | { type: 'events_per_min'; payload: number };

const USE_MOCK = process.env['NEXT_PUBLIC_SALES_FEED_MOCK'] === 'true';

function isSalesFeedMessage(value: unknown): value is SalesFeedMessage {
  if (!value || typeof value !== 'object' || !('type' in value)) return false;
  return typeof (value as { type: unknown }).type === 'string';
}

/**
 * Connects the live sales dashboard to the shared backend WebSocket feed.
 * Falls back to a local mock simulator when mock mode is enabled.
 */
export function useSalesFeedSocket() {
  const { joinRoom, status } = useRealtime();
  const ingestEvent = useSalesFeedStore((s) => s.ingestEvent);
  const ingestRevenueSnapshot = useSalesFeedStore((s) => s.ingestRevenueSnapshot);
  const setActiveUsers = useSalesFeedStore((s) => s.setActiveUsers);
  const setEventsPerMin = useSalesFeedStore((s) => s.setEventsPerMin);
  const setConnected = useSalesFeedStore((s) => s.setConnected);

  const eventCountRef = useRef(0);
  const windowStartRef = useRef(0);

  useEffect(() => {
    windowStartRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (USE_MOCK) {
      setConnected(true);
      let tickCount = 0;
      let epmBucket = 0;
      const TICK_MS = 2200;
      const ticksPerMin = Math.round(60_000 / TICK_MS);

      const interval = setInterval(() => {
        tickCount += 1;
        epmBucket += 1;

        ingestEvent(generateEvent());

        if (tickCount % 3 === 0) {
          ingestRevenueSnapshot(generateRevenueSnapshot());
        }

        const currentUsers = useSalesFeedStore.getState().activeUsers;
        setActiveUsers(currentUsers + (Math.random() > 0.5 ? 1 : -1));

        if (tickCount % ticksPerMin === 0) {
          setEventsPerMin(epmBucket);
          epmBucket = 0;
        }
      }, TICK_MS);

      return () => {
        clearInterval(interval);
        setConnected(false);
      };
    }

    joinRoom(SALES_FEED_ROOM);
  }, [ingestEvent, ingestRevenueSnapshot, joinRoom, setActiveUsers, setConnected, setEventsPerMin]);

  useEffect(() => {
    if (USE_MOCK) return;
    setConnected(status === 'connected');
  }, [setConnected, status]);

  useRealtimeSubscribe((raw) => {
    if (USE_MOCK || !isSalesFeedMessage(raw)) return;

    switch (raw.type) {
      case 'event':
        ingestEvent({
          ...raw.payload,
          timestamp: raw.payload.timestamp ?? Date.now()
        });
        eventCountRef.current += 1;
        break;
      case 'revenue_snapshot':
        ingestRevenueSnapshot(raw.payload);
        break;
      case 'active_users':
        setActiveUsers(raw.payload);
        break;
      case 'events_per_min':
        setEventsPerMin(raw.payload);
        break;
    }

    const elapsedMinutes = (Date.now() - windowStartRef.current) / 60_000;
    if (elapsedMinutes >= 1) {
      setEventsPerMin(eventCountRef.current);
      eventCountRef.current = 0;
      windowStartRef.current = Date.now();
    }
  });
}
