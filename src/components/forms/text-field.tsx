import type { TablerIcon } from '@tabler/icons-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

import { Input } from '../ui/input';
import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

interface TextFieldProps extends ComponentProps<typeof Input> {
  label?: string;
  detail?: string;
  startIcon?: TablerIcon;
  endIcon?: TablerIcon;
}

export function TextField({
  label,
  detail,
  placeholder,
  startIcon: StartIcon,
  endIcon: EndIcon,
  className,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string>();

  return (
    <FieldContainer label={label} detail={detail}>
      <div className='relative w-full'>
        {StartIcon && (
          <StartIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2' />
        )}

        <Input
          {...props}
          name={field.name}
          value={field.state.value}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className={cn(StartIcon && 'pl-12', EndIcon && 'pr-12', className)}
        />
        {EndIcon && (
          <EndIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2' />
        )}
      </div>
    </FieldContainer>
  );
}
