'use client';

import { IconChevronDown } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as PhoneInputPrimitive from 'react-phone-number-input';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TwemojiFlag } from '@/components/ui/twemoji';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

export interface CountrySelectOption {
  label: string;
  value: PhoneInputPrimitive.Country;
}

interface CountrySelectProps {
  disabled?: boolean;
  value: PhoneInputPrimitive.Country;
  options: CountrySelectOption[];
  onChange: (value: PhoneInputPrimitive.Country) => void;
}

function CountryFlag({ country, countryName }: PhoneInputPrimitive.FlagProps) {
  return (
    <span className='h-5 w-6 shrink-0 overflow-hidden rounded-sm'>
      {country ? (
        <TwemojiFlag countryCode={country} alt={countryName} className='size-full' />
      ) : (
        <span className='bg-foreground/20 inline-block size-full' />
      )}
    </span>
  );
}

export function PhoneFlagComponent({ country, countryName }: PhoneInputPrimitive.FlagProps) {
  return <CountryFlag country={country} countryName={countryName} />;
}

function CountryList({
  value,
  countries,
  search,
  onSearchChange,
  onSelect
}: {
  value: PhoneInputPrimitive.Country;
  countries: CountrySelectOption[];
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (country: PhoneInputPrimitive.Country) => void;
}) {
  const t = useTranslations('auth');

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder={t('searchCountry')}
        value={search}
        onValueChange={onSearchChange}
      />
      <CommandList className='max-h-72 overscroll-contain'>
        <CommandEmpty>{t('noCountryFound')}</CommandEmpty>
        <CommandGroup className='p-1'>
          {countries.map((country) => (
            <CommandItem
              key={country.value}
              value={`${country.label} +${PhoneInputPrimitive.getCountryCallingCode(country.value)}`}
              onSelect={() => onSelect(country.value)}
              className={cn(
                'min-h-11 gap-3 rounded-lg px-3 py-2.5',
                country.value === value && 'bg-accent/60'
              )}
            >
              <CountryFlag country={country.value} countryName={country.label} />
              <span className='flex-1 text-sm'>{country.label}</span>
              <span className='text-muted-foreground text-sm tabular-nums'>
                +{PhoneInputPrimitive.getCountryCallingCode(country.value)}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

/** Country picker — popover on desktop, keyboard-safe drawer on mobile. */
export function CountrySelect({ disabled, value, options, onChange }: CountrySelectProps) {
  const t = useTranslations('auth');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const isMobile = useMediaQuery('(max-width: 640px)', {
    defaultValue: false,
    initializeWithValue: false
  });

  const countries = options
    .filter((item) => item.value !== undefined)
    .filter((item) => {
      const query = search.trim().toLowerCase();
      if (!query) return true;
      return (
        item.label.toLowerCase().includes(query) ||
        PhoneInputPrimitive.getCountryCallingCode(item.value).includes(query)
      );
    });

  const handleSelect = (country: PhoneInputPrimitive.Country) => {
    onChange(country);
    setSearch('');
    setOpen(false);
  };

  const trigger = (
    <Button
      role='combobox'
      type='button'
      variant='ghost'
      aria-expanded={open}
      aria-label={t('selectCountry')}
      className={cn(
        'text-foreground border-input flex h-full min-h-0 shrink-0 gap-1.5 self-stretch rounded-none border-0 border-e px-2.5 shadow-none sm:gap-2 sm:px-3',
        'hover:bg-muted/50 dark:hover:bg-muted/30',
        'focus-visible:ring-0 focus-visible:ring-offset-0',
        disabled && 'opacity-50'
      )}
      disabled={disabled}
      onClick={isMobile ? () => setOpen(true) : undefined}
    >
      <CountryFlag country={value} countryName={value} />
      <span className='text-muted-foreground text-xs font-medium tabular-nums'>
        +{PhoneInputPrimitive.getCountryCallingCode(value)}
      </span>
      <IconChevronDown
        className={cn('size-3.5 opacity-60 transition-transform', open && 'rotate-180')}
      />
    </Button>
  );

  const list = (
    <CountryList
      value={value}
      countries={countries}
      search={search}
      onSearchChange={setSearch}
      onSelect={handleSelect}
    />
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <Drawer
          open={open}
          onOpenChange={setOpen}
          fixed
          handleOnly
          repositionInputs={false}
          scrollLockTimeout={400}
        >
          <DrawerContent showHandle radius='full' className='max-h-[min(88dvh,640px)] px-0 pb-6'>
            <DrawerHeader className='border-border border-b px-4 pb-3 text-start'>
              <DrawerTitle className='text-base'>{t('selectCountry')}</DrawerTitle>
            </DrawerHeader>
            <div className='px-2 pt-2' onPointerDown={(event) => event.stopPropagation()}>
              {list}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className='w-[min(100vw-2rem,20rem)] p-0' align='start' sideOffset={6}>
        {list}
      </PopoverContent>
    </Popover>
  );
}
