import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export function FormRoot({ className, onSubmit, ...props }: ComponentProps<'form'>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSubmit?.(e);
      }}
      className={cn('w-full space-y-6', className)}
      {...props}
    />
  );
}
