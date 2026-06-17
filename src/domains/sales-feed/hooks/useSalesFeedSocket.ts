import { useCallback, useEffect, useRef } from 'react';

import { useRoomSubscription } from '@/lib/realtime/use-room-subscription';
import { SALES_FEED_ROOM } from '@/lib/realtime/ws-client';
import { getAdminSalesFeedSnapshot } from '@/services/-admin-sales-feed-snapshot-get';

import {
  handleSalesFeedMessage,
  parseSalesFeedMessage
} from '../lib/sales-feed-messages';
import { generateEvent, generateRevenueSnapshot } from '../mock-data';
import { useSalesFeedStore } from '../sales-store';

const USE_MOCK = process.env['NEXT_PUBLIC_SALES_FEED_MOCK'] === 'true';

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
  const windowStartRef = useRef(Date.now());

  const actions = {
    ingestEvent,
    ingestRevenueSnapshot,
    setActiveUsers,
    setEventsPerMin
  };

  useEffect(() => {
    if (USE_MOCK || snapshotLoaded) return;

    void getAdminSalesFeedSnapshot()
      .then((response) => {
        if (response.data) {
          hydrateFromSnapshot(response.data);
        }
      })
      .catch(() => {
        // Snapshot failure should not block live WebSocket updates.
      });
  }, [hydrateFromSnapshot, snapshotLoaded]);

  const onMessage = useCallback(
    (raw: unknown) => {
      const message = parseSalesFeedMessage(raw);
      if (!message) return;

      handleSalesFeedMessage(message, actions);

      if (message.type === 'event') {
        eventCountRef.current += 1;
        const elapsedMinutes = (Date.now() - windowStartRef.current) / 60_000;
        if (elapsedMinutes >= 1) {
          setEventsPerMin(eventCountRef.current);
          eventCountRef.current = 0;
          windowStartRef.current = Date.now();
        }
      }
    },
    [ingestEvent, ingestRevenueSnapshot, setActiveUsers, setEventsPerMin]
  );

  const { status } = useRoomSubscription(SALES_FEED_ROOM, onMessage, {
    enabled: !USE_MOCK
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
  }, [
    ingestEvent,
    ingestRevenueSnapshot,
    setActiveUsers,
    setConnected,
    setEventsPerMin,
    status
  ]);
}
