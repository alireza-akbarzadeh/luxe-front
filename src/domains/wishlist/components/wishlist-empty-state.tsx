import { IconArrowRight, IconGift, IconHeart, IconLayersLinked } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function WishlistEmptyState() {
  return (
    <div className='bg-card border-border mx-auto max-w-xl rounded-3xl border p-10 text-center sm:p-14'>
      <div className='bg-muted/60 mx-auto mb-5 flex size-16 items-center justify-center rounded-full'>
        <IconHeart className='text-muted-foreground size-8' />
      </div>
      <h2 className='font-display text-2xl font-semibold'>Your wishlist is empty</h2>
      <p className='text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-relaxed'>
        Tap the heart on any product to save it here. This is your personal list — separate from
        our curated collections.
      </p>
      <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center'>
        <Button asChild className='rounded-full' size='lg'>
          <Link href='/shop'>
            Browse shop
            <IconArrowRight className='ml-2 size-4' />
          </Link>
        </Button>
        <Button asChild variant='outline' className='rounded-full' size='lg'>
          <Link href='/collections'>
            <IconLayersLinked className='mr-2 size-4' />
            Explore collections
          </Link>
        </Button>
      </div>
      <p className='text-muted-foreground mt-6 text-xs'>
        Shopping for someone else?{' '}
        <Link href='/gift-cards' className='text-accent inline-flex items-center gap-1 font-medium'>
          <IconGift className='size-3.5' />
          Buy a gift card
        </Link>
      </p>
    </div>
  );
}
