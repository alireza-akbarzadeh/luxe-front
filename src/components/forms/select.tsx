import type { ComponentProps } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

export function SelectController({
  label,
  options,
  placeholder,
  ...props
}: {
  label: string;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
} & ComponentProps<typeof Select>) {
  const field = useFieldContext<string>();

  return (
    <FieldContainer label={label}>
      <Select
        {...props}
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger className='w-full rounded-xs'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className='bg-background text-foreground'>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((item, index) => (
              <SelectItem
                key={`${item.value}-${item.label}-${index}`}
                value={item.value}
                className='text-foreground'
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FieldContainer>
  );
}
