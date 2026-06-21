'use client';

import type { TablerIcon } from '@tabler/icons-react';
import type { ComponentProps } from 'react';

import { useFieldContext } from '@/components/forms/useFormContext';
import { NumberInput } from '@/components/ui/number-input';
import { cn } from '@/lib/utils';

import { FieldContainer } from './form';

interface NumberFieldProps extends Omit<
  ComponentProps<typeof NumberInput>,
  'value' | 'onValueChange'
> {
  label?: string;
  detail?: string;
  startIcon?: TablerIcon;
  endIcon?: TablerIcon;
}

export function NumberField({
  label,
  detail,
  startIcon: StartIcon,
  endIcon: EndIcon,
  className,
  ...props
}: NumberFieldProps) {
  const field = useFieldContext<number | null>();

  return (
    <FieldContainer label={label} detail={detail}>
      <div className='relative w-full'>
        {StartIcon && (
          <StartIcon className='text-muted-foreground pointer-events-none absolute top-1/2 start-4 size-4 -translate-y-1/2' />
        )}

        <NumberInput
          {...props}
          value={field.state.value}
          onValueChange={field.handleChange}
          onBlur={field.handleBlur}
          className={cn(StartIcon && 'ps-12', EndIcon && 'pe-12', className)}
        />

        {EndIcon && (
          <EndIcon className='text-muted-foreground pointer-events-none absolute top-1/2 end-4 size-4 -translate-y-1/2' />
        )}
      </div>
    </FieldContainer>
  );
}
