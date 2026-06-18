'use client';

import { Button } from '@/components/ui/button';

export default function ReturnDetailError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='flex min-h-[50vh] items-center justify-center p-8'>
      <div className='max-w-md rounded-2xl border border-dashed p-12 text-center'>
        <h2 className='text-lg font-semibold'>Could not load return</h2>
        <p className='text-muted-foreground mt-2 text-sm'>{error.message}</p>
        <Button className='mt-4' variant='outline' onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
