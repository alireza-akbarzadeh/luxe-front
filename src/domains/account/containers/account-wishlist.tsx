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
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('account.wishlist');
  const tCommon = useTranslations('account.common');

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

      toast.success(t('removed'));
    } catch {
      toast.error(t('removeFailed'));
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
        <p className='text-destructive font-medium'>{t('loadError')}</p>
        <p className='text-muted-foreground mt-2 text-sm'>{tCommon('connectionError')}</p>
        <Button variant='outline' className='mt-5' onClick={() => void refetch()}>
          {tCommon('retry')}
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
        <h3 className='font-display text-xl font-semibold'>{t('emptyTitle')}</h3>
        <p className='text-muted-foreground mx-auto mt-2 max-w-sm text-sm'>{t('emptyDescription')}</p>
        <Button asChild className='mt-6'>
          <Link href='/shop'>
            <IconShoppingBag className='size-4' />
            {t('exploreProducts')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <h2 className='font-display text-2xl font-semibold tracking-tight'>{t('title')}</h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            {t('savedCount', { count: total })}
            {totalSavings > 0 ? (
              <>
                {' '}
                {t('saveUpTo', { amount: formatOrderAmount(totalSavings) })}
              </>
            ) : null}
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Select value={sort} onValueChange={(value) => handleSortChange(value as WishlistSort)}>
            <SelectTrigger className='w-[180px] rounded-full'>
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='name'>{t('sortName')}</SelectItem>
              <SelectItem value='price-asc'>{t('sortPriceAsc')}</SelectItem>
              <SelectItem value='price-desc'>{t('sortPriceDesc')}</SelectItem>
            </SelectContent>
          </Select>

          <Button asChild variant='outline' size='sm'>
            <Link href='/wishlist'>
              {t('fullWishlist')}
              <IconArrowRight className='cn-rtl-flip size-4' />
            </Link>
          </Button>

          {totalPages > 1 ? (
            <div className='flex items-center gap-1'>
              <Button variant='outline' size='icon-sm' onClick={handlePrev} disabled={page === 0}>
                <IconChevronLeft className='cn-rtl-flip size-4' />
              </Button>
              <span className='text-muted-foreground min-w-24 text-center text-sm tabular-nums'>
                {tCommon('pageOf', { current: page + 1, total: totalPages })}
              </span>
              <Button
                variant='outline'
                size='icon-sm'
                onClick={handleNext}
                disabled={page + 1 >= totalPages}
              >
                <IconChevronRight className='cn-rtl-flip size-4' />
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
            {tCommon('previous')}
          </Button>
          <Button variant='outline' onClick={handleNext} disabled={page + 1 >= totalPages}>
            {tCommon('next')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
