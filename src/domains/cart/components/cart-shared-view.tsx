'use client';

import {
  IconArrowRight,
  IconChevronRight,
  IconDownload,
  IconShoppingBag,
  IconX
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { formatOrderAmount } from '@/domains/account/lib/order-utils';
import { useCartShareQuery } from '@/domains/cart/hooks/use-cart-share-query';
import { useSharedCart } from '@/domains/cart/hooks/use-shared-cart';
import { IMAGE_FALLBACK } from '@/lib/images';

type CartSharedViewProps = {
  shareCode: string;
  isAuthenticated: boolean;
};

function SharedCartSkeleton() {
  return (
    <div className='space-y-3'>
      {Array.from({ length: 3 }).map((_, index) => (
        <Flex key={index} spacing={4} className='rounded-2xl border p-4'>
          <Skeleton className='h-24 w-20 rounded-xl' />
          <Flex direction='column' spacing={2} className='flex-1'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
            <Skeleton className='h-8 w-24 rounded-full' />
          </Flex>
        </Flex>
      ))}
    </div>
  );
}

export function CartSharedView({ shareCode, isAuthenticated }: Readonly<CartSharedViewProps>) {
  const t = useTranslations('cart.shared');
  const [, setShareCode] = useCartShareQuery();
  const {
    hasValidShare,
    previewItems,
    itemCount,
    sourceCount,
    isLoading,
    isError,
    refetch,
    isImporting,
    saveSelectedToCart,
    removeLine
  } = useSharedCart(shareCode);

  const clearShare = () => {
    void setShareCode(null);
  };

  const removedCount = Math.max(0, sourceCount - previewItems.length);
  const saveLabel =
    removedCount > 0 ? t('saveSelected', { count: previewItems.length }) : t('saveAll');

  return (
    <main className='app-container pt-2 pb-6 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-16'>
      <DynamicBreadcrumb
        items={[{ label: t('breadcrumb'), href: '/cart' }, { label: t('title') }]}
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
              {t('subtitle', { count: itemCount })}
              {removedCount > 0 ? ` · ${t('removedHint', { count: removedCount })}` : null}
            </Typography.Muted>
            {hasValidShare && previewItems.length > 0 ? (
              <Typography.Muted className='mt-1 text-xs'>{t('editHint')}</Typography.Muted>
            ) : null}
          </div>

          <Flex spacing={2} className='shrink-0 flex-wrap'>
            <Button variant='outline' className='rounded-full' onClick={clearShare}>
              {t('viewMine')}
            </Button>
            {isAuthenticated && hasValidShare ? (
              <Button
                className='rounded-full'
                loading={isImporting}
                disabled={isImporting || previewItems.length === 0}
                onClick={() => {
                  void saveSelectedToCart().then((ok) => {
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
            <IconShoppingBag className='text-muted-foreground size-8' />
            <Typography.H2 family='display' className='text-xl font-semibold'>
              {t('invalidTitle')}
            </Typography.H2>
            <Typography.Muted className='text-sm'>{t('invalidDescription')}</Typography.Muted>
            <Button className='rounded-full' onClick={clearShare}>
              {t('viewMine')}
            </Button>
          </Flex>
        ) : isLoading ? (
          <SharedCartSkeleton />
        ) : isError ? (
          <Flex direction='column' align='center' spacing={3} className='py-12 text-center'>
            <Typography.Text className='text-destructive font-medium'>
              {t('errorTitle')}
            </Typography.Text>
            <Button variant='outline' className='rounded-full' onClick={() => void refetch()}>
              {t('retry')}
            </Button>
          </Flex>
        ) : previewItems.length === 0 ? (
          <Flex direction='column' align='center' spacing={3} className='py-12 text-center'>
            <Typography.H2 family='display' className='text-xl font-semibold'>
              {sourceCount > 0 ? t('allRemovedTitle') : t('emptyTitle')}
            </Typography.H2>
            <Typography.Muted className='text-sm'>
              {sourceCount > 0 ? t('allRemovedDescription') : t('emptyDescription')}
            </Typography.Muted>
            {sourceCount > 0 ? (
              <Button className='rounded-full' onClick={clearShare}>
                {t('viewMine')}
              </Button>
            ) : (
              <Button asChild className='rounded-full'>
                <Link href='/shop'>
                  {t('browseShop')}
                  <IconArrowRight className='cn-rtl-flip size-4' />
                </Link>
              </Button>
            )}
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
                    href={`/login?callbackUrl=${encodeURIComponent(`/cart?share=${shareCode}`)}`}
                  >
                    {t('signIn')}
                  </Link>
                </Button>
              </Flex>
            ) : null}

            <ul className='divide-border divide-y rounded-2xl border'>
              {previewItems.map(({ key, line, product }) => {
                const name = product?.name ?? t('unknownProduct');
                const image = product?.images?.[0] ?? IMAGE_FALLBACK;
                const href = product?.id ? `/product/${product.id}` : '/shop';

                return (
                  <li key={key} className='px-4'>
                    <Flex spacing={4} className='py-4'>
                      <Link
                        href={href}
                        className='bg-muted relative h-24 w-20 shrink-0 overflow-hidden rounded-xl'
                      >
                        <AppImage
                          src={image}
                          alt={name}
                          fill
                          sizes='80px'
                          className='object-cover'
                        />
                      </Link>
                      <Flex direction='column' spacing={2} className='min-w-0 flex-1'>
                        <Flex align='start' justify='between' spacing={2}>
                          <Link
                            href={href}
                            className='hover:text-accent line-clamp-2 font-medium transition-colors'
                          >
                            {name}
                          </Link>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon-sm'
                            className='text-muted-foreground hover:text-destructive shrink-0 rounded-full'
                            aria-label={t('removeAria')}
                            onClick={() => removeLine(key)}
                          >
                            <IconX className='size-4' />
                          </Button>
                        </Flex>
                        <Flex align='center' spacing={2} className='flex-wrap'>
                          <Badge variant='muted' size='sm'>
                            {t('qty', { count: line.q })}
                          </Badge>
                          {line.c ? (
                            <Badge variant='outline' size='sm'>
                              {line.c}
                            </Badge>
                          ) : null}
                          {line.s ? (
                            <Badge variant='outline' size='sm'>
                              {line.s}
                            </Badge>
                          ) : null}
                          {!product ? (
                            <Badge variant='destructive' size='sm'>
                              {t('unavailable')}
                            </Badge>
                          ) : null}
                        </Flex>
                        {product?.price != null ? (
                          <Typography.Text className='text-sm font-semibold tabular-nums'>
                            {formatOrderAmount(product.price * line.q)}
                          </Typography.Text>
                        ) : null}
                      </Flex>
                    </Flex>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Flex>
    </main>
  );
}
