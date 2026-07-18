import type { ComponentProps } from 'react';
import React from 'react';

import { Label } from '@/components/ui/label';
import type { AsChildProps } from '@/components/ui/slot';
import { Slot } from '@/components/ui/slot';
import { cn } from '@/lib/utils';

import { useFieldContext } from './useFormContext';

/** Normalises TanStack Form / Zod field errors to a display string. */
export function getFieldErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return String(error);
}

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

  const message = React.useMemo(() => getFieldErrorMessage(rawError), [rawError]);

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
  const hasHeader = Boolean(label || detail);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {hasHeader ? (
        <div className='flex flex-col gap-0.5'>
          {label ? <FieldLabel>{label}</FieldLabel> : null}
          {/*
            Always reserve one description line so side-by-side fields keep
            their controls aligned when only one has helper text.
          */}
          <FieldDetail className={cn(!detail && 'invisible')} aria-hidden={!detail || undefined}>
            {detail || '\u00A0'}
          </FieldDetail>
        </div>
      ) : null}

      <Slot>{children}</Slot>

      {/* Reserve error-line height so a sibling error does not shift the other control. */}
      <div className='min-h-[1rem]'>
        <FieldMessage />
      </div>
    </div>
  );
}
