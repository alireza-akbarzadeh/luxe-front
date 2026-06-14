'use client';

import { IconCalendar, IconCheckbox, IconMapPin } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';

import { OrderNumber } from '@/components/order-number';
import { OrderStatus } from '@/lib/constants/enum-statuses';
import { useGetOrdersId } from '~/src/services/-orders-{id}-get';

import { OrderBoxNumber } from './components/order-box-number';
import { OrderItemSummary } from './components/order-item-summary';
import { OrderTrackingSkeleton } from './components/order-loading';
import { OrderTrackingProgress } from './components/order-tracking-progress';
import { OrderTrackingSummary } from './components/order-tracking-summary';
import { PaymentDetails } from './components/payment-details';
import { ShipmentTraking } from './components/shipment-traking';
import { TrakingFooter } from './components/traking-footer';
import { useOrderWebSocket } from './useOrderWebsoket';

interface OrderTrackingDomainProps {
  orderId: string;
}

export function OrderTrackingDomain({ orderId }: OrderTrackingDomainProps) {
  const id = Number(orderId);
  const { data: initialData, isLoading, error } = useGetOrdersId(id);
  const order = initialData?.data;
  const { status: liveStatus, connected } = useOrderWebSocket(id);

  if (isLoading) return <OrderTrackingSkeleton />;
  if (error || !order) return notFound();

  const currentStatus = liveStatus ?? order.status ?? OrderStatus.Pending;
  const currentOrder = { ...order, status: currentStatus };

  // Order progress steps
  const getStepStatus = (status: string) => {
    const stepMap: Record<
      string,
      { confirmed: boolean; processing: boolean; shipped: boolean; delivered: boolean }
    > = {
      [OrderStatus.Pending]: {
        confirmed: true,
        processing: false,
        shipped: false,
        delivered: false
      },
      [OrderStatus.Paid]: { confirmed: true, processing: true, shipped: false, delivered: false },
      [OrderStatus.Shipped]: { confirmed: true, processing: true, shipped: true, delivered: false },
      [OrderStatus.Delivered]: {
        confirmed: true,
        processing: true,
        shipped: true,
        delivered: true
      },
      [OrderStatus.Cancelled]: {
        confirmed: true,
        processing: false,
        shipped: false,
        delivered: false
      },
      [OrderStatus.Refunded]: {
        confirmed: true,
        processing: false,
        shipped: false,
        delivered: false
      }
    };
    return stepMap[status] || stepMap[OrderStatus.Pending];
  };

  const stepsCompleted = getStepStatus(currentStatus);

  const payment = currentOrder.payment;
  const shipment = currentOrder.shipment;

  // Calculate order totals
  const subtotal =
    currentOrder.items?.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0) ??
    0;

  const shippingCost = shipment?.shipping_price ?? 0;
  // FIXME: tax should come from backend
  const tax = subtotal * 0.08;
  const total = currentOrder.total_amount;

  const orderDateRelative = formatDistanceToNow(new Date(currentOrder.created_at as string), {
    addSuffix: true
  });

  return (
    <div className='pt-24 pb-16'>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className='mb-8 flex justify-center'
        >
          <div className='relative'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className='flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10'
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
                className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20'
              >
                <IconCheckbox className='h-10 w-10 text-green-500' />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className='bg-accent absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full'
            >
              <span className='text-accent-foreground text-xs font-bold'>1</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Confirmation Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='mb-8 text-center'
        >
          <h1 className='mb-2 text-3xl font-bold md:text-4xl'>Thank you for your order!</h1>
          <p className='text-muted-foreground text-lg'>
            Order{' '}
            <OrderNumber value={currentOrder.order_number ?? '—'} size='lg' className='inline' /> –{' '}
            <span className='font-medium text-green-600 capitalize'>{currentStatus}</span>
          </p>
          <p className='text-muted-foreground mt-1 flex items-center justify-center gap-1 text-sm'>
            <IconCalendar className='h-4 w-4' />
            Placed on {orderDateRelative}
          </p>
        </motion.div>

        {/* Order Number Box */}
        <OrderBoxNumber order_number={currentOrder.order_number || ''} />

        {/* Order Progress */}
        <OrderTrackingProgress stepsCompleted={stepsCompleted} connected={connected} />

        {/* Two‑column layout: Items + Order Summary */}
        <div className='mb-12 grid gap-8 lg:grid-cols-3'>
          {/* Items List - takes 2/3 */}
          <OrderItemSummary orderItems={currentOrder.items || []} />
          {/* Order Summary - takes 1/3 */}
          <OrderTrackingSummary
            currency={currentOrder.currency || ''}
            shippingCost={shippingCost}
            subtotal={subtotal}
            tax={tax}
            total={total as number}
          />
        </div>

        {/* Payment & Shipment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='mb-12 grid gap-6 md:grid-cols-2'
        >
          {/* Payment Details */}
          <PaymentDetails currentStatus={currentStatus} payment={payment || {}} />

          {/* Shipment Details */}
          <motion.div
            whileHover={{ y: -2 }}
            className='bg-card border-border/50 rounded-2xl border p-5 transition-shadow hover:shadow-md'
          >
            <div className='mb-3 flex items-center gap-2'>
              <IconMapPin className='text-accent h-5 w-5' />
              <h3 className='font-semibold'>Shipping Information</h3>
            </div>
            <ShipmentTraking shipment={shipment} />
          </motion.div>
        </motion.div>

        <TrakingFooter />
      </div>
    </div>
  );
}
