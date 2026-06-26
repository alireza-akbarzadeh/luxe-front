'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { ACCOUNT_NOTIFICATIONS_QUERY_KEY } from '@/domains/account/hooks/use-account-notifications';
import { useVendorRealtimeRooms } from '@/domains/vendor/panel/hooks/use-vendor-realtime-rooms';
import type { UserPayload } from '@/lib/auth/auth-server';
import { readMessageType } from '@/lib/realtime/message-utils';
import { useRealtimeSubscribe } from '@/lib/realtime/realtime-provider';
import {
  isVendorMessageEvent,
  isVendorOrderEvent,
  VENDOR_WS_EVENTS
} from '@/lib/realtime/vendor-realtime';

interface VendorNotificationPayload {
  title?: string;
  message?: string;
  content?: string;
  order_number?: string;
}

function readNotificationData(raw: unknown): VendorNotificationPayload | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const frame = raw as { data?: VendorNotificationPayload };
  return frame.data;
}

/** Live WebSocket sync for vendor orders, notifications, and messages. */
export function VendorRealtimeSync({ user }: { user: UserPayload }) {
  const queryClient = useQueryClient();
  const t = useTranslations('vendor.panel.realtime');
  useVendorRealtimeRooms(user);

  const invalidateVendorOrders = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['vendor-store-orders'] });
    void queryClient.invalidateQueries({ queryKey: ['vendor-store-order-stats'] });
    void queryClient.invalidateQueries({ queryKey: ['vendor-store-order'] });
  }, [queryClient]);

  const handleMessage = useCallback(
    (raw: unknown) => {
      const type = readMessageType(raw);
      const data = readNotificationData(raw);

      if (type === VENDOR_WS_EVENTS.NOTIFICATION) {
        const title = data?.title ?? t('notificationFallback');
        const description = data?.message;
        toast.info(title, description ? { description } : undefined);
        void queryClient.invalidateQueries({ queryKey: ACCOUNT_NOTIFICATIONS_QUERY_KEY });
        if (data?.order_number) {
          invalidateVendorOrders();
        }
        return;
      }

      if (isVendorOrderEvent(type)) {
        const title =
          type === VENDOR_WS_EVENTS.ORDER_NEW
            ? t('newOrder', { order: data?.order_number ?? '' })
            : type === VENDOR_WS_EVENTS.ORDER_SHIPMENT
              ? t('shipmentUpdate', { order: data?.order_number ?? '' })
              : t('orderUpdate', { order: data?.order_number ?? '' });

        toast.info(title, data?.message ? { description: data.message } : undefined);
        invalidateVendorOrders();
        return;
      }

      if (isVendorMessageEvent(type)) {
        const preview = data?.message ?? data?.content;
        toast.info(t('newMessage'), {
          description: typeof preview === 'string' ? preview : undefined
        });
        void queryClient.invalidateQueries({ queryKey: ['vendor-messages'] });
      }
    },
    [invalidateVendorOrders, queryClient, t]
  );

  useRealtimeSubscribe(handleMessage);

  return null;
}
