import type { TablerIcon } from '@tabler/icons-react';
import React from 'react';

import { CompactMultiSelect } from '../ui/compact-multi-select';
import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

interface MultiSelectFieldProps<TOption> {
  props: {
    options?: TOption[];
    getOptionValue?: (opt: TOption) => string;
    getOptionLabel?: (opt: TOption) => string;
    renderOption?: (opt: TOption) => React.ReactNode;
  };
  label?: string;
  detail?: string;
  placeholder?: string;
  baseStyles?: string;
  Icon?: TablerIcon;
}

export function MultiSelect<TOption>({
  props,
  label,
  detail,
  placeholder,
  baseStyles,
  Icon
}: MultiSelectFieldProps<TOption>) {
  const field = useFieldContext<string[]>();

  return (
    <FieldContainer label={label} detail={detail}>
      <CompactMultiSelect<TOption>
        props={props}
        field={field}
        baseStyles={baseStyles ?? ''}
        placeholder={placeholder}
        Icon={Icon}
        label={label}
      />
    </FieldContainer>
  );
}
