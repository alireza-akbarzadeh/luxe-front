'use client';

import { IconArrowRight, IconCheckbox, IconPackage, IconShoppingBag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { OrderNumber } from '@/components/order-number';
import { Button } from '@/components/ui/button';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { cn } from '@/lib/utils';
import { useGetOrdersId } from '~/src/services/-orders-{id}-get';

import { OrderTrackingSkeleton } from '../order-tracking/components/order-loading';

interface OrderConfirmedDomainProps {
  orderId: string;
}

export function OrderConfirmedDomain({ orderId }: OrderConfirmedDomainProps) {
  const id = Number(orderId);
  const { data, isLoading, error } = useGetOrdersId(id);
  const order = data?.data;

  if (isLoading) return <OrderTrackingSkeleton />;
  if (error || !order) return notFound();

  const total = order.total_amount ?? 0;
  const itemCount = order.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;

  return (
    <div className='pt-24 pb-16'>
      <div className='mx-auto max-w-2xl px-4 sm:px-6'>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center'
        >
          <div className='bg-accent/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
            <IconCheckbox className='text-accent h-10 w-10' stroke={2} />
          </div>

          <h1 className='mb-2 text-3xl font-bold tracking-tight'>Order confirmed!</h1>
          <p className='text-muted-foreground mb-8 text-sm leading-relaxed'>
            Thank you for your purchase. We&apos;ve received your order and will send you a
            confirmation email shortly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='bg-card border-border/60 mb-8 rounded-2xl border p-6'
        >
          <dl className='space-y-4 text-sm'>
            <div className='flex items-center justify-between gap-4'>
              <dt className='text-muted-foreground'>Order number</dt>
              <dd>
                <OrderNumber value={String(order.id)} size='md' />
              </dd>
            </div>
            <div className='flex items-center justify-between gap-4'>
              <dt className='text-muted-foreground flex items-center gap-1.5'>
                <IconPackage className='h-4 w-4' />
                Items
              </dt>
              <dd>{itemCount}</dd>
            </div>
            <div className='flex items-center justify-between gap-4'>
              <dt className='text-muted-foreground'>Total paid</dt>
              <dd className={cn(cartMoneyClassName, 'text-lg font-bold')}>
                {formatCartMoney(total)}
              </dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='flex flex-col gap-3 sm:flex-row sm:justify-center'
        >
          <Button asChild className='rounded-full'>
            <Link href={`/order-tracking/${order.id}`}>
              Track your order
              <IconArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
          <Button asChild variant='outline' className='rounded-full'>
            <Link href='/shop'>
              <IconShoppingBag className='mr-2 h-4 w-4' />
              Continue shopping
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
