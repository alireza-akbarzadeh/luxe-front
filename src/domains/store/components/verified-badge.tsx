import { IconSquareRoundedCheck } from '@tabler/icons-react';

import { cn } from '@/lib/utils';
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      aria-label='Verified store'
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-blue-500/10 p-0.5 text-blue-500',
        className
      )}
    >
      <IconSquareRoundedCheck className='h-4 w-4' />
    </span>
  );
}
