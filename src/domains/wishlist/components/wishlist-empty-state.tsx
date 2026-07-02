import { IconArrowRight, IconGift, IconHeart, IconLayersLinked } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

export function WishlistEmptyState() {
  return (
    <Flex
      direction='column'
      align='center'
      className='bg-card border-border/60 mx-auto max-w-xl rounded-3xl border p-8 text-center sm:p-12'
    >
      <span className='bg-muted/60 mb-5 flex size-16 items-center justify-center rounded-full'>
        <IconHeart className='text-muted-foreground size-8' />
      </span>
      <Typography.H2 family='display' className='text-2xl font-semibold'>
        Your wishlist is empty
      </Typography.H2>
      <Typography.Muted className='mx-auto mt-3 max-w-md text-sm leading-relaxed'>
        Tap the heart on any product to save it here. This is your personal list — separate from our
        curated collections.
      </Typography.Muted>
      <Flex direction='column' gap={3} className='mt-8 w-full sm:w-auto sm:flex-row'>
        <Button asChild className='h-12 w-full rounded-full sm:w-auto' size='lg'>
          <Link href='/shop'>
            Browse shop
            <IconArrowRight className='ms-2 size-4' />
          </Link>
        </Button>
        <Button asChild variant='outline' className='h-12 w-full rounded-full sm:w-auto' size='lg'>
          <Link href='/collections'>
            <IconLayersLinked className='me-2 size-4' />
            Explore collections
          </Link>
        </Button>
      </Flex>
      <Typography.Muted className='mt-6 text-xs'>
        Shopping for someone else?{' '}
        <Link href='/gift-cards' className='text-accent inline-flex items-center gap-1 font-medium'>
          <IconGift className='size-3.5' />
          Buy a gift card
        </Link>
      </Typography.Muted>
    </Flex>
  );
}
