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
  /** Force input text direction (e.g. `ltr` for email in RTL locales). */
  inputDir?: 'ltr' | 'rtl' | 'auto';
  /** Optional normaliser applied to the raw input before it is stored. */
  transform?: (value: string) => string;
}

export function TextField(props: TextFieldProps) {
  const {
    label,
    detail,
    placeholder,
    startIcon: StartIcon,
    endIcon: EndIcon,
    inputDir,
    className,
    transform,
    ...rest
  } = props;

  const field = useFieldContext<string>();

  return (
    <FieldContainer label={label} detail={detail}>
      <div className='relative w-full' dir={inputDir === 'ltr' ? 'ltr' : undefined}>
        {StartIcon && (
          <StartIcon className='text-muted-foreground pointer-events-none absolute top-1/2 start-4 size-4 -translate-y-1/2' />
        )}
        <Input
          {...rest}
          dir={inputDir}
          name={field.name}
          value={field.state.value}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) =>
            field.handleChange(transform ? transform(e.target.value) : e.target.value)
          }
          className={cn(StartIcon && 'ps-12', EndIcon && 'pe-12', className)}
        />
        {EndIcon && (
          <EndIcon className='text-muted-foreground pointer-events-none absolute top-1/2 end-4 size-4 -translate-y-1/2' />
        )}
      </div>
    </FieldContainer>
  );
}
