'use client';

import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/lib/constants/enum-statuses';
import {
  IconArrowRight,
  IconCalendar,
  IconCheck,
  IconCheckbox,
  IconCopy,
  IconCreditCard,
  IconLoader2,
  IconMail,
  IconMapPin,
  IconPackage,
  IconReceipt,
  IconShoppingBag,
  IconTruck
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useGetOrdersId } from '~/src/services/-orders-{id}-get';
import { EmptyOrder } from './components/empty-order';
import { OrderTrackingSkeleton } from './components/order-loading';
import { useOrderWebSocket } from './useOrderWebsoket';

interface OrderTrackingDomainProps {
  orderId: string;
}


export function OrderTrackingDomain({ orderId }: OrderTrackingDomainProps) {
  const id = Number(orderId);
  const { data: initialData, isLoading, error } = useGetOrdersId(id);
  const order = initialData?.data;
  const { status: liveStatus, connected } = useOrderWebSocket(id);
  const [copied, setCopied] = useState(false);

  if (isLoading) return <OrderTrackingSkeleton />;
  if (error || !order) return <EmptyOrder />;

  const currentStatus = liveStatus ?? order.status ?? OrderStatus.Pending;
  const currentOrder = { ...order, status: currentStatus };

  const handleCopy = () => {
    if (currentOrder.order_number) {
      navigator.clipboard.writeText(currentOrder.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Order progress steps
  const getStepStatus = (status: string) => {
    const stepMap: Record<string, { confirmed: boolean; processing: boolean; shipped: boolean; delivered: boolean }> = {
      [OrderStatus.Pending]: { confirmed: true, processing: false, shipped: false, delivered: false },
      [OrderStatus.Paid]: { confirmed: true, processing: true, shipped: false, delivered: false },
      [OrderStatus.Shipped]: { confirmed: true, processing: true, shipped: true, delivered: false },
      [OrderStatus.Delivered]: { confirmed: true, processing: true, shipped: true, delivered: true },
      [OrderStatus.Cancelled]: { confirmed: true, processing: false, shipped: false, delivered: false },
      [OrderStatus.Refunded]: { confirmed: true, processing: false, shipped: false, delivered: false },
    };
    return stepMap[status] || stepMap[OrderStatus.Pending];
  };

  const stepsCompleted = getStepStatus(currentStatus);
  const steps = [
    { icon: IconCheckbox, title: 'Order Confirmed', completed: stepsCompleted?.confirmed, key: 'confirmed' },
    { icon: IconPackage, title: 'Processing', completed: stepsCompleted?.processing, key: 'processing' },
    { icon: IconTruck, title: 'Shipped', completed: stepsCompleted?.shipped, key: 'shipped' },
    { icon: IconMail, title: 'Delivered', completed: stepsCompleted?.delivered, key: 'delivered' },
  ];
  const progressPercent = (steps.filter(s => s.completed).length / steps.length) * 100;

  const payment = currentOrder.payment;
  const shipment = currentOrder.shipment;

  // Calculate order totals
  const subtotal = currentOrder.items?.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 0)), 0) ?? 0;
  const shippingCost = shipment?.price ?? 0;
  const tax = subtotal * 0.08; // assuming 8% tax – you could read from order if available
  const total = currentOrder.total_amount;


  const orderDateRelative = formatDistanceToNow(new Date(currentOrder.created_at as string), { addSuffix: true });
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
            Order #{currentOrder.order_number} –{' '}
            <span className='capitalize font-medium text-green-600'>{currentStatus}</span>
          </p>
          <p className='text-muted-foreground mt-1 flex items-center justify-center gap-1 text-sm'>
            <IconCalendar className='h-4 w-4' />
            Placed on {orderDateRelative}
          </p>
        </motion.div>

        {/* Order Number Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='mb-12'
        >
          <div className='bg-card border-border/50 rounded-2xl border p-6 text-center'>
            <p className='text-muted-foreground mb-2 text-sm'>Order Number</p>
            <div className='flex items-center justify-center gap-2'>
              <span className='font-mono text-2xl font-bold tracking-wider'>{currentOrder.order_number}</span>
              <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full' onClick={handleCopy}>
                {copied ? <IconCheck className='h-4 w-4 text-green-500' /> : <IconCopy className='h-4 w-4' />}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Order Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='mb-12'
        >
          <h2 className='mb-6 text-center text-lg font-semibold'>Order Progress</h2>
          <div className='relative'>
            <div className='bg-border absolute top-6 right-0 left-0 h-0.5'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ delay: 1, duration: 0.8, ease: 'easeInOut' }}
                className='h-full bg-green-500'
              />
            </div>
            <div className='relative grid grid-cols-4 gap-2'>
              {steps.map((step, index) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, type: 'spring', stiffness: 200 }}
                  className='flex flex-col items-center text-center'
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${step.completed ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                      }`}
                    animate={step.completed ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className='h-5 w-5' />
                  </motion.div>
                  <p className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                </motion.div>
              ))}
            </div>
            <AnimatePresence>
              {!connected && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='text-muted-foreground mt-4 flex items-center justify-center gap-1 text-center text-xs'
                >
                  <IconLoader2 className='h-3 w-3 animate-spin' />
                  Reconnecting for live updates…
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Two‑column layout: Items + Order Summary */}
        <div className='mb-12 grid gap-8 lg:grid-cols-3'>
          {/* Items List - takes 2/3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className='lg:col-span-2'
          >
            <div className='bg-card border-border/50 rounded-2xl border p-6'>
              <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                <IconShoppingBag className='h-5 w-5' />
                Items in your order
              </h2>
              <div className='divide-y divide-border'>
                {currentOrder.items?.map((item) => (
                  <div key={item.id} className='flex gap-4 py-4 first:pt-0 last:pb-0'>
                    <div className='bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-lg'>
                      {item.product?.images?.[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className='object-cover'
                        />
                      )}
                    </div>
                    <div className='flex flex-1 flex-col sm:flex-row sm:justify-between'>
                      <div>
                        <p className='font-medium'>{item.product?.name}</p>
                        <p className='text-muted-foreground text-sm'>
                          Qty: {item.quantity} × ${item.price}
                        </p>
                        {Number(item?.product?.colors?.length) > 0 && (
                          <p className='text-muted-foreground text-xs'>Color: {item.product?.colors?.[0]}</p>
                        )}
                      </div>
                      <p className='font-semibold mt-1 sm:mt-0'>${item.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Order Summary - takes 1/3 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 }}
          >
            <div className='bg-card border-border/50 rounded-2xl border p-6'>
              <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                <IconReceipt className='h-5 w-5' />
                Order Summary
              </h2>
              <div className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Tax (estimated)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className='border-t border-border pt-3 mt-3'>
                  <div className='flex justify-between font-bold'>
                    <span>Total</span>
                    <span>${total?.toFixed(2)}</span>
                  </div>
                  <p className='text-muted-foreground mt-1 text-right text-xs'>{currentOrder.currency}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment & Shipment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='mb-12 grid gap-6 md:grid-cols-2'
        >
          {/* Payment Details */}
          <motion.div
            whileHover={{ y: -2 }}
            className='bg-card border-border/50 rounded-2xl border p-5 transition-shadow hover:shadow-md'
          >
            <div className='mb-3 flex items-center gap-2'>
              <IconCreditCard className='text-accent h-5 w-5' />
              <h3 className='font-semibold'>Payment Information</h3>
            </div>
            {payment ? (
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Method:</span>
                  <span className='capitalize font-medium'>{payment.method?.replace('_', ' ')}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Status:</span>
                  <motion.span
                    className={`capitalize font-medium ${payment.status === 'succeeded' ? 'text-green-600' :
                      payment.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                      }`}
                    animate={payment.status === 'pending' && currentStatus !== OrderStatus.Pending ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {payment.status}
                  </motion.span>
                </div>
                {payment.transaction_id && payment.transaction_id !== 'pending' && (
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Transaction ID:</span>
                    <span className='font-mono text-xs'>{payment.transaction_id}</span>
                  </div>
                )}
                <div className='flex justify-between border-t border-border pt-2 mt-1'>
                  <span className='text-muted-foreground'>Amount paid:</span>
                  <span className='font-bold'>${payment.amount} {payment.currency}</span>
                </div>
              </div>
            ) : (
              <p className='text-muted-foreground text-sm'>Payment details will appear after confirmation.</p>
            )}
          </motion.div>

          {/* Shipment Details */}
          <motion.div
            whileHover={{ y: -2 }}
            className='bg-card border-border/50 rounded-2xl border p-5 transition-shadow hover:shadow-md'
          >
            <div className='mb-3 flex items-center gap-2'>
              <IconMapPin className='text-accent h-5 w-5' />
              <h3 className='font-semibold'>Shipping Information</h3>
            </div>
            {shipment ? (
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Carrier:</span>
                  <span className='capitalize font-medium'>{shipment.carrier || 'Standard Shipping'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Status:</span>
                  <motion.span
                    className={`capitalize font-medium ${shipment.status === 'delivered' ? 'text-green-600' :
                      shipment.status === 'shipped' ? 'text-blue-600' : 'text-yellow-600'
                      }`}
                    animate={shipment.status === 'processing' || shipment.status === 'shipped' ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {shipment.status}
                  </motion.span>
                </div>
                {shipment.tracking_number && (
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Tracking #:</span>
                    <span className='font-mono text-xs'>{shipment.tracking_number}</span>
                  </div>
                )}
                {shipment.shipped_at && (
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Shipped on:</span>
                    <span>{new Date(shipment.shipped_at).toLocaleDateString()}</span>
                  </div>
                )}
                <div className='flex justify-between border-t border-border pt-2 mt-1'>
                  <span className='text-muted-foreground'>Deliver to:</span>
                  <span className='text-right text-xs'>
                    {shipment.address_line1}
                    {shipment.address_line2 && `, ${shipment.address_line2}`}
                    <br />
                    {shipment.city}, {shipment.state} {shipment.postal_code}
                    <br />
                    {shipment.country}
                  </span>
                </div>
              </div>
            ) : (
              <p className='text-muted-foreground text-sm'>Shipping details will be available once the order is processed.</p>
            )}
          </motion.div>
        </motion.div>

        {/* Next Steps & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className='mb-12 grid gap-4 sm:grid-cols-2'
        >
          <div className='bg-card border-border/50 rounded-2xl border p-6'>
            <IconMail className='text-accent mb-4 h-8 w-8' />
            <h3 className='mb-2 font-semibold'>Check Your Email</h3>
            <p className='text-muted-foreground text-sm'>
              We've sent a confirmation email with your order details and tracking information.
            </p>
          </div>
          <div className='bg-card border-border/50 rounded-2xl border p-6'>
            <IconPackage className='text-accent mb-4 h-8 w-8' />
            <h3 className='mb-2 font-semibold'>Track Your Order</h3>
            <p className='text-muted-foreground text-sm'>
              Use your order number to track your package. You'll receive updates at each step.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className='flex flex-col items-center justify-center gap-4 sm:flex-row'
        >
          <Link href='/shop'>
            <Button variant='outline' size='lg' className='w-full rounded-full sm:w-auto'>
              Continue Shopping
            </Button>
          </Link>
          <Link href='/'>
            <Button size='lg' className='w-full rounded-full sm:w-auto'>
              Back to Home
              <IconArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className='text-muted-foreground mt-12 text-center text-sm'
        >
          Questions about your order?{' '}
          <Link href='/contact' className='text-accent hover:underline'>
            Contact our support team
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
