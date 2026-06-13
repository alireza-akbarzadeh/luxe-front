'use client';

import { IconCheck, IconChevronDown, IconX, type TablerIcon } from '@tabler/icons-react';
import React from 'react';

import { motion } from '@/components/motion';
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
import { useFieldContext } from '~/src/components/forms/useFormContext';

interface CompactSelectProps<TOption> {
  props: {
    options?: TOption[];
    getOptionValue?: (opt: TOption) => string;
    getOptionLabel?: (opt: TOption) => string;
    renderOption?: (opt: TOption) => React.ReactNode;
  };
  baseStyles?: string;
  placeholder?: string;
  Icon?: TablerIcon;
  label?: React.ReactNode;
  value?: string | null;
  onChange?: (value: string | null) => void;
  detail?: string;
  clearable?: boolean;
}

export function ComboboxField<TOption>({
  props,
  baseStyles,
  placeholder,
  Icon,
  label,
  value: externalValue,
  onChange: externalOnChange,
  detail,
  clearable
}: CompactSelectProps<TOption>) {
  const [open, setOpen] = React.useState(false);

  const field = useFieldContext<string>();

  const isExternallyControlled = externalValue !== undefined && externalOnChange !== undefined;

  const fieldValue = isExternallyControlled ? externalValue : (field.state.value ?? null);
  const handleChange = isExternallyControlled
    ? externalOnChange
    : (val: string | null) => field.handleChange(val ?? '');

  const getValue = props.getOptionValue || ((opt: TOption) => String(opt));
  const getLabel = props.getOptionLabel || ((opt: TOption) => String(opt));
  const renderOptionContent = props.renderOption || getLabel;

  const currentValue = fieldValue ?? '';
  const activeOption = props.options?.find((opt: TOption) => getValue(opt) === currentValue);

  return (
    <div className='w-full'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className='relative'>
            <Button
              variant='outline'
              role='combobox'
              className={cn(
                baseStyles,
                'h-11 w-full justify-between px-4 transition-all',
                currentValue ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <div className='flex items-center gap-2 truncate'>
                {Icon && <Icon className='text-muted-foreground size-4 shrink-0' />}
                <span className='truncate'>
                  {activeOption ? renderOptionContent(activeOption) : placeholder}
                </span>
              </div>
              <IconChevronDown
                className={cn(
                  'text-muted-foreground ml-2 size-4 shrink-0 transition-transform duration-200',
                  open && 'rotate-180'
                )}
              />
            </Button>
            {clearable && currentValue && (
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange(null);
                  setOpen(false);
                }}
                className='text-muted-foreground hover:text-foreground absolute top-1/2 right-10 -translate-y-1/2'
              >
                <IconX className='size-4' />
              </button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          align='start'
          sideOffset={6}
          className='border-border bg-popover w-[--radix-popover-trigger-width] min-w-[--radix-popover-trigger-width] overflow-hidden rounded-xl p-0 shadow-lg'
        >
          <Command className='w-full'>
            <div className='border-border flex items-center border-b px-2'>
              <CommandInput
                placeholder={`Search ${label || ''}...`}
                className='h-11 w-full border-none bg-transparent text-sm focus:ring-0'
              />
            </div>
            <CommandList className='scrollbar-none max-h-75 overflow-y-auto'>
              <CommandEmpty className='text-muted-foreground py-8 text-center text-xs font-bold tracking-widest uppercase'>
                No matching records
              </CommandEmpty>
              <CommandGroup className='p-0'>
                {props.options?.map((opt: TOption) => {
                  const optValue = getValue(opt);
                  const isSelected = currentValue === optValue;

                  return (
                    <CommandItem
                      key={optValue}
                      value={getLabel(opt)}
                      onSelect={() => {
                        handleChange(optValue);
                        setOpen(false);
                      }}
                      className={cn(
                        'border-border/50 flex cursor-pointer items-center gap-3 border-b px-4 py-3.5 transition-all last:border-none',
                        'aria-selected:bg-accent aria-selected:text-accent-foreground',
                        isSelected
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-accent/50'
                      )}
                    >
                      <div className='flex-1 truncate text-sm font-medium'>
                        {renderOptionContent(opt)}
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <IconCheck className='text-primary size-4 stroke-3' />
                        </motion.div>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {detail && <p className='text-muted-foreground mt-1.5 text-xs'>{detail}</p>}
    </div>
  );
}
