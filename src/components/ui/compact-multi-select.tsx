import { IconCheck, IconChevronDown, IconX, type TablerIcon } from '@tabler/icons-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CompactMultiSelectProps<TOption> {
  props: {
    options?: TOption[];
    getOptionValue?: (opt: TOption) => string;
    getOptionLabel?: (opt: TOption) => string;
    renderOption?: (opt: TOption) => React.ReactNode;
  };
  field: {
    state: { value: string[] | undefined };
    handleChange: (val: string[]) => void;
  };
  baseStyles: string;
  placeholder?: string;
  Icon?: TablerIcon;
  label?: string;
}

export function CompactMultiSelect<TOption>({
  props,
  field,
  baseStyles,
  placeholder,
  Icon,
  label
}: CompactMultiSelectProps<TOption>) {
  const [open, setOpen] = React.useState(false);

  const getValue = props.getOptionValue || ((opt: TOption) => String(opt));
  const getLabel = props.getOptionLabel || ((opt: TOption) => String(opt));
  const renderOptionContent = props.renderOption || getLabel;

  const currentValues = (field.state.value as string[]) ?? [];
  const selectedOptions = props.options?.filter((opt: TOption) =>
    currentValues.includes(getValue(opt))
  );

  const toggleOption = (optionValue: string) => {
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue];
    field.handleChange(newValues);
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    field.handleChange(currentValues.filter((v) => v !== optionValue));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='outline'
          role='combobox'
          className={cn(
            'h-auto min-h-9 w-full justify-between rounded-md border px-3 py-2 text-base shadow-xs transition-all md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'dark:bg-input/30 border-input bg-transparent',
            currentValues.length > 0 ? 'text-white' : 'text-muted-foreground',
            baseStyles
          )}
        >
          <div className='flex min-h-7 flex-1 flex-wrap items-center gap-2'>
            {Icon && <Icon className='size-4 shrink-0 text-slate-400' />}
            {currentValues.length === 0 ? (
              <span className='truncate'>{placeholder}</span>
            ) : (
              <div className='flex flex-wrap gap-1'>
                {selectedOptions?.map((opt: TOption) => (
                  <Badge
                    key={getValue(opt)}
                    variant='secondary'
                    className='border-blue-400/20 bg-blue-400/10 text-blue-400 hover:bg-blue-400/20'
                  >
                    {getLabel(opt)}
                    <button
                      type='button'
                      onClick={(e) => removeOption(getValue(opt), e)}
                      className='ml-1 hover:text-blue-300'
                    >
                      <IconX className='size-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <IconChevronDown
            className={cn(
              'ml-2 size-4 shrink-0 opacity-50 transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        sideOffset={6}
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        className='overflow-hidden rounded-md border-white/10 bg-[#0d1117] p-0 shadow-2xl'
      >
        <Command className='w-full border-none bg-transparent font-sans'>
          <div className='flex items-center border-b border-white/5 px-2'>
            <CommandInput
              placeholder={`Search ${label || ''}...`}
              className='h-11 w-full border-none bg-transparent text-sm text-white focus:ring-0'
            />
          </div>
          <CommandList className='scrollbar-none max-h-75 overflow-y-auto'>
            <CommandEmpty className='py-8 text-center text-xs font-bold tracking-widest text-slate-500 uppercase'>
              No matching records
            </CommandEmpty>
            <CommandGroup className='p-0'>
              {props.options?.map((opt: TOption) => {
                const optValue = getValue(opt);
                const isSelected = currentValues.includes(optValue);

                return (
                  <CommandItem
                    key={optValue}
                    value={getLabel(opt)}
                    onSelect={() => toggleOption(optValue)}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 border-b border-white/2 px-4 py-3.5 transition-all last:border-none',
                      'aria-selected:bg-white/5 aria-selected:text-white',
                      isSelected ? 'bg-blue-400/5 text-blue-400' : 'text-slate-400'
                    )}
                  >
                    <div className='flex-1 truncate text-sm font-medium'>
                      {renderOptionContent(opt)}
                    </div>
                    {isSelected && <IconCheck className='size-4 stroke-3 text-blue-400' />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
