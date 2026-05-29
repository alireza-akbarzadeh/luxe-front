import type { ComponentProps, ReactNode } from 'react';

import { Checkbox as ShadcnCheckbox } from '../ui/checkbox';
import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

export function Checkbox({
  label,
  className,
  ...props
}: {
  label: string | ReactNode;
} & ComponentProps<typeof ShadcnCheckbox>) {
  const field = useFieldContext<boolean>();

  return (
    <FieldContainer label={label}>
      <ShadcnCheckbox
        {...props}
        name={field.name}
        checked={field.state.value ?? false}
        onCheckedChange={(checked) => field.handleChange(!!checked)}
        onBlur={field.handleBlur}
        className={className}
      />
    </FieldContainer>
  );
}
