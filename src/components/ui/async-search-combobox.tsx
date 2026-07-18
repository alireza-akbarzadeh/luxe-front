'use client';

import { IconCheck, IconChevronDown, type TablerIcon } from '@tabler/icons-react';
import { type ReactNode,useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Flex } from '@/components/ui/flex';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type AsyncSearchComboboxProps<T> = {
  value: string;
  options: T[];
  getOptionValue: (option: T) => string;
  /** Primary label shown on the closed trigger. */
  getOptionLabel: (option: T) => string;
  onSelect: (option: T) => void;
  /** Controlled search box value (parent owns fetch / defer). */
  search: string;
  onSearchChange: (value: string) => void;
  isFetching?: boolean;
  label?: string;
  detail?: string;
  error?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  searchingLabel?: string;
  /** When set, empty state shows this hint until search reaches the length. */
  minSearchLength?: number;
  minSearchHint?: string;
  icon?: TablerIcon;
  /** Shown when `value` is set but the option is not in the current `options` list. */
  valueFallbackLabel?: (value: string) => string;
  /** Custom row content; defaults to title + optional description. */
  renderOption?: (option: T, isSelected: boolean) => ReactNode;
  getOptionDescription?: (option: T) => string | undefined;
  /** Called when the popover opens/closes — useful to lazy-fetch options. */
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
};

/**
 * Popover + Command combobox for async/server-filtered search.
 * Parent owns the query + data fetch; this only renders the UI shell.
 */
export function AsyncSearchCombobox<T>({
  value,
  options,
  getOptionValue,
  getOptionLabel,
  onSelect,
  search,
  onSearchChange,
  isFetching = false,
  label,
  detail,
  error,
  placeholder = 'Search…',
  searchPlaceholder,
  emptyLabel = 'No results found',
  searchingLabel = 'Searching…',
  minSearchLength = 0,
  minSearchHint = 'Type to search',
  icon: Icon,
  valueFallbackLabel = (id) => `#${id}`,
  renderOption,
  getOptionDescription,
  onOpenChange,
  triggerClassName
}: AsyncSearchComboboxProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => getOptionValue(option) === value);
  const trimmedSearch = search.trim();
  const needsMoreChars = minSearchLength > 0 && trimmedSearch.length < minSearchLength;

  let emptyMessage = emptyLabel;
  if (needsMoreChars) {
    emptyMessage = minSearchHint;
  } else if (isFetching) {
    emptyMessage = searchingLabel;
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <Flex direction='column' spacing={2} className='w-full'>
      {label ? <p className='text-sm font-medium'>{label}</p> : null}

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn(
              'border-border/80 h-11 w-full justify-between rounded-xl px-4',
              value ? 'text-foreground' : 'text-muted-foreground',
              error && 'border-destructive',
              triggerClassName
            )}
          >
            <span className='flex items-center gap-2 truncate'>
              {Icon ? <Icon className='text-accent size-4 shrink-0' /> : null}
              {selectedOption
                ? getOptionLabel(selectedOption)
                : value
                  ? valueFallbackLabel(value)
                  : placeholder}
            </span>
            <IconChevronDown className='size-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='start'>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder ?? placeholder}
              value={search}
              onValueChange={onSearchChange}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const optionValue = getOptionValue(option);
                  if (!optionValue) return null;
                  const isSelected = value === optionValue;

                  return (
                    <CommandItem
                      key={optionValue}
                      value={optionValue}
                      onSelect={() => {
                        onSelect(option);
                        setOpen(false);
                      }}
                    >
                      <IconCheck
                        className={cn('mr-2 size-4', isSelected ? 'opacity-100' : 'opacity-0')}
                      />
                      {renderOption ? (
                        renderOption(option, isSelected)
                      ) : (
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium'>{getOptionLabel(option)}</span>
                          {getOptionDescription?.(option) ? (
                            <span className='text-muted-foreground text-xs'>
                              {getOptionDescription(option)}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {detail ? <p className='text-muted-foreground text-xs'>{detail}</p> : null}
      {error ? <p className='text-destructive text-xs'>{error}</p> : null}
    </Flex>
  );
}
