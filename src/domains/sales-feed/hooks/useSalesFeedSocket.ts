import { useEffect, useRef } from 'react';

import { generateEvent, generateRevenueSnapshot } from '../mock-data';
import { type RevenueSnapshot, type SaleEvent, useSalesFeedStore } from '../sales-store';

type IncomingMessage =
  | { type: 'event'; payload: SaleEvent }
  | { type: 'revenue_snapshot'; payload: RevenueSnapshot }
  | { type: 'active_users'; payload: number }
  | { type: 'events_per_min'; payload: number };

const WS_URL = process.env.NEXT_PUBLIC_SALES_FEED_WS_URL;

/**
 * Connects to a sales-feed WebSocket and pipes messages into the Zustand store.
 * Falls back to an in-browser mock simulator if NEXT_PUBLIC_SALES_FEED_WS_URL
 * is not set, so the UI keeps working in local/dev without a backend.
 */
export function useSalesFeedSocket() {
  const ingestEvent = useSalesFeedStore((s) => s.ingestEvent);
  const ingestRevenueSnapshot = useSalesFeedStore((s) => s.ingestRevenueSnapshot);
  const setActiveUsers = useSalesFeedStore((s) => s.setActiveUsers);
  const setEventsPerMin = useSalesFeedStore((s) => s.setEventsPerMin);
  const setConnected = useSalesFeedStore((s) => s.setConnected);
  const activeUsers = useSalesFeedStore((s) => s.activeUsers);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!WS_URL) {
      // ── Mock simulator fallback ──────────────────────────────────────
      setConnected(true);
      let tickCount = 0;
      let epmBucket = 0;
      const TICK_MS = 2200;
      const ticksPerMin = Math.round(60000 / TICK_MS);

      const interval = setInterval(() => {
        tickCount += 1;
        epmBucket += 1;

        ingestEvent(generateEvent() as SaleEvent);

        if (tickCount % 3 === 0) {
          ingestRevenueSnapshot(generateRevenueSnapshot());
        }

        setActiveUsers(activeUsers + (Math.random() > 0.5 ? 1 : -1));

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

    // ── Real WebSocket connection ────────────────────────────────────
    let cancelled = false;

    function connect() {
      const ws = new WebSocket(WS_URL!);
      socketRef.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const msg: IncomingMessage = JSON.parse(event.data);
          switch (msg.type) {
            case 'event':
              ingestEvent(msg.payload);
              break;
            case 'revenue_snapshot':
              ingestRevenueSnapshot(msg.payload);
              break;
            case 'active_users':
              setActiveUsers(msg.payload);
              break;
            case 'events_per_min':
              setEventsPerMin(msg.payload);
              break;
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        if (cancelled) return;
        setConnected(false);
        // Reconnect after a short delay
        reconnectTimeoutRef.current = setTimeout(connect, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimeoutRef.current);
      socketRef.current?.close();
      setConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
