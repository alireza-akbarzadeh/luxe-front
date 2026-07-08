// https://shadcn-phone-input.vercel.app/

import { useLocale } from 'next-intl';
import type { ComponentProps } from 'react';
import * as PhoneInputPrimitive from 'react-phone-number-input';

import { Input } from '@/components/ui/input';
import { resolveDefaultPhoneCountry, toPhoneInputValue } from '@/lib/phone-utils';
import { cn } from '@/lib/utils';

import { FieldContainer } from './form';
import { CountrySelect, PhoneFlagComponent } from './input-phone-country-select';
import { useFieldContext } from './useFormContext';

/** Shared shell — matches `Input` border/focus; ring applies to the whole control via focus-within. */
const phoneInputShellClassName =
  'border-input flex h-9 w-full min-w-0 overflow-hidden rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] has-[[data-slot=input][aria-invalid=true]]:border-destructive has-[[data-slot=input][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot=input][aria-invalid=true]]:ring-destructive/40 dark:has-[[data-slot=input]:-webkit-autofill]:bg-card';

type InputPhoneProps = Omit<
  ComponentProps<typeof PhoneInputPrimitive.default>,
  'value' | 'onChange'
> & {
  label?: string;
};

export function InputPhone({
  label,
  className,
  defaultCountry: defaultCountryProp,
  international = true,
  countryCallingCodeEditable = false,
  ...props
}: InputPhoneProps) {
  const field = useFieldContext<string>();
  const locale = useLocale();
  const defaultCountry = defaultCountryProp ?? resolveDefaultPhoneCountry(locale);
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
          international={international}
          countryCallingCodeEditable={countryCallingCodeEditable}
          defaultCountry={defaultCountry}
          value={phoneValue}
          onChange={(value) => {
            field.handleChange(value ?? '');
          }}
          onBlur={field.handleBlur}
          className='flex h-full min-h-0 w-full'
          dir='ltr'
          flagComponent={PhoneFlagComponent}
          inputComponent={PhoneInputComponent}
          countrySelectComponent={CountrySelect}
        />
      </div>
    </FieldContainer>
  );
}

function PhoneInputComponent({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      dir='ltr'
      inputMode='tel'
      autoComplete='tel'
      className={cn(
        'h-full min-h-0 w-full rounded-none border-0 bg-transparent px-3 text-start shadow-none',
        'focus-visible:border-0 focus-visible:ring-0',
        className
      )}
      {...props}
    />
  );
}
