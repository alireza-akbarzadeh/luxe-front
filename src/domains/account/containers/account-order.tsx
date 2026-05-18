'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IconChevronLeft, IconChevronRight, IconPackage } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useGetAccountOrders } from '~/src/services/-account-orders-get';
import { statusColors } from '../data';

const PAGE_SIZE = 5;

export function AccountOrder() {
  const [page, setPage] = useState(0);
  const offset = page * PAGE_SIZE;

  const { data: response, isLoading, isError, error } = useGetAccountOrders({});

  const ordersData = response?.data?.orders;
  const totalOrders = response?.data?.total || 0;
  const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

  const handleNext = () => {
    if (page + 1 < totalPages) setPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='bg-card border-border animate-pulse rounded-2xl border p-6'>
            <div className='mb-4 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700' />
            <div className='space-y-2'>
              <div className='h-4 w-full rounded bg-gray-200 dark:bg-gray-700' />
              <div className='h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='bg-card border-border rounded-2xl border p-6 text-center'>
        <p className='text-destructive'>Failed to load order history.</p>
        <button
          onClick={() => window.location.reload()}
          className='text-primary mt-4 text-sm underline'
        >
          Retry
        </button>
      </div>
    );
  }

  if (!ordersData || ordersData.length === 0) {
    return (
      <div className='bg-card border-border rounded-2xl border p-12 text-center'>
        <IconPackage className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
        <h3 className='text-lg font-medium'>No orders yet</h3>
        <p className='text-muted-foreground mt-1'>
          When you place your first order, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Order History</h2>
        {totalPages > 1 && (
          <div className='flex gap-2'>
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className='rounded-lg border p-2 disabled:opacity-40'
            >
              <IconChevronLeft className='h-4 w-4' />
            </button>
            <span className='text-muted-foreground flex items-center text-sm'>
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page + 1 >= totalPages}
              className='rounded-lg border p-2 disabled:opacity-40'
            >
              <IconChevronRight className='h-4 w-4' />
            </button>
          </div>
        )}
      </div>

      {ordersData.map((order) => (
        <div key={order.id} className='bg-card border-border rounded-2xl border p-6'>
          <div className='mb-4 flex flex-wrap items-start justify-between gap-2'>
            <div>
              <p className='text-lg font-semibold'>{order.order_number}</p>
              <p className='text-muted-foreground text-sm'>
                {format(new Date(order.created_at as string), 'PPP')}
              </p>
            </div>
            <span
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                statusColors[order.status as string] || ''
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className='mb-4 space-y-3'>
            {order?.items?.map((item, idx) => {
              const price = typeof item.price === 'number' ? item.price : 0;
              const imageUrl = item.image_url || null;
              const productName = item.product_name || 'Product';
              return (
                <div
                  key={idx}
                  className='flex flex-col gap-3 border-b pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between'
                >
                  <div className='flex items-center gap-3'>
                    <div className='bg-muted relative h-14 w-14 shrink-0 overflow-hidden rounded-lg'>
                      {imageUrl ? (
                        <Image src={imageUrl} alt={productName} fill className='object-cover' />
                      ) : (
                        <div className='flex h-full w-full items-center justify-center text-xs text-gray-400'>
                          No img
                        </div>
                      )}
                    </div>
                    <div>
                      <p className='font-medium'>{productName}</p>
                      <p className='text-muted-foreground text-sm'>Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>${price.toFixed(2)}</p>
                    <p className='text-muted-foreground text-xs'>each</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className='border-border flex items-center justify-between border-t pt-4'>
            <span className='font-medium'>Total amount</span>
            <span className='text-xl font-bold'>
              ${(typeof order.total_amount === 'number' ? order.total_amount : 0).toFixed(2)}
            </span>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className='flex justify-center gap-2 pt-2'>
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className='rounded-lg border px-4 py-2 disabled:opacity-40'
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={page + 1 >= totalPages}
            className='rounded-lg border px-4 py-2 disabled:opacity-40'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
