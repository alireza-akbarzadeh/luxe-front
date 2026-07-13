'use client';

import { IconArrowRight, IconDownload, IconRefresh, IconShoppingBag } from '@tabler/icons-react';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { CartHeaderActions } from '@/domains/cart/components/cart-header-actions';
import { CartImportDialog } from '@/domains/cart/components/cart-import-dialog';
import { FreeShippingProgress } from '@/domains/cart/components/free-shipping-progress';
import { useCartCheckoutAction } from '@/domains/cart/hooks/use-cart-checkout-action';
import { useCartOrderEstimate } from '@/domains/cart/hooks/use-cart-order-estimate';
import { formatEstimatedTaxLabel } from '@/domains/cart/lib/cart-commerce-settings';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { useCartController } from '@/hooks/useCartController';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import { useCartStore } from '~/src/store/card.store';

import { CartSheetItem } from './cart-sheet-item';

function CartSheetSkeleton() {
  return (
    <div className='flex-1 space-y-4 overflow-y-auto px-6 py-4'>
      {[1, 2].map((i) => (
        <div key={i} className='flex gap-4'>
          <Skeleton className='h-24 w-20 rounded-xl' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
            <Skeleton className='h-8 w-24 rounded-full' />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartSheet() {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const t = useTranslations('common');
  const tCart = useTranslations('cart');
  const tImport = useTranslations('cart.import');

  const { isAuthenticated, loading: isAuthLoading } = useUser();
  const { items, isLoading, error, refetch, itemCount, subtotal, updatingItemId, removingItemId } =
    useCartController();
  const [importOpen, setImportOpen] = useState(false);

  const { totalDiscount, shipping, tax, total, settings } = useCartOrderEstimate(items, subtotal);
  const { hasIncompleteVariants, proceedToCheckout } = useCartCheckoutAction(items, {
    redirectToCartOnBlock: true
  });

  const showCartActions = isAuthenticated && !isAuthLoading && !isLoading && !error;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className='flex w-full flex-col gap-0 p-0 sm:max-w-md'>
        <SheetHeader className='border-border border-b px-6 py-5 text-left'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <SheetTitle className='font-display text-xl'>
                {itemCount > 0
                  ? tCart('titleWithCount', { count: itemCount })
                  : tCart('sheetTitle')}
              </SheetTitle>
              {isAuthenticated && itemCount > 0 ? (
                <p className='text-muted-foreground mt-1 text-sm'>
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} · Review before checkout
                </p>
              ) : null}
            </div>
            {showCartActions ? (
              <div className='me-3 -mt-1 flex items-center gap-1'>
                {items.length > 0 ? <CartHeaderActions items={items} /> : null}
                <Button
                  variant='ghost'
                  size='icon-sm'
                  className='rounded-full'
                  aria-label='Refresh cart'
                  onClick={() => void refetch()}
                >
                  <IconRefresh className='size-4' />
                </Button>
              </div>
            ) : null}
          </div>
          <SheetDescription className='sr-only'>
            Review items in your shopping cart
          </SheetDescription>
        </SheetHeader>

        {isAuthLoading ? (
          <CartSheetSkeleton />
        ) : !isAuthenticated ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center'>
            <div className='bg-muted/60 flex size-16 items-center justify-center rounded-full'>
              <IconShoppingBag className='text-muted-foreground size-8' />
            </div>
            <div className='space-y-1'>
              <p className='font-display text-lg font-semibold'>{tCart('signInTitle')}</p>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {tCart('signInDescriptionShared')}
              </p>
            </div>
            <div className='flex w-full max-w-xs flex-col gap-2'>
              <Button asChild className='rounded-full' onClick={closeCart}>
                <Link href='/login?callbackUrl=/cart'>
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
                {tImport('action')}
              </Button>
              <Button asChild variant='ghost' className='rounded-full' onClick={closeCart}>
                <Link href='/shop'>{t('continueShopping')}</Link>
              </Button>
            </div>
            <CartImportDialog
              open={importOpen}
              onOpenChange={setImportOpen}
              onImported={closeCart}
            />
          </div>
        ) : isLoading ? (
          <CartSheetSkeleton />
        ) : error ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center'>
            <p className='text-destructive font-medium'>Couldn&apos;t load your cart</p>
            <p className='text-muted-foreground text-sm'>
              Something went wrong while fetching your items.
            </p>
            <Button variant='outline' className='rounded-full' onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center'>
            <div className='bg-muted/60 flex size-16 items-center justify-center rounded-full'>
              <IconShoppingBag className='text-muted-foreground size-8' />
            </div>
            <div className='space-y-1'>
              <p className='font-display text-lg font-semibold'>{tCart('emptyTitle')}</p>
              <p className='text-muted-foreground text-sm'>{tCart('emptyDescriptionShared')}</p>
            </div>
            <div className='flex w-full max-w-xs flex-col gap-2'>
              <Button asChild className='rounded-full' onClick={closeCart}>
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
                {tImport('action')}
              </Button>
            </div>
            <CartImportDialog
              open={importOpen}
              onOpenChange={setImportOpen}
              onImported={closeCart}
            />
          </div>
        ) : (
          <>
            <div className='flex-1 overflow-y-auto px-6 py-2'>
              <div className='divide-border divide-y'>
                <AnimatePresence mode='popLayout' initial={false}>
                  {items.map((item, index) => (
                    <CartSheetItem
                      key={item.id}
                      item={item}
                      index={index}
                      cartItemId={item.id ?? 0}
                      isUpdating={updatingItemId === item.id}
                      isRemoving={removingItemId === item.id}
                      onNavigate={closeCart}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <SheetFooter className='border-border bg-muted/30 border-t p-6'>
              <div className='w-full space-y-4'>
                <FreeShippingProgress subtotal={subtotal} />

                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>{tCart('subtotal')}</span>
                    <span className={cartMoneyClassName}>{formatCartMoney(subtotal)}</span>
                  </div>
                  {totalDiscount > 0 ? (
                    <div className='text-success flex justify-between'>
                      <span>Savings</span>
                      <span className={cartMoneyClassName}>-{formatCartMoney(totalDiscount)}</span>
                    </div>
                  ) : null}
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Shipping</span>
                    <span className={cartMoneyClassName}>
                      {shipping === 0 ? (
                        <span className='text-success font-medium'>Free</span>
                      ) : (
                        formatCartMoney(shipping)
                      )}
                    </span>
                  </div>
                  {settings.estimatedTaxEnabled && tax > 0 ? (
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        Est. tax ({formatEstimatedTaxLabel(settings.estimatedTaxRate)})
                      </span>
                      <span className={cartMoneyClassName}>{formatCartMoney(tax)}</span>
                    </div>
                  ) : null}
                </div>

                <Separator />

                <div className='flex items-center justify-between'>
                  <span className='font-semibold'>{tCart('estimatedTotal')}</span>
                  <span className={cn('text-xl font-semibold', cartMoneyClassName)}>
                    {formatCartMoney(total)}
                  </span>
                </div>

                <p className='text-muted-foreground text-xs'>
                  {settings.estimatedTaxEnabled
                    ? 'Final tax is confirmed at checkout based on your address.'
                    : 'Taxes calculated at checkout.'}
                </p>

                {hasIncompleteVariants ? (
                  <p className='text-warning text-xs leading-relaxed'>
                    Some items need color or size. You&apos;ll be taken to the full cart to choose
                    options.
                  </p>
                ) : null}

                <div className='flex flex-col gap-2 pt-1'>
                  <Button
                    type='button'
                    className='h-11 w-full rounded-full'
                    size='lg'
                    disabled={itemCount === 0}
                    onClick={() => proceedToCheckout(closeCart)}
                  >
                    {t('proceedToCheckout')}
                    <IconArrowRight className='cn-rtl-flip size-4' />
                  </Button>
                  <div className='grid grid-cols-2 gap-2'>
                    <Button
                      variant='outline'
                      size='lg'
                      className='rounded-full'
                      onClick={closeCart}
                    >
                      Keep shopping
                    </Button>
                    <Button asChild variant='outline' size='lg' className='rounded-full'>
                      <Link href='/cart' onClick={closeCart}>
                        Full cart
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
