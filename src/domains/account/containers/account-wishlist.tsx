'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IconHeart, IconHeartFilled, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useGetAccountWishlist } from '~/src/services/-account-wishlist-get';
import { usePostProductsIdLike } from '~/src/services/-products-{id}-like-post';
import { Button } from '~/src/components/ui/button';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { getGetAccountWishlistQueryKey } from '~/src/services/-account-wishlist-get';

const PAGE_SIZE = 9;

export function AccountWhishlist() {
  const [page, setPage] = useState(0);
  const offset = page * PAGE_SIZE;
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isError,
    error
  } = useGetAccountWishlist({
    limit: PAGE_SIZE,
    offset
  });

  const items = response?.data?.items ?? [];
  const total = response?.data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const { mutateAsync: toggleLike } = usePostProductsIdLike();

  const handleRemove = async (productId: number) => {
    try {
      await toggleLike({ id: productId, data: { like: false } });
      // Invalidate and refetch wishlist
      await queryClient.invalidateQueries({ queryKey: getGetAccountWishlistQueryKey() });
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='bg-card border-border animate-pulse rounded-xl border p-4'>
              <div className='bg-muted mb-3 aspect-square rounded-lg' />
              <div className='h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700' />
              <div className='mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='bg-card border-border rounded-2xl border p-12 text-center'>
        <p className='text-destructive'>Failed to load wishlist. Please try again.</p>
        <Button variant='outline' className='mt-4' onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className='bg-card border-border rounded-2xl border p-12 text-center'>
        <IconHeart className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
        <h3 className='text-lg font-medium'>Your wishlist is empty</h3>
        <p className='text-muted-foreground mt-1'>
          Save your favourite items by clicking the heart icon on any product.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>My Wishlist</h2>
        {totalPages > 1 && (
          <div className='flex items-center gap-2'>
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className='rounded-lg border p-2 disabled:opacity-40'
            >
              <IconChevronLeft className='h-4 w-4' />
            </button>
            <span className='text-muted-foreground text-sm'>
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

      <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
        {items.map((item) => (
          <div
            key={item.product_id}
            className='bg-card border-border group relative overflow-hidden rounded-xl border transition-all hover:shadow-md'
          >
            <div className='relative aspect-square overflow-hidden'>
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.product_name || ''}
                  width={400}
                  height={400}
                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
              ) : (
                <div className='bg-muted flex h-full w-full items-center justify-center text-gray-400'>
                  No image
                </div>
              )}

              {/* Discount badge */}
              {item.discount_percent && item.discount_percent > 0 && (
                <div className='absolute top-2 left-2 rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white'>
                  -{item.discount_percent}%
                </div>
              )}

              {/* Remove from wishlist button */}
              <button
                onClick={() => handleRemove(item.product_id as number)}
                className='bg-background/80 absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full text-red-500 backdrop-blur transition-colors hover:bg-red-500 hover:text-white'
                aria-label='Remove from wishlist'
              >
                <IconHeartFilled className='h-4 w-4 fill-current' />
              </button>

              {/* Out of stock overlay */}
              {!item.is_in_stock && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                  <span className='rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white'>
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className='p-4'>
              <h3 className='line-clamp-1 font-medium'>{item.product_name}</h3>
              <div className='mt-1 flex items-baseline gap-2'>
                {item.old_price ? (
                  <>
                    <span className='text-accent font-semibold'>${item.price?.toFixed(2)}</span>
                    <span className='text-muted-foreground text-sm line-through'>
                      ${item.old_price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className='text-accent font-semibold'>${item.price?.toFixed(2)}</span>
                )}
              </div>

              <Button
                size='sm'
                className='mt-3 w-full'
                disabled={!item.is_in_stock}
                // Add cart logic here when ready
                onClick={() => {
                  // e.g., addToCart(item.product_id)
                  toast.info('Add to cart coming soon');
                }}
              >
                {item.is_in_stock ? 'Add to Cart' : 'Notify Me'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className='flex justify-center gap-2 pt-4'>
          <Button variant='outline' onClick={handlePrev} disabled={page === 0}>
            Previous
          </Button>
          <Button variant='outline' onClick={handleNext} disabled={page + 1 >= totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
