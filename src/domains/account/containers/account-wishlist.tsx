'use client';

import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconShoppingBag
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getGetAccountSummaryQueryKey } from '~/src/services/-account-summary-get';
import {
  getGetAccountWishlistQueryKey,
  useGetAccountWishlist
} from '~/src/services/-account-wishlist-get';
import { usePostProductsIdLike } from '~/src/services/-products-{id}-like-post';

import { AccountWishlistItemCard } from '../components/account-wishlist-item-card';
import { AccountWishlistSkeleton } from '../components/account-wishlist-skeleton';
import { formatOrderAmount } from '../lib/order-utils';

const PAGE_SIZE = 9;

type WishlistSort = 'name' | 'price-asc' | 'price-desc';

export function AccountWishlist() {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<WishlistSort>('name');
  const [removingProductId, setRemovingProductId] = useState<number | null>(null);
  const offset = page * PAGE_SIZE;
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isError,
    refetch
  } = useGetAccountWishlist({
    limit: PAGE_SIZE,
    offset,
    sort
  });

  const items = response?.data?.items ?? [];
  const total = response?.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const { mutateAsync: toggleLike } = usePostProductsIdLike();

  const totalSavings = items.reduce((sum, item) => {
    if (item.old_price && item.price && item.old_price > item.price) {
      return sum + (item.old_price - item.price);
    }
    return sum;
  }, 0);

  const handleRemove = async (productId: number) => {
    setRemovingProductId(productId);
    try {
      await toggleLike({ id: productId, data: { like: false } });
      await queryClient.invalidateQueries({ queryKey: getGetAccountWishlistQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });

      if (items.length === 1 && page > 0) {
        setPage((current) => Math.max(0, current - 1));
      }

      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setRemovingProductId(null);
    }
  };

  const handleSortChange = (value: WishlistSort) => {
    setSort(value);
    setPage(0);
  };

  const handlePrev = () => setPage((current) => Math.max(0, current - 1));
  const handleNext = () => setPage((current) => Math.min(totalPages - 1, current + 1));

  if (isLoading) {
    return <AccountWishlistSkeleton />;
  }

  if (isError) {
    return (
      <div className='bg-card border-border rounded-2xl border p-10 text-center sm:p-12'>
        <p className='text-destructive font-medium'>Failed to load wishlist.</p>
        <p className='text-muted-foreground mt-2 text-sm'>
          Please check your connection and try again.
        </p>
        <Button variant='outline' className='mt-5' onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className='bg-card border-border rounded-2xl border p-10 text-center sm:p-14'>
        <div className='bg-muted/60 mx-auto mb-5 flex size-16 items-center justify-center rounded-full'>
          <IconHeart className='text-muted-foreground size-8' />
        </div>
        <h3 className='font-display text-xl font-semibold'>Your wishlist is empty</h3>
        <p className='text-muted-foreground mx-auto mt-2 max-w-sm text-sm'>
          Save items you love with the heart icon on any product, then find them here.
        </p>
        <Button asChild className='mt-6'>
          <Link href='/shop'>
            <IconShoppingBag className='size-4' />
            Explore products
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <h2 className='font-display text-2xl font-semibold tracking-tight'>My Wishlist</h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            {total} saved {total === 1 ? 'item' : 'items'}
            {totalSavings > 0 ? (
              <>
                {' '}
                · save up to{' '}
                <span className='text-accent font-medium'>
                  {formatOrderAmount(totalSavings)}
                </span>{' '}
                on this page
              </>
            ) : null}
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Select value={sort} onValueChange={(value) => handleSortChange(value as WishlistSort)}>
            <SelectTrigger className='w-[180px] rounded-full'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='name'>Name (A–Z)</SelectItem>
              <SelectItem value='price-asc'>Price: low to high</SelectItem>
              <SelectItem value='price-desc'>Price: high to low</SelectItem>
            </SelectContent>
          </Select>

          <Button asChild variant='outline' size='sm'>
            <Link href='/wishlist'>
              Full wishlist
              <IconArrowRight className='size-4' />
            </Link>
          </Button>

          {totalPages > 1 ? (
            <div className='flex items-center gap-1'>
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
      </div>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
        {items.map((item) =>
          item.product_id ? (
            <AccountWishlistItemCard
              key={item.product_id}
              item={item}
              isRemoving={removingProductId === item.product_id}
              onRemove={handleRemove}
            />
          ) : null
        )}
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
