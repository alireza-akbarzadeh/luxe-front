'use client';

import {
  IconCheckbox,
  IconClock,
  IconMail,
  IconPackage,
  IconTruck,
  IconX
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

import { OrderNumber } from '@/components/order-number';
import { OrderStatus } from '@/lib/constants/enum-statuses';
import { cn } from '@/lib/utils';

import { getStatusLabel } from '../lib/order-tracking-utils';
import { OrderTrackingLiveBadge } from './order-tracking-live-badge';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface OrderTrackingStatusHeroProps {
  orderNumber: string;
  status: string;
  createdAt: string;
  isFreshCheckout: boolean;
  connectionStatus: ConnectionStatus;
}

function getHeroConfig(status: string, isFreshCheckout: boolean) {
  const normalized = status.toLowerCase();

  if (isFreshCheckout && normalized === OrderStatus.Pending) {
    return {
      title: 'Thank you for your order!',
      subtitle: 'Your order is confirmed and being prepared.',
      icon: IconCheckbox,
      tone: 'success' as const
    };
  }

  switch (normalized) {
    case OrderStatus.Paid:
    case 'processing':
      return {
        title: 'We are preparing your order',
        subtitle: 'Payment confirmed — items are being packed.',
        icon: IconPackage,
        tone: 'processing' as const
      };
    case OrderStatus.Shipped:
      return {
        title: 'Your package is on the way',
        subtitle: 'Track shipment details below for the latest carrier updates.',
        icon: IconTruck,
        tone: 'shipped' as const
      };
    case OrderStatus.Delivered:
      return {
        title: 'Delivered — enjoy!',
        subtitle: 'Your order has arrived. We hope you love it.',
        icon: IconMail,
        tone: 'delivered' as const
      };
    case OrderStatus.Cancelled:
      return {
        title: 'Order cancelled',
        subtitle: 'This order was cancelled. Contact support if you need help.',
        icon: IconX,
        tone: 'cancelled' as const
      };
    case OrderStatus.Refunded:
      return {
        title: 'Order refunded',
        subtitle: 'A refund has been issued for this order.',
        icon: IconX,
        tone: 'cancelled' as const
      };
    default:
      return {
        title: 'Order tracking',
        subtitle: 'Follow your order progress in real time.',
        icon: IconClock,
        tone: 'pending' as const
      };
  }
}

const toneStyles = {
  success: {
    ring: 'bg-green-500/10',
    inner: 'bg-green-500/20',
    icon: 'text-green-500',
    status: 'text-green-600'
  },
  processing: {
    ring: 'bg-amber-500/10',
    inner: 'bg-amber-500/20',
    icon: 'text-amber-500',
    status: 'text-amber-600'
  },
  shipped: {
    ring: 'bg-blue-500/10',
    inner: 'bg-blue-500/20',
    icon: 'text-blue-500',
    status: 'text-blue-600'
  },
  delivered: {
    ring: 'bg-green-500/10',
    inner: 'bg-green-500/20',
    icon: 'text-green-500',
    status: 'text-green-600'
  },
  cancelled: {
    ring: 'bg-red-500/10',
    inner: 'bg-red-500/20',
    icon: 'text-red-500',
    status: 'text-red-600'
  },
  pending: {
    ring: 'bg-muted',
    inner: 'bg-muted/80',
    icon: 'text-muted-foreground',
    status: 'text-muted-foreground'
  }
};

/** Status-aware hero header with optional fresh-checkout celebration animation. */
export function OrderTrackingStatusHero({
  orderNumber,
  status,
  createdAt,
  isFreshCheckout,
  connectionStatus
}: OrderTrackingStatusHeroProps) {
  const config = getHeroConfig(status, isFreshCheckout);
  const styles = toneStyles[config.tone];
  const HeroIcon = config.icon;
  const orderDateRelative = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div className='mb-8'>
      <div className='mb-6 flex justify-center'>
        <OrderTrackingLiveBadge connectionStatus={connectionStatus} />
      </div>

      <motion.div
        initial={{ scale: isFreshCheckout ? 0 : 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          isFreshCheckout
            ? { type: 'spring', stiffness: 220, damping: 16, delay: 0.15 }
            : { duration: 0.35 }
        }
        className='mb-8 flex justify-center'
      >
        <div className='relative'>
          <motion.div
            initial={isFreshCheckout ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{ delay: isFreshCheckout ? 0.25 : 0 }}
            className={cn('flex h-24 w-24 items-center justify-center rounded-full', styles.ring)}
          >
            <motion.div
              initial={isFreshCheckout ? { scale: 0 } : false}
              animate={{ scale: 1 }}
              transition={{ delay: isFreshCheckout ? 0.4 : 0 }}
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full',
                styles.inner
              )}
            >
              <HeroIcon className={cn('h-9 w-9', styles.icon)} />
            </motion.div>
          </motion.div>

          {isFreshCheckout && (
            <>
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.15,
                    duration: 1.2,
                    repeat: Infinity,
                    repeatDelay: 2.5
                  }}
                  className={cn(
                    'absolute inset-0 rounded-full border-2',
                    styles.icon,
                    'border-current opacity-30'
                  )}
                />
              ))}
            </>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isFreshCheckout ? 0.35 : 0.1 }}
        className='text-center'
      >
        <h1 className='mb-2 text-3xl font-bold md:text-4xl'>{config.title}</h1>
        <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>{config.subtitle}</p>
        <p className='mt-3 text-base'>
          Order <OrderNumber value={orderNumber || '—'} size='lg' className='inline' /> —{' '}
          <span className={cn('font-medium capitalize', styles.status)}>
            {getStatusLabel(status)}
          </span>
        </p>
        <p className='text-muted-foreground mt-1 text-sm'>Placed {orderDateRelative}</p>
      </motion.div>
    </div>
  );
}
