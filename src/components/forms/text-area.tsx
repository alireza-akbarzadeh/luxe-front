import type { ComponentProps } from 'react';

import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';

import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

export function TextArea({
  label,
  rows = 3,
  description,
  ...props
}: {
  label?: string;
  rows?: number;
  description?: string;
} & ComponentProps<typeof ShadcnTextarea>) {
  const field = useFieldContext<string>();

  return (
    <FieldContainer label={label} detail={description}>
      <ShadcnTextarea
        {...props}
        name={field.name}
        value={field.state.value}
        rows={rows}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </FieldContainer>
  );
}
