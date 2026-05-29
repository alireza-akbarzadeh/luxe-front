import { IconLoader2 } from '@tabler/icons-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { useFormContext } from './useFormContext';

export function SubscribeButton({
  className,
  children,
  label,
  isPending,
  ...props
}: ComponentProps<typeof Button> & { label?: string; isPending?: boolean }) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
      children={([canSubmit, isSubmitting]) => (
        <Button
          type='submit'
          disabled={!canSubmit || isSubmitting}
          className={cn(
            'h-12 w-full cursor-pointer rounded-xl text-[10px] font-black tracking-widest uppercase',
            className
          )}
          {...props}
        >
          {(isSubmitting || isPending) && <IconLoader2 className='mr-2 h-5 w-5 animate-spin' />}
          {children || label}
        </Button>
      )}
    />
  );
}
