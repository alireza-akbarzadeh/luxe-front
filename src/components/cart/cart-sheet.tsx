'use client';

import { IconMinus, IconPlus, IconShoppingBag, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

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
import { formatPrice } from '@/domains/home/lib/home-utils';
import { useCartController } from '@/hooks/useCartController';
import { useUser } from '@/hooks/useUser';
import type { DtoCartItemDetail } from '~/src/services/-cart-get.schemas';
import { useCartStore } from '~/src/store/card.store';

function getItemImage(item: DtoCartItemDetail) {
  if (typeof item.image === 'string' && item.image.length > 0) return item.image;
  return '/placeholder.png';
}

function getItemName(item: DtoCartItemDetail) {
  return item.name || item.product_name || 'Product';
}

export function CartSheet() {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const closeCart = useCartStore((s) => s.closeCart);

  const { isAuthenticated } = useUser();
  const { increment, decrement, items, isLoading, itemCount, subtotal } = useCartController();

  const getItemVariant = (item: DtoCartItemDetail) => {
    const parts = [item.selected_color, item.selected_size].filter(Boolean);
    return parts.length ? parts.join(' · ') : '';
  };

  const mapBasketItemToPayload = (item: DtoCartItemDetail) => ({
    color: item.selected_color,
    image_url: getItemImage(item),
    is_in_stock: item.is_in_stock,
    price: item.price,
    product_id: item.product_id,
    product_name: getItemName(item),
    size: item.selected_size,
    stock: item.stock
  });

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className='flex w-full flex-col gap-0 p-0 sm:max-w-md'>
        <SheetHeader className='border-border border-b px-6 py-5 text-left'>
          <SheetTitle className='font-display text-xl'>
            Your cart{itemCount > 0 ? ` · ${itemCount}` : ''}
          </SheetTitle>
          <SheetDescription className='sr-only'>
            Review items in your shopping cart
          </SheetDescription>
        </SheetHeader>

        {!isAuthenticated ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center'>
            <div className='bg-secondary rounded-full p-5'>
              <IconShoppingBag className='text-muted-foreground h-7 w-7' />
            </div>
            <div className='space-y-1'>
              <p className='font-display text-lg'>Sign in to view your cart</p>
              <p className='text-muted-foreground text-sm'>
                Save items across devices and checkout securely.
              </p>
            </div>
            <div className='flex w-full max-w-xs flex-col gap-2'>
              <Button asChild className='rounded-full' onClick={closeCart}>
                <Link href='/login'>Sign in</Link>
              </Button>
              <Button asChild variant='outline' className='rounded-full' onClick={closeCart}>
                <Link href='/shop'>Continue shopping</Link>
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <div className='flex-1 space-y-4 overflow-y-auto px-6 py-4'>
            {[1, 2].map((i) => (
              <div key={i} className='flex gap-4'>
                <Skeleton className='h-24 w-20 rounded-md' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-3 w-1/2' />
                  <Skeleton className='h-8 w-24' />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center'>
            <div className='bg-secondary rounded-full p-5'>
              <IconShoppingBag className='text-muted-foreground h-7 w-7' />
            </div>
            <p className='font-display text-lg'>Your cart is empty</p>
            <p className='text-muted-foreground text-sm'>
              Discover pieces designed to last a decade.
            </p>
            <Button asChild className='mt-2 rounded-full' onClick={closeCart}>
              <Link href='/shop'>Continue shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className='flex-1 overflow-y-auto px-6 py-4'>
              <ul className='divide-border divide-y'>
                {items.map((item) => {
                  const controllerPayload = mapBasketItemToPayload(item);
                  const lineTotal = (item.price ?? 0) * (item.quantity ?? 0);

                  return (
                    <li key={item.id} className='flex gap-4 py-4'>
                      <Link
                        href={`/product/${item.product_id}`}
                        onClick={closeCart}
                        className='shrink-0'
                      >
                        <div className='bg-muted relative h-24 w-20 overflow-hidden rounded-lg'>
                          <Image
                            src={getItemImage(item)}
                            alt={getItemName(item)}
                            fill
                            sizes='80px'
                            className='object-cover transition-transform hover:scale-105'
                          />
                        </div>
                      </Link>

                      <div className='flex min-w-0 flex-1 flex-col'>
                        <div className='flex items-start justify-between gap-2'>
                          <div className='min-w-0'>
                            <Link
                              href={`/product/${item.product_id}`}
                              onClick={closeCart}
                              className='hover:text-accent line-clamp-2 leading-tight font-medium transition-colors'
                            >
                              {getItemName(item)}
                            </Link>
                            {getItemVariant(item) && (
                              <p className='text-muted-foreground mt-0.5 text-xs'>
                                {getItemVariant(item)}
                              </p>
                            )}
                          </div>
                          <button
                            type='button'
                            onClick={() => decrement(controllerPayload)}
                            className='text-muted-foreground hover:text-destructive shrink-0 transition-colors'
                            aria-label='Remove item'
                          >
                            <IconTrash className='h-4 w-4' />
                          </button>
                        </div>

                        <div className='mt-auto flex items-center justify-between pt-3'>
                          <div className='border-border flex items-center rounded-full border'>
                            <button
                              type='button'
                              onClick={() => decrement(controllerPayload)}
                              disabled={(item.quantity ?? 0) <= 0}
                              className='hover:bg-secondary rounded-l-full p-1.5 disabled:opacity-40'
                              aria-label='Decrease quantity'
                            >
                              <IconMinus className='h-3 w-3' />
                            </button>
                            <span className='w-7 text-center text-sm tabular-nums'>
                              {item.quantity ?? 0}
                            </span>
                            <button
                              type='button'
                              onClick={() => increment(controllerPayload)}
                              className='hover:bg-secondary rounded-r-full p-1.5 disabled:opacity-40'
                              aria-label='Increase quantity'
                            >
                              <IconPlus className='h-3 w-3' />
                            </button>
                          </div>
                          <p className='text-sm font-semibold tabular-nums'>
                            {formatPrice(lineTotal)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <SheetFooter className='border-border bg-muted/30 border-t p-6'>
              <div className='w-full space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span className='font-medium tabular-nums'>{formatPrice(subtotal)}</span>
                </div>
                <Separator />
                <div className='flex justify-between text-base font-semibold'>
                  <span>Total</span>
                  <span className='tabular-nums'>{formatPrice(subtotal)}</span>
                </div>
                <p className='text-muted-foreground text-xs'>Shipping calculated at checkout.</p>

                <div className='flex flex-col gap-2 pt-1'>
                  <Button asChild className='h-11 w-full rounded-full' size='lg'>
                    <Link href='/checkout' onClick={closeCart}>
                      Proceed to checkout
                    </Link>
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
