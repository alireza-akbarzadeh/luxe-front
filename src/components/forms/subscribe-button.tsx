import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { useFormContext } from './useFormContext';

export function SubscribeButton({
  className,
  children,
  label,
  isPending,
  disabled,
  ...props
}: ComponentProps<typeof Button> & { label?: string; isPending?: boolean }) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      children={([canSubmit, isSubmitting]) => {
        const isLoading = Boolean(isSubmitting || isPending);
        const isDisabled = Boolean(disabled || !canSubmit || isLoading);

        return (
          <Button
            type='submit'
            loading={isLoading}
            disabled={isDisabled}
            aria-busy={isLoading}
            className={cn(
              'h-12 w-full rounded-xl text-[10px] font-black tracking-widest uppercase',
              isLoading &&
                'border-border/70 bg-muted text-muted-foreground hover:bg-muted shadow-none hover:shadow-none active:scale-100 disabled:opacity-100',
              !isLoading && isDisabled && 'cursor-not-allowed opacity-50',
              className
            )}
            {...props}
          >
            {!isLoading ? children || label : null}
          </Button>
        );
      }}
    />
  );
}
