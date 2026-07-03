import type { TablerIcon } from '@tabler/icons-react';

import { DatePicker as ShadcnDatePicker, type DatePickerProps } from '@/components/ui/date-picker';

import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

interface TextFieldProps extends DatePickerProps {
  label?: string;
  detail?: string;
  icon?: TablerIcon;
}

/** Parses form values stored as `YYYY-MM-DD` or ISO strings without timezone drift. */
function parseFormDateValue(value: string): Date | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]);
    const day = Number(dateOnly[3]);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function formatFormDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DatePicker({ label, detail, icon: Icon, calendar, ...props }: TextFieldProps) {
  const field = useFieldContext<string>();

  const selectedDate = parseFormDateValue(field.state.value);

  return (
    <FieldContainer label={label} detail={detail}>
      <div className='relative w-full'>
        {Icon ? (
          <Icon className='text-muted-foreground pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2' />
        ) : null}
        <ShadcnDatePicker
          calendar={{
            ...calendar,
            selected: selectedDate,
            onSelect: (date) => {
              if (date) {
                field.handleChange(formatFormDateValue(date));
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
