import { useCallback, useEffect, useRef } from 'react';

import { useRoomSubscription } from '@/lib/realtime/use-room-subscription';
import { SALES_FEED_ROOM } from '@/lib/realtime/ws-client';
import { useGetAdminSalesFeedSnapshot } from '@/services/-admin-sales-feed-snapshot-get';

import { handleSalesFeedMessage, parseSalesFeedMessage } from '../lib/sales-feed-messages';
import { generateEvent, generateRevenueSnapshot } from '../mock-data';
import { useSalesFeedStore } from '../sales-store';

const USE_MOCK = process.env['NEXT_PUBLIC_SALES_FEED_MOCK'] === 'true';

const SALES_FEED_MESSAGE_TYPES = new Set([
  'event',
  'revenue_snapshot',
  'active_users',
  'events_per_min'
]);

/**
 * Loads the REST snapshot, then streams live sales activity over the shared admin WebSocket.
 * Mock mode is opt-in via NEXT_PUBLIC_SALES_FEED_MOCK=true for local demos.
 */
export function useSalesFeedSocket() {
  const ingestEvent = useSalesFeedStore((s) => s.ingestEvent);
  const ingestRevenueSnapshot = useSalesFeedStore((s) => s.ingestRevenueSnapshot);
  const setActiveUsers = useSalesFeedStore((s) => s.setActiveUsers);
  const setEventsPerMin = useSalesFeedStore((s) => s.setEventsPerMin);
  const setConnected = useSalesFeedStore((s) => s.setConnected);
  const hydrateFromSnapshot = useSalesFeedStore((s) => s.hydrateFromSnapshot);
  const snapshotLoaded = useSalesFeedStore((s) => s.snapshotLoaded);

  const eventCountRef = useRef(0);
  const windowStartRef = useRef<number | null>(null);
  const actionsRef = useRef({
    ingestEvent,
    ingestRevenueSnapshot,
    setActiveUsers,
    setEventsPerMin
  });

  useEffect(() => {
    actionsRef.current = {
      ingestEvent,
      ingestRevenueSnapshot,
      setActiveUsers,
      setEventsPerMin
    };
  }, [ingestEvent, ingestRevenueSnapshot, setActiveUsers, setEventsPerMin]);

  const { data: snapshotResponse, isSuccess, isLoading, isError, error } =
    useGetAdminSalesFeedSnapshot({
      query: {
        enabled: !USE_MOCK,
        staleTime: 30_000,
        retry: 1
      }
    });

  useEffect(() => {
    if (USE_MOCK || snapshotLoaded || !isSuccess || !snapshotResponse?.data) return;
    hydrateFromSnapshot(snapshotResponse.data);
  }, [hydrateFromSnapshot, isSuccess, snapshotLoaded, snapshotResponse?.data]);

  const onMessage = useCallback((raw: unknown) => {
    const messageType =
      typeof raw === 'object' && raw !== null && 'type' in raw
        ? (raw as { type?: string }).type
        : undefined;

    if (!messageType || !SALES_FEED_MESSAGE_TYPES.has(messageType)) {
      return;
    }

    const message = parseSalesFeedMessage(raw);
    if (!message) return;

    handleSalesFeedMessage(message, actionsRef.current);

    if (message.type === 'event') {
      const now = Date.now();
      if (windowStartRef.current === null) {
        windowStartRef.current = now;
      }

      eventCountRef.current += 1;
      const elapsedMinutes = (now - windowStartRef.current) / 60_000;
      if (elapsedMinutes >= 1) {
        actionsRef.current.setEventsPerMin(eventCountRef.current);
        eventCountRef.current = 0;
        windowStartRef.current = now;
      }
    }
  }, []);

  const { status } = useRoomSubscription(SALES_FEED_ROOM, onMessage, {
    enabled: !USE_MOCK && !isError
  });

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

        setActiveUsers(useSalesFeedStore.getState().activeUsers + (Math.random() > 0.5 ? 1 : -1));

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

    setConnected(status === 'connected');
  }, [ingestEvent, ingestRevenueSnapshot, setActiveUsers, setConnected, setEventsPerMin, status]);

  return {
    isLoading: USE_MOCK ? false : isLoading,
    isError: USE_MOCK ? false : isError,
    error
  };
}
