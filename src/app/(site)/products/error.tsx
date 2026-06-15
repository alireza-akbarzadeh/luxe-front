'use client';

import { IconRefresh } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';

export default function ProductsError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='app-container flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center'>
      <h2 className='font-display text-2xl font-semibold'>Something went wrong</h2>
      <p className='text-muted-foreground max-w-md text-sm'>
        We couldn&apos;t load the product catalog. Check your connection and try again.
      </p>
      <Button variant='outline' className='gap-2 rounded-full' onClick={reset}>
        <IconRefresh className='h-4 w-4' />
        Try again
      </Button>
    </div>
  );
}
