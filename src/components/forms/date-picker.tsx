import type { TablerIcon } from '@tabler/icons-react';

import { DatePicker as ShadcnDatePicker, type DatePickerProps } from '@/components/ui/date-picker';

import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

interface TextFieldProps extends DatePickerProps {
  label?: string;
  detail?: string;
  icon?: TablerIcon;
}

export function DatePicker({ label, detail, icon: Icon, ...props }: TextFieldProps) {
  const field = useFieldContext<string>();

  const selectedDate = field.state.value ? new Date(field.state.value) : undefined;

  return (
    <FieldContainer label={label} detail={detail}>
      <div className='relative w-full'>
        {Icon && (
          <Icon className='pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gray-400' />
        )}
        <ShadcnDatePicker
          calendar={{
            selected: selectedDate,
            onSelect: (date) => {
              if (date) {
                field.handleChange(date.toISOString());
              } else {
                field.handleChange('');
              }
            }
          }}
          {...props}
        />
      </div>
    </FieldContainer>
  );
}
