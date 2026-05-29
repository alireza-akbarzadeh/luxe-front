import type { ComponentProps } from 'react';

import { Switch as ShadcnSwitch } from '../ui/switch';
import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

export function Switch({
  label,
  ...props
}: {
  label: string;
} & ComponentProps<typeof ShadcnSwitch>) {
  const field = useFieldContext<boolean>();

  return (
    <FieldContainer label={label}>
      <ShadcnSwitch
        {...props}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked)}
        onBlur={field.handleBlur}
      />
    </FieldContainer>
  );
}
