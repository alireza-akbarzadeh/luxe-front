import type { TablerIcon } from '@tabler/icons-react';

import { DatePicker as ShadcnDatePicker,type DatePickerProps } from '@/components/ui/date-picker';

import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

interface TextFieldProps extends DatePickerProps {
  label?: string;
  detail?: string;
  icon?: TablerIcon;
}

export function DatePicker({ label, detail, icon: Icon, ...props }: TextFieldProps) {
  const field = useFieldContext<number>();
  const currentYear = field.state.value ? new Date(field.state.value, 0, 1) : new Date();
  return (
    <FieldContainer label={label} detail={detail}>
      <div className='relative w-full'>
        {Icon && (
          <Icon className='pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gray-400' />
        )}
        <ShadcnDatePicker
          calendar={{
            selected: currentYear,
            onSelect: (date) => {
              if (date) {
                field.handleChange(date.getFullYear());
              }
            }
          }}
          {...props}
        />
      </div>
    </FieldContainer>
  );
}
