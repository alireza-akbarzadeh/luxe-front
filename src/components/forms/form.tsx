import type { ComponentProps } from 'react';
import React from 'react';

import { Label } from '@/components/ui/label';
import type { AsChildProps } from '@/components/ui/slot';
import { Slot } from '@/components/ui/slot';
import { cn } from '@/lib/utils';

import { useFieldContext } from './useFormContext';

type FieldLabelProps = ComponentProps<typeof Label>;
interface FieldDetailProps extends ComponentProps<'p'>, AsChildProps {}
interface FieldMessageProps extends ComponentProps<'p'>, AsChildProps {}
interface FieldContainerProps extends ComponentProps<'div'> {
  label?: React.ReactNode;
  detail?: string;
}

export function FieldLabel({ className, children, ...props }: FieldLabelProps) {
  const field = useFieldContext();
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <Label
      htmlFor={field.name}
      className={cn(
        'text-[11px] font-bold tracking-wider uppercase',
        hasError && 'text-destructive',
        className
      )}
      {...props}
    >
      {children}
    </Label>
  );
}

export function FieldDetail({ asChild, className, children, ...props }: FieldDetailProps) {
  const Comp = asChild ? Slot : 'p';

  return (
    <Comp className={cn('text-muted-foreground text-[10px] font-medium', className)} {...props}>
      {children}
    </Comp>
  );
}

export function FieldMessage({ asChild, className, children, ...props }: FieldMessageProps) {
  const field = useFieldContext();
  const Comp = asChild ? Slot : 'p';

  const rawError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? field.state.meta.errors[0]
      : null;

  const message = React.useMemo(() => {
    if (!rawError) return null;
    if (typeof rawError === 'string') return rawError;
    if (typeof rawError === 'object' && 'message' in rawError) return rawError.message;
    return String(rawError);
  }, [rawError]);

  if (!message && !children) return null;

  const testId = field.name ? `${field.name}-error` : 'field-error';

  return (
    <Comp
      data-testid={testId}
      className={cn(
        'text-[10px] font-bold',
        message ? 'text-destructive' : 'text-muted-foreground',
        className
      )}
      {...props}
    >
      {message || children}
    </Comp>
  );
}

export function FieldContainer({ label, detail, children, className }: FieldContainerProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {(label || detail) && (
        <div className='flex flex-col gap-0.5'>
          {label && <FieldLabel>{label}</FieldLabel>}
          {detail && <FieldDetail>{detail}</FieldDetail>}
        </div>
      )}

      <Slot>{children}</Slot>
      <FieldMessage />
    </div>
  );
}
