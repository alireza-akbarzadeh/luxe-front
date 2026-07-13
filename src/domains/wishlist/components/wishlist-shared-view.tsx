'use client';

import {
  IconArrowRight,
  IconChevronRight,
  IconDownload,
  IconHeart,
  IconX
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useSharedWishlist } from '@/domains/wishlist/hooks/use-shared-wishlist';
import { useWishlistShareQuery } from '@/domains/wishlist/hooks/use-wishlist-share-query';

type WishlistSharedViewProps = {
  shareCode: string;
  isAuthenticated: boolean;
};

function SharedWishlistSkeleton() {
  return (
    <Grid cols={2} className='gap-4 md:grid-cols-3 lg:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className='aspect-[3/4] w-full rounded-2xl' />
      ))}
    </Grid>
  );
}

export function WishlistSharedView({
  shareCode,
  isAuthenticated
}: Readonly<WishlistSharedViewProps>) {
  const t = useTranslations('wishlist.shared');
  const [, setShareCode] = useWishlistShareQuery();
  const {
    hasValidShare,
    products,
    isLoading,
    isError,
    refetch,
    isImporting,
    saveSelectedToWishlist,
    productIds,
    sourceCount,
    removeItem
  } = useSharedWishlist(shareCode);

  const clearShare = () => {
    void setShareCode(null);
  };

  const removedCount = Math.max(0, sourceCount - productIds.length);
  const saveLabel =
    removedCount > 0 ? t('saveSelected', { count: productIds.length }) : t('saveAll');

  return (
    <main className='app-container pt-2 pb-6 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-16'>
      <DynamicBreadcrumb
        items={[{ label: t('breadcrumb'), href: '/wishlist' }, { label: t('title') }]}
        direction='column'
        separator={<IconChevronRight className='h-3 w-3' />}
        className='text-muted-foreground hidden text-xs sm:flex'
        breadcrumbClassName='flex items-center gap-1.5'
      />

      <Flex direction='column' spacing={4} className='mt-4 lg:mt-6'>
        <Flex
          direction='column'
          spacing={3}
          className='sm:flex-row sm:items-start sm:justify-between'
        >
          <div className='min-w-0'>
            <Typography.H1
              family='display'
              className='text-2xl font-semibold sm:text-3xl lg:text-4xl'
            >
              {t('title')}
            </Typography.H1>
            <Typography.Muted className='mt-1 text-sm lg:text-base'>
              {t('subtitle', { count: productIds.length })}
              {removedCount > 0 ? ` · ${t('removedHint', { count: removedCount })}` : null}
            </Typography.Muted>
            {hasValidShare && products.length > 0 ? (
              <Typography.Muted className='mt-1 text-xs'>{t('editHint')}</Typography.Muted>
            ) : null}
          </div>

          <Flex direction='row' spacing={2} className='shrink-0 flex-wrap'>
            <Button variant='outline' className='rounded-full' onClick={clearShare}>
              {t('viewMine')}
            </Button>
            {isAuthenticated && hasValidShare ? (
              <Button
                className='rounded-full'
                loading={isImporting}
                disabled={isImporting || productIds.length === 0}
                onClick={() => {
                  void saveSelectedToWishlist().then((ok) => {
                    if (ok) void setShareCode(null);
                  });
                }}
              >
                <IconDownload className='size-4' />
                {saveLabel}
              </Button>
            ) : null}
          </Flex>
        </Flex>

        {!hasValidShare ? (
          <Flex
            direction='column'
            align='center'
            spacing={3}
            className='bg-card border-border/60 mx-auto max-w-lg rounded-3xl border p-8 text-center'
          >
            <IconHeart className='text-muted-foreground size-8' />
            <Typography.H2 family='display' className='text-xl font-semibold'>
              {t('invalidTitle')}
            </Typography.H2>
            <Typography.Muted className='text-sm'>{t('invalidDescription')}</Typography.Muted>
            <Button className='rounded-full' onClick={clearShare}>
              {t('viewMine')}
            </Button>
          </Flex>
        ) : isLoading ? (
          <SharedWishlistSkeleton />
        ) : isError ? (
          <Flex direction='column' align='center' spacing={3} className='py-12 text-center'>
            <Typography.Text className='text-destructive font-medium'>
              {t('errorTitle')}
            </Typography.Text>
            <Button variant='outline' className='rounded-full' onClick={() => void refetch()}>
              {t('retry')}
            </Button>
          </Flex>
        ) : productIds.length === 0 ? (
          <Flex direction='column' align='center' spacing={3} className='py-12 text-center'>
            <Typography.H2 family='display' className='text-xl font-semibold'>
              {t('allRemovedTitle')}
            </Typography.H2>
            <Typography.Muted className='text-sm'>{t('allRemovedDescription')}</Typography.Muted>
            <Button className='rounded-full' onClick={clearShare}>
              {t('viewMine')}
            </Button>
          </Flex>
        ) : products.length === 0 ? (
          <Flex direction='column' align='center' spacing={3} className='py-12 text-center'>
            <Typography.H2 family='display' className='text-xl font-semibold'>
              {t('emptyTitle')}
            </Typography.H2>
            <Typography.Muted className='text-sm'>{t('emptyDescription')}</Typography.Muted>
            <Button asChild className='rounded-full'>
              <Link href='/shop'>
                {t('browseShop')}
                <IconArrowRight className='cn-rtl-flip size-4' />
              </Link>
            </Button>
          </Flex>
        ) : (
          <>
            {!isAuthenticated ? (
              <Flex
                align='center'
                justify='between'
                spacing={3}
                className='border-border/60 bg-muted/40 rounded-2xl border px-4 py-3'
              >
                <Typography.Muted className='text-sm'>{t('signInHint')}</Typography.Muted>
                <Button asChild size='sm' className='shrink-0 rounded-full'>
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(`/wishlist?share=${shareCode}`)}`}
                  >
                    {t('signIn')}
                  </Link>
                </Button>
              </Flex>
            ) : null}

            <Grid cols={2} className='gap-4 md:grid-cols-3 lg:grid-cols-4'>
              {products.map((product) =>
                product.id ? (
                  <Flex key={product.id} direction='column' spacing={2} className='min-w-0'>
                    <ProductCard product={product} />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='w-full rounded-full'
                      aria-label={t('removeAria')}
                      onClick={() => removeItem(product.id!)}
                    >
                      <IconX className='size-4' />
                      {t('remove')}
                    </Button>
                  </Flex>
                ) : null
              )}
            </Grid>
          </>
        )}
      </Flex>
    </main>
  );
}
