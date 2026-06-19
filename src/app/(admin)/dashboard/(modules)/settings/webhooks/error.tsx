'use client';

import { Button } from '@/components/ui/button';

export default function WebhooksError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='rounded-xl border border-dashed p-12 text-center'>
      <h2 className='text-lg font-semibold'>Could not load webhook events</h2>
      <p className='text-muted-foreground mt-2 text-sm'>{error.message}</p>
      <Button className='mt-4' variant='outline' onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
