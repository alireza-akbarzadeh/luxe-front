'use client';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IconMinus, IconPlus, IconShoppingBag, IconTrash } from '@tabler/icons-react';
import { useCartStore } from '~/src/store/card.store';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/useCartController';
import Link from 'next/link';

export function CartSheet() {
  const setOpen = useCartStore((s) => s.setOpen);
  const isOpen = useCartStore((s) => s.isOpen);

  const {
    items,
    itemCount,
    subtotal,
    updateQuantity,
    removeItem,
    isLoading,
    isUpdating,
    isRemoving
  } = useCart();

  const getItemVariant = (item: { color: string; size: string }) => {
    const parts = [item.color, item.size].filter(Boolean);
    return parts.length ? ` · ${parts.join(' · ')}` : '';
  };

  if (isLoading) {
    return (
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent className='flex w-full flex-col gap-0 p-0 sm:max-w-md'>
          <SheetHeader className='border-border border-b px-6 py-5'>
            <SheetTitle className='font-display text-xl'>Your Cart · loading...</SheetTitle>
          </SheetHeader>
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
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className='flex w-full flex-col gap-0 p-0 sm:max-w-md'>
        <SheetHeader className='border-border border-b px-6 py-5'>
          <SheetTitle className='font-display text-xl'>Your Cart · {itemCount}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center'>
            <div className='bg-secondary rounded-full p-5'>
              <IconShoppingBag className='text-muted-foreground h-7 w-7' />
            </div>
            <p className='font-display text-lg'>Your cart is empty</p>
            <p className='text-muted-foreground text-sm'>
              Discover pieces designed to last a decade.
            </p>
            <Button asChild onClick={() => setOpen(false)} className='mt-2'>
              <Link href='/shop'>Continue shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className='flex-1 overflow-y-auto px-6 py-4'>
              <ul className='divide-border divide-y'>
                {items.map((item: any) => (
                  <li key={item.id} className='flex gap-4 py-4'>
                    {/* Clickable image */}
                    <Link
                      href={`/product/${item.product_id}`}
                      onClick={() => setOpen(false)}
                      className='shrink-0'
                    >
                      <div className='bg-muted h-24 w-20 overflow-hidden rounded-md'>
                        <img
                          src={item.image || '/placeholder.png'}
                          alt={item.name || 'Product'}
                          className='h-full w-full object-cover transition-transform hover:scale-105'
                        />
                      </div>
                    </Link>
                    <div className='flex flex-1 flex-col'>
                      <div className='flex items-start justify-between gap-2'>
                        <div>
                          {/* Clickable name */}
                          <Link
                            href={`/product/${item.product_id}`}
                            onClick={() => setOpen(false)}
                            className='hover:text-primary leading-tight font-medium transition-colors'
                          >
                            {item.name}
                          </Link>
                          {getItemVariant(item) && (
                            <p className='text-muted-foreground mt-0.5 text-xs'>
                              {getItemVariant(item)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isRemoving}
                          className='text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50'
                          aria-label='Remove'
                        >
                          <IconTrash className='h-4 w-4' />
                        </button>
                      </div>
                      <div className='mt-auto flex items-center justify-between'>
                        <div className='border-border flex items-center rounded-full border'>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                            className='hover:bg-secondary rounded-l-full p-1.5 disabled:opacity-40'
                          >
                            <IconMinus className='h-3 w-3' />
                          </button>
                          <span className='w-7 text-center text-sm'>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating}
                            className='hover:bg-secondary rounded-r-full p-1.5 disabled:opacity-40'
                          >
                            <IconPlus className='h-3 w-3' />
                          </button>
                        </div>
                        <p className='text-sm font-semibold'>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className='border-border bg-secondary/50 border-t p-6'>
              <div className='w-full space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Separator className='my-2' />
                <div className='flex justify-between text-base font-semibold'>
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <p className='text-muted-foreground text-xs'>Shipping calculated at checkout.</p>

                {/* Action buttons: View Cart + Checkout */}
                <div className='mt-3 flex flex-col gap-2'>
                  <Button asChild variant='outline' className='w-full'>
                    <Link href='/cart' onClick={() => setOpen(false)}>
                      View Full Cart
                    </Link>
                  </Button>
                  <Button asChild className='w-full' size='lg'>
                    <Link href='/checkout' onClick={() => setOpen(false)}>
                      Proceed to Checkout
                    </Link>
                  </Button>
                  <Button variant='ghost' className='w-full' onClick={() => setOpen(false)}>
                    Continue shopping
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
