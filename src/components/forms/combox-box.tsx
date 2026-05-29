import { IconCheck, IconChevronDown, type TablerIcon } from '@tabler/icons-react';
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

import { useFieldContext } from './useFormContext';

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
}

export function ComboboxField<TOption>({
  props,
  baseStyles,
  placeholder,
  Icon,
  label
}: CompactSelectProps<TOption>) {
  const [open, setOpen] = React.useState(false);
  const field = useFieldContext<string>();

  const getValue = props.getOptionValue || ((opt: TOption) => String(opt));
  const getLabel = props.getOptionLabel || ((opt: TOption) => String(opt));
  const renderOptionContent = props.renderOption || getLabel;

  const currentValue = (field.state.value as string) ?? '';
  const activeOption = props.options?.find((opt: TOption) => getValue(opt) === currentValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          className={cn(
            baseStyles,
            'h-11 w-full justify-between px-4 transition-all',
            currentValue ? 'border-white/20 text-white' : 'text-slate-500'
          )}
        >
          <div className='flex items-center gap-2 truncate'>
            {Icon && <Icon className='size-4 shrink-0 text-slate-400' />}
            <span className='truncate'>
              {activeOption ? renderOptionContent(activeOption) : placeholder}
            </span>
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
        className='w-[--radix-popover-trigger-width] min-w-[--radix-popover-trigger-width] overflow-hidden rounded-xl border-white/10 bg-[#0d1117] p-0 shadow-2xl'
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
                const isSelected = currentValue === optValue;

                return (
                  <CommandItem
                    key={optValue}
                    value={getLabel(opt)}
                    onSelect={() => {
                      field.handleChange(optValue);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 border-b border-white/[0.02] px-4 py-3.5 transition-all last:border-none',
                      'aria-selected:bg-white/5 aria-selected:text-white',
                      isSelected ? 'bg-blue-400/5 text-blue-400' : 'text-slate-400'
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
                        <IconCheck className='size-4 stroke-[3] text-blue-400' />
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
  );
}
