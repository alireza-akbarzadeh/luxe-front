import { IconEye, IconEyeOff, IconLock, type TablerIcon } from '@tabler/icons-react';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

import { PropsProvider } from '../props-provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

export function InputPassword({
  label = 'Password',
  showForgotLink = false,
  forgotPasswordHref = '/forgot-password',
  placeholder,
  className,
  ...props
}: {
  label?: string;
  showForgotLink?: boolean;
  forgotPasswordHref?: string;
  placeholder?: string;
} & ComponentProps<typeof Input>) {
  const field = useFieldContext<string>();
  const [showPassword, setShowPassword] = useState(false);
  const passwordId = useId();

  return (
    <FieldContainer label={label}>
      <div className='space-y-2'>
        {showForgotLink ? (
          <div className='flex justify-end'>
            <Link
              href={forgotPasswordHref}
              className='text-accent text-sm font-medium transition-colors hover:underline'
            >
              Forgot password?
            </Link>
          </div>
        ) : null}

        <div className={cn('relative w-full', className)}>
          <IconLock className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-500' />

          <Input
            {...props}
            id={passwordId}
            type={showPassword ? 'text' : 'password'}
            name={field.name}
            value={field.state.value}
            placeholder={placeholder}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            className={cn('h-12 pr-12 pl-10', className)}
          />

          <Button
            size='sm'
            type='button'
            variant='ghost'
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label='Toggle password visibility'
            className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
          >
            <PropsProvider<TablerIcon> aria-hidden className='size-4'>
              {showPassword ? <IconEye /> : <IconEyeOff />}
            </PropsProvider>
          </Button>
        </div>
      </div>
    </FieldContainer>
  );
}
