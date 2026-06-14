'use client';

import {
  IconChevronLeft,
  IconChevronRight,
  IconPackage,
  IconShoppingBag
} from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useGetOrdersMy } from '@/services/-orders-my-get';

import { OrderHistoryCard } from '../components/order-history-card';
import { OrderHistorySkeleton } from '../components/order-history-skeleton';

const PAGE_SIZE = 5;

export function AccountOrder() {
  const [page, setPage] = useState(0);
  const offset = page * PAGE_SIZE;

  const {
    data: response,
    isLoading,
    isError,
    refetch
  } = useGetOrdersMy({ offset, limit: PAGE_SIZE });

  const ordersData = response?.data?.orders ?? [];
  const totalOrders = response?.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalOrders / PAGE_SIZE));

  const handleNext = () => {
    if (page + 1 < totalPages) setPage((current) => current + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage((current) => current - 1);
  };

  if (isLoading) {
    return <OrderHistorySkeleton />;
  }

  if (isError) {
    return (
      <div className='bg-card border-border rounded-2xl border p-10 text-center sm:p-12'>
        <p className='text-destructive font-medium'>Failed to load order history.</p>
        <p className='text-muted-foreground mt-2 text-sm'>
          Please check your connection and try again.
        </p>
        <Button variant='outline' className='mt-5' onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (ordersData.length === 0) {
    return (
      <div className='bg-card border-border rounded-2xl border p-10 text-center sm:p-14'>
        <div className='bg-muted/60 mx-auto mb-5 flex size-16 items-center justify-center rounded-full'>
          <IconPackage className='text-muted-foreground size-8' />
        </div>
        <h3 className='font-display text-xl font-semibold'>No orders yet</h3>
        <p className='text-muted-foreground mx-auto mt-2 max-w-sm text-sm'>
          When you place your first order, it will appear here with tracking and item details.
        </p>
        <Button asChild className='mt-6'>
          <Link href='/shop'>
            <IconShoppingBag className='size-4' />
            Start shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h2 className='font-display text-2xl font-semibold tracking-tight'>Order History</h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            {totalOrders} {totalOrders === 1 ? 'order' : 'orders'} placed with your account
          </p>
        </div>

        {totalPages > 1 ? (
          <div className='flex items-center gap-2 self-start sm:self-auto'>
            <Button variant='outline' size='icon-sm' onClick={handlePrev} disabled={page === 0}>
              <IconChevronLeft className='size-4' />
            </Button>
            <span className='text-muted-foreground min-w-24 text-center text-sm tabular-nums'>
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant='outline'
              size='icon-sm'
              onClick={handleNext}
              disabled={page + 1 >= totalPages}
            >
              <IconChevronRight className='size-4' />
            </Button>
          </div>
        ) : null}
      </div>

      <div className='space-y-4'>
        {ordersData.map((order) => (
          <OrderHistoryCard key={order.id} order={order} />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className='flex justify-center gap-2 pt-2'>
          <Button variant='outline' onClick={handlePrev} disabled={page === 0}>
            Previous
          </Button>
          <Button variant='outline' onClick={handleNext} disabled={page + 1 >= totalPages}>
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
