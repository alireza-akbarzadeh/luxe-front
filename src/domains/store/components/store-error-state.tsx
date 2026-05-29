'use client';

import { IconAlertTriangle } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';

export function StoreErrorState({
  message,
  onRetryAction
}: {
  message?: string;
  onRetryAction?: () => void;
}) {
  return (
    <div
      role='alert'
      className='border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center rounded-2xl border px-6 py-16 text-center'
    >
      <IconAlertTriangle className='text-destructive mb-3 h-10 w-10' />
      <h3 className='text-lg font-semibold'>Something went wrong</h3>
      <p className='text-muted-foreground mt-1 max-w-md text-sm'>
        {message ?? "We couldn't load stores right now. Please try again."}
      </p>
      {onRetryAction && (
        <Button onClick={onRetryAction} className='mt-6 rounded-full'>
          Retry
        </Button>
      )}
    </div>
  );
}
