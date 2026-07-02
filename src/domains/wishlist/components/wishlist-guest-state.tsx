'use client';

import { IconArrowRight, IconChevronRight, IconHeart } from '@tabler/icons-react';
import Link from 'next/link';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

export function WishlistGuestState() {
  return (
    <main className='app-container pt-2 pb-6 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-16'>
      <DynamicBreadcrumb
        items={[{ label: 'My Wishlist' }]}
        direction='column'
        separator={<IconChevronRight className='h-3 w-3' />}
        className='text-muted-foreground mb-4 hidden text-xs sm:flex'
        breadcrumbClassName='flex items-center gap-1.5'
      />

      <Flex
        direction='column'
        align='center'
        className='bg-card border-border/60 mx-auto max-w-lg rounded-3xl border p-8 text-center shadow-sm sm:p-10'
      >
        <span className='bg-muted mb-5 flex size-16 items-center justify-center rounded-full'>
          <IconHeart className='text-muted-foreground size-8' />
        </span>
        <Typography.H2 family='display' className='text-2xl font-semibold sm:text-3xl'>
          Sign in to view your wishlist
        </Typography.H2>
        <Typography.Muted className='mt-3 mb-8 max-w-sm text-sm leading-relaxed'>
          Save favorites across devices and move items to cart when you&apos;re ready.
        </Typography.Muted>
        <Flex direction='column' gap={3} className='w-full sm:w-auto sm:flex-row'>
          <Button asChild className='h-12 w-full rounded-full sm:w-auto' size='lg'>
            <Link href='/login?callbackUrl=/wishlist'>
              Sign in
              <IconArrowRight className='ms-2 size-4' />
            </Link>
          </Button>
          <Button
            asChild
            variant='outline'
            className='h-12 w-full rounded-full sm:w-auto'
            size='lg'
          >
            <Link href='/shop'>Browse shop</Link>
          </Button>
        </Flex>
      </Flex>
    </main>
  );
}
