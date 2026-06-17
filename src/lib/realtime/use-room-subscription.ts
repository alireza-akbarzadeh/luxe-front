'use client';

import { useEffect } from 'react';

import { useRealtime, useRealtimeSubscribe } from './realtime-provider';

interface UseRoomSubscriptionOptions {
  enabled?: boolean;
}

/**
 * Joins a shared dashboard WebSocket room and forwards frames to a handler.
 * Uses the singleton RealtimeProvider socket — do not open a second connection.
 */
export function useRoomSubscription(
  room: string,
  onMessage: (message: unknown) => void,
  options?: UseRoomSubscriptionOptions
) {
  const { joinRoom, status } = useRealtime();
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;
    joinRoom(room);
  }, [enabled, joinRoom, room]);

  useRealtimeSubscribe(onMessage);

  return { status };
}
