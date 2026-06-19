'use client';

import { IconRefresh } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';

export default function RevenueReportError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-8 text-center'>
      <div>
        <h2 className='text-lg font-semibold'>Something went wrong</h2>
        <p className='text-muted-foreground mt-1 max-w-md text-sm'>
          The revenue report could not be loaded. Please try again.
        </p>
      </div>
      <Button variant='outline' onClick={reset}>
        <IconRefresh className='mr-2 h-4 w-4' />
        Retry
      </Button>
    </div>
  );
}
