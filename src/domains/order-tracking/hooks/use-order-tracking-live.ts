'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { OrderStatus } from '@/lib/constants/enum-statuses';
import { connectRealtimeSocket } from '@/lib/realtime/ws-client';
import { getGetOrdersIdQueryKey } from '~/src/services/-orders-{id}-get';

import {
  createActivityEntry,
  getStepKeyForStatus,
  type OrderTrackingActivity,
  type OrderTrackingLiveOverlay
} from '../lib/order-tracking-utils';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

const INITIAL_LIVE_STATE: OrderTrackingLiveOverlay = {
  orderStatus: null,
  paymentStatus: null,
  shipment: null,
  activities: [],
  pulsingStepKey: null
};

interface RealtimeMessage {
  type?: string;
  data?: Record<string, unknown>;
}

/**
 * Maintains a dedicated authenticated WebSocket for a single order room.
 * Applies optimistic UI updates and invalidates the order query on each event.
 */
export function useOrderTrackingLive(orderId: number) {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [liveState, setLiveState] = useState<OrderTrackingLiveOverlay>(INITIAL_LIVE_STATE);

  useEffect(() => {
    let cancelled = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const room = `order_${orderId}`;

    const invalidateOrder = () => {
      void queryClient.invalidateQueries({ queryKey: getGetOrdersIdQueryKey(orderId) });
    };

    const appendActivity = (entry: OrderTrackingActivity) => {
      setLiveState((prev) => ({
        ...prev,
        activities: [entry, ...prev.activities].slice(0, 12)
      }));
    };

    const handleMessage = (raw: unknown) => {
      if (!raw || typeof raw !== 'object') return;

      const message = raw as RealtimeMessage;
      const data = message.data ?? {};

      switch (message.type) {
        case 'order_status_update': {
          const newStatus = String(data['new_status'] ?? data['status'] ?? '');
          if (!newStatus) break;

          appendActivity(
            createActivityEntry(
              'order_status_update',
              'Order status updated',
              `Status changed to ${newStatus.replace(/_/g, ' ')}`
            )
          );

          setLiveState((prev) => ({
            ...prev,
            orderStatus: newStatus,
            pulsingStepKey: getStepKeyForStatus(newStatus)
          }));
          invalidateOrder();
          break;
        }

        case 'payment_succeeded': {
          appendActivity(
            createActivityEntry(
              'payment_succeeded',
              String(data['title'] ?? 'Payment confirmed'),
              String(data['message'] ?? 'Your payment was processed successfully.')
            )
          );

          setLiveState((prev) => ({
            ...prev,
            orderStatus: OrderStatus.Paid,
            paymentStatus: 'succeeded',
            pulsingStepKey: 'processing'
          }));
          invalidateOrder();
          break;
        }

        case 'payment_failed': {
          appendActivity(
            createActivityEntry(
              'payment_failed',
              String(data['title'] ?? 'Payment failed'),
              String(data['message'] ?? 'We could not process your payment.')
            )
          );

          setLiveState((prev) => ({
            ...prev,
            paymentStatus: 'failed',
            pulsingStepKey: 'confirmed'
          }));
          invalidateOrder();
          break;
        }

        case 'shipment_processing': {
          appendActivity(
            createActivityEntry(
              'shipment_processing',
              String(data['title'] ?? 'Preparing shipment'),
              String(data['message'] ?? 'Your order is being prepared for shipping.')
            )
          );

          setLiveState((prev) => ({
            ...prev,
            shipment: {
              ...prev.shipment,
              status: 'processing'
            },
            pulsingStepKey: 'processing'
          }));
          invalidateOrder();
          break;
        }

        case 'shipment_shipped': {
          const trackingNumber = data['tracking_number']
            ? String(data['tracking_number'])
            : undefined;

          appendActivity(
            createActivityEntry(
              'shipment_shipped',
              String(data['title'] ?? 'Package shipped'),
              String(
                data['message'] ??
                  (trackingNumber
                    ? `Tracking number ${trackingNumber} is now available.`
                    : 'Your package is on the way.')
              )
            )
          );

          setLiveState((prev) => ({
            ...prev,
            orderStatus: OrderStatus.Shipped,
            shipment: {
              ...prev.shipment,
              status: 'shipped',
              tracking_number: trackingNumber ?? prev.shipment?.tracking_number,
              carrier: data['carrier'] ? String(data['carrier']) : prev.shipment?.carrier,
              shipped_at: data['shipped_at']
                ? String(data['shipped_at'])
                : prev.shipment?.shipped_at
            },
            pulsingStepKey: 'shipped'
          }));
          invalidateOrder();
          break;
        }

        default:
          break;
      }
    };

    const connect = async () => {
      if (cancelled) return;

      setConnectionStatus('connecting');

      socket = await connectRealtimeSocket({
        rooms: [room],
        onOpen: () => {
          if (!cancelled) setConnectionStatus('connected');
        },
        onClose: () => {
          socket = null;
          if (cancelled) return;
          setConnectionStatus('disconnected');
          reconnectTimer = setTimeout(() => {
            void connect();
          }, 3000);
        },
        onMessage: handleMessage
      });

      if (!socket && !cancelled) {
        setConnectionStatus('disconnected');
        reconnectTimer = setTimeout(() => {
          void connect();
        }, 3000);
      }
    };

    void connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer);
      socket?.close();
      socket = null;
      setConnectionStatus('disconnected');
    };
  }, [orderId, queryClient]);

  const clearPulsingStep = () => {
    setLiveState((prev) => ({ ...prev, pulsingStepKey: null }));
  };

  return {
    connectionStatus,
    liveState,
    clearPulsingStep
  };
}
