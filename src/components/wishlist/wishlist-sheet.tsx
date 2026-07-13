'use client';

import {
  IconArrowRight,
  IconDownload,
  IconHeart,
  IconRefresh,
  IconSearch,
  IconX
} from '@tabler/icons-react';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useDeferredValue, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { WishlistHeaderActions } from '@/domains/wishlist/components/wishlist-header-actions';
import { WishlistImportDialog } from '@/domains/wishlist/components/wishlist-import-dialog';
import { useWishlistActions } from '@/domains/wishlist/hooks/use-wishlist-actions';
import { useWishlistStore } from '@/domains/wishlist/wishlist.store';
import { useUser } from '@/hooks/useUser';

import { WishlistSheetItem } from './wishlist-sheet-item';

function WishlistSheetSkeleton() {
  return (
    <div className='flex-1 space-y-4 overflow-y-auto px-6 py-4'>
      {[1, 2, 3].map((i) => (
        <Flex key={i} spacing={4}>
          <Skeleton className='h-24 w-20 rounded-xl' />
          <Flex direction='column' spacing={2} className='flex-1'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
            <Skeleton className='h-8 w-28 rounded-full' />
          </Flex>
        </Flex>
      ))}
    </div>
  );
}

export function WishlistSheet() {
  const isOpen = useWishlistStore((s) => s.isSheetOpen);
  const setSheetOpen = useWishlistStore((s) => s.setSheetOpen);
  const closeSheet = useWishlistStore((s) => s.closeSheet);
  const t = useTranslations('common');
  const tWish = useTranslations('wishlist');

  const { isAuthenticated, loading: isAuthLoading } = useUser();
  const [query, setQuery] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const { items, total, isLoading, isError, refetch, removingProductId, removeItem } =
    useWishlistActions('name', isAuthenticated && isOpen && !isAuthLoading);

  const filteredItems =
    deferredQuery.length === 0
      ? items
      : items.filter((item) => (item.product_name ?? '').toLowerCase().includes(deferredQuery));

  const handleOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setQuery('');
    }
  };

  const productIds = items
    .map((item) => item.product_id)
    .filter((id): id is number => typeof id === 'number' && id > 0);

  const showWishlistActions = isAuthenticated && !isAuthLoading && !isLoading && !isError;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className='flex w-full flex-col gap-0 p-0 sm:max-w-md'>
        <SheetHeader className='border-border border-b px-6 py-5 text-left'>
          <Flex align='start' justify='between' spacing={3}>
            <div>
              <SheetTitle className='font-display text-xl'>
                {total > 0 ? tWish('titleWithCount', { count: total }) : tWish('sheetTitle')}
              </SheetTitle>
              {isAuthenticated && total > 0 ? (
                <Typography.Muted className='mt-1 text-sm'>
                  {tWish('subtitle', { count: total })}
                </Typography.Muted>
              ) : null}
            </div>
            {showWishlistActions ? (
              <Flex direction='row' align='center' spacing={1} className='me-3 -mt-1'>
                {items.length > 0 ? (
                  <WishlistHeaderActions
                    itemLength={items.length}
                    productIds={productIds}
                    isClearing={false}
                    onClearAll={() => undefined}
                    showImport={false}
                    showClear={false}
                  />
                ) : null}
                <Button
                  variant='ghost'
                  size='icon-sm'
                  className='rounded-full'
                  aria-label={tWish('refresh')}
                  onClick={() => void refetch()}
                >
                  <IconRefresh className='size-4' />
                </Button>
              </Flex>
            ) : null}
          </Flex>
          <SheetDescription className='sr-only'>{tWish('sheetDescription')}</SheetDescription>
        </SheetHeader>

        {isAuthLoading ? (
          <WishlistSheetSkeleton />
        ) : !isAuthenticated ? (
          <Flex
            direction='column'
            align='center'
            justify='center'
            spacing={4}
            className='flex-1 px-6 py-12 text-center'
          >
            <Flex align='center' justify='center' className='bg-muted/60 size-16 rounded-full'>
              <IconHeart className='text-muted-foreground size-8' />
            </Flex>
            <div className='space-y-1'>
              <Typography.H3 family='display' className='text-lg font-semibold'>
                {tWish('signInTitle')}
              </Typography.H3>
              <Typography.Muted className='text-sm leading-relaxed'>
                {tWish('guestDescription')}
              </Typography.Muted>
            </div>
            <Flex direction='column' spacing={2} className='w-full max-w-xs'>
              <Button asChild className='rounded-full' onClick={closeSheet}>
                <Link href='/login?callbackUrl=/wishlist'>
                  {t('signIn')}
                  <IconArrowRight className='cn-rtl-flip size-4' />
                </Link>
              </Button>
              <Button
                type='button'
                variant='outline'
                className='rounded-full'
                onClick={() => setImportOpen(true)}
              >
                <IconDownload className='size-4' />
                {tWish('import.action')}
              </Button>
              <Button asChild variant='outline' className='rounded-full' onClick={closeSheet}>
                <Link href='/shop'>{t('continueShopping')}</Link>
              </Button>
            </Flex>
            <WishlistImportDialog open={importOpen} onOpenChange={setImportOpen} />
          </Flex>
        ) : isLoading ? (
          <WishlistSheetSkeleton />
        ) : isError ? (
          <Flex
            direction='column'
            align='center'
            justify='center'
            spacing={4}
            className='flex-1 px-6 py-12 text-center'
          >
            <Typography.Text className='text-destructive font-medium'>
              {tWish('errorTitle')}
            </Typography.Text>
            <Typography.Muted className='text-sm'>{tWish('errorDescription')}</Typography.Muted>
            <Button variant='outline' className='rounded-full' onClick={() => void refetch()}>
              {tWish('retry')}
            </Button>
          </Flex>
        ) : items.length === 0 ? (
          <Flex
            direction='column'
            align='center'
            justify='center'
            spacing={4}
            className='flex-1 px-6 py-12 text-center'
          >
            <Flex align='center' justify='center' className='bg-muted/60 size-16 rounded-full'>
              <IconHeart className='text-muted-foreground size-8' />
            </Flex>
            <div className='space-y-1'>
              <Typography.H3 family='display' className='text-lg font-semibold'>
                {tWish('emptyTitle')}
              </Typography.H3>
              <Typography.Muted className='text-sm'>{tWish('emptyDescription')}</Typography.Muted>
            </div>
            <Flex direction='column' spacing={2} className='w-full max-w-xs'>
              <Button asChild className='mt-1 rounded-full' onClick={closeSheet}>
                <Link href='/shop'>
                  {t('continueShopping')}
                  <IconArrowRight className='cn-rtl-flip size-4' />
                </Link>
              </Button>
              <Button
                type='button'
                variant='outline'
                className='rounded-full'
                onClick={() => setImportOpen(true)}
              >
                <IconDownload className='size-4' />
                {tWish('import.action')}
              </Button>
            </Flex>
            <WishlistImportDialog open={importOpen} onOpenChange={setImportOpen} />
          </Flex>
        ) : (
          <>
            <div className='border-border border-b px-6 py-3'>
              <div className='relative'>
                <IconSearch className='text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2' />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={tWish('searchPlaceholder')}
                  className='h-10 rounded-full ps-9 pe-9'
                  aria-label={tWish('searchPlaceholder')}
                />
                {query ? (
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    className='absolute end-1.5 top-1/2 -translate-y-1/2 rounded-full'
                    aria-label={tWish('clearSearch')}
                    onClick={() => setQuery('')}
                  >
                    <IconX className='size-3.5' />
                  </Button>
                ) : null}
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <Flex
                direction='column'
                align='center'
                justify='center'
                spacing={2}
                className='flex-1 px-6 py-12 text-center'
              >
                <Typography.Text className='font-medium'>{tWish('noMatches')}</Typography.Text>
                <Typography.Muted className='text-sm'>{tWish('noMatchesHint')}</Typography.Muted>
              </Flex>
            ) : (
              <div className='flex-1 overflow-y-auto px-6 py-2'>
                <div className='divide-border divide-y'>
                  <AnimatePresence mode='popLayout' initial={false}>
                    {filteredItems.map((item, index) => (
                      <WishlistSheetItem
                        key={item.product_id}
                        item={item}
                        index={index}
                        isRemoving={removingProductId === item.product_id}
                        onRemove={(productId) => void removeItem(productId)}
                        onNavigate={closeSheet}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <SheetFooter className='border-border bg-muted/30 border-t p-6'>
              <Flex direction='column' spacing={2} className='w-full'>
                <Button asChild className='h-11 w-full rounded-full' size='lg'>
                  <Link href='/wishlist' onClick={closeSheet}>
                    {tWish('viewFull')}
                    <IconArrowRight className='cn-rtl-flip size-4' />
                  </Link>
                </Button>
                <Button variant='outline' size='lg' className='rounded-full' onClick={closeSheet}>
                  {tWish('keepBrowsing')}
                </Button>
              </Flex>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
