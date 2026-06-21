/* eslint-disable react-hooks/refs */
// https://shadcn-phone-input.vercel.app/
// FIXME: getVirtualItems() always returns an empty array with React Compiler, 'use no memo' is a temporary solution

import { IconChevronDown } from '@tabler/icons-react';
import type { Virtualizer } from '@tanstack/react-virtual';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslations } from 'next-intl';
import type { ComponentProps, PropsWithChildren } from 'react';
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
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ScrollAreaRoot,
  ScrollBar,
  ScrollCorner,
  ScrollViewport
} from '@/components/ui/scroll-area';
import { TwemojiFlag } from '@/components/ui/twemoji';
import { createContextFactory } from '@/hooks/useContextFactory';
import { useDynamicNode } from '@/hooks/useDynamicNode';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { DEFAULT_PHONE_COUNTRY, toPhoneInputValue } from '@/lib/phone-utils';
import { cn } from '@/lib/utils';

import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

/** Shared shell — matches `Input` border/focus; ring applies to the whole control via focus-within. */
const phoneInputShellClassName =
  'border-input flex h-9 w-full min-w-0 overflow-hidden rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] has-[[data-slot=input][aria-invalid=true]]:border-destructive has-[[data-slot=input][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot=input][aria-invalid=true]]:ring-destructive/40';

type InputPhoneProps = Omit<
  ComponentProps<typeof PhoneInputPrimitive.default>,
  'value' | 'onChange'
> & {
  label?: string;
};
export function InputPhone({
  label,
  className,
  defaultCountry = DEFAULT_PHONE_COUNTRY,
  ...props
}: InputPhoneProps) {
  const field = useFieldContext<string>();
  const phoneValue = toPhoneInputValue(field.state.value, defaultCountry);
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <FieldContainer label={label}>
      <div
        className={cn(
          phoneInputShellClassName,
          hasError && 'border-destructive ring-destructive/20 dark:ring-destructive/40',
          className
        )}
      >
        <PhoneInputPrimitive.default
          {...props}
          defaultCountry={defaultCountry}
          value={phoneValue}
          onChange={(value) => {
            field.handleChange(value ?? '');
          }}
          onBlur={field.handleBlur}
          className='flex h-full min-h-0 w-full'
          dir='ltr'
          flagComponent={FlagComponent}
          inputComponent={InputComponent}
          countrySelectComponent={CountrySelect}
        />
      </div>
    </FieldContainer>
  );
}

function InputComponent({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      dir='ltr'
      className={cn(
        'h-full min-h-0 w-full rounded-none border-0 bg-transparent px-3 text-start shadow-none',
        'focus-visible:border-0 focus-visible:ring-0',
        className
      )}
      {...props}
    />
  );
}

interface CountrySelectOption {
  label: string;
  value: PhoneInputPrimitive.Country;
}

interface CountrySelectProps {
  disabled?: boolean;
  value: PhoneInputPrimitive.Country;
  options: CountrySelectOption[];
  onChange: (value: PhoneInputPrimitive.Country) => void;
}

interface CountrySelectContext {
  value: PhoneInputPrimitive.Country;
  onChange: (value: PhoneInputPrimitive.Country) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  search: string;
  setSearch: (value: string) => void;
  countries: CountrySelectOption[];
  parentNodeRef: (node: HTMLDivElement) => void;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
}

const [ContextProvider, useContext] = createContextFactory<CountrySelectContext>();

function CountrySelect({ disabled, value, options, onChange }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const countries = options
    .filter((item) => item.value !== undefined)
    .filter(
      (item) =>
        item.label.toLowerCase().includes(search.trim().toLowerCase()) ||
        PhoneInputPrimitive.getCountryCallingCode(item.value).includes(search)
    );

  const [parentNode, parentNodeRef] = useDynamicNode();

  const virtualizer = useVirtualizer({
    count: countries.length,
    getScrollElement: () => parentNode,
    estimateSize: () => 32
  });

  const { isMobile } = useMediaDevices();

  const DynamicView = isMobile ? MobileView : DesktopView;

  const context: CountrySelectContext = {
    value,
    onChange,
    open,
    setOpen,
    search,
    setSearch,
    countries,
    parentNodeRef,
    virtualizer
  };

  return (
    <ContextProvider value={context}>
      <DynamicView>
        <Button
          role='combobox'
          type='button'
          variant='ghost'
          className={cn(
            'text-foreground border-input flex h-full min-h-0 shrink-0 gap-2 self-stretch rounded-none border-0 border-e px-3 shadow-none',
            'hover:bg-muted/50 dark:hover:bg-muted/30',
            'focus-visible:ring-0 focus-visible:ring-offset-0',
            disabled && 'opacity-50'
          )}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <IconChevronDown className='size-3 opacity-50' />
        </Button>
      </DynamicView>
    </ContextProvider>
  );
}

function DesktopView({ children }: PropsWithChildren) {
  const context = useContext();

  return (
    <Popover open={context.open} onOpenChange={context.setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-75 p-0'>
        <CountrySelectCommand />
      </PopoverContent>
    </Popover>
  );
}

function MobileView({ children }: PropsWithChildren) {
  const context = useContext();

  return (
    <Drawer open={context.open} onOpenChange={context.setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className='sr-only' />
        <div className='mt-4 border-t'>
          <CountrySelectCommand />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CountrySelectCommand() {
  const context = useContext();
  const t = useTranslations('auth');

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder={t('searchCountry')}
        value={context.search}
        onValueChange={context.setSearch}
      />
      <CommandList>
        <ScrollAreaRoot className='h-72'>
          <ScrollViewport ref={context.parentNodeRef}>
            <div
              className='relative w-full'
              style={{
                height: context.virtualizer.getTotalSize()
              }}
            >
              <CommandEmpty
                style={{
                  position: 'absolute',
                  inset: 0
                }}
              >
                {t('noCountryFound')}
              </CommandEmpty>
              <CommandGroup>
                {context.virtualizer.getVirtualItems().map((virtualItem) => {
                  const country = context.countries[virtualItem.index];
                  if (!country) return null;
                  return (
                    <CommandItem
                      key={virtualItem.key}
                      onSelect={() => {
                        context.onChange(country.value);
                        context.setSearch('');
                        context.setOpen(false);
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`
                      }}
                      className={cn('gap-2', country.value === context.value && 'bg-accent/50')}
                    >
                      <FlagComponent country={country.value} countryName={country.label} />
                      <span className='flex-1 text-sm'>{country.label}</span>
                      <span className='text-foreground/50 text-sm'>
                        {`+${PhoneInputPrimitive.getCountryCallingCode(country.value)}`}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          </ScrollViewport>
          <ScrollBar />
          <ScrollCorner />
        </ScrollAreaRoot>
      </CommandList>
    </Command>
  );
}

function FlagComponent({ country, countryName }: PhoneInputPrimitive.FlagProps) {
  return (
    <span className='h-5 w-6 overflow-hidden rounded-sm'>
      {country ? (
        <TwemojiFlag countryCode={country} alt={countryName} className='size-full' />
      ) : (
        <span className='bg-foreground/20 inline-block size-full' />
      )}
    </span>
  );
}
