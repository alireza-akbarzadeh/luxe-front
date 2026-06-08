'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface NumberInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange'
> {
  value: number | null;
  onValueChange: (value: number | null) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onValueChange, className, ...props }, ref) => {
    const [internal, setInternal] = useState('');
    const lastExternal = useRef<number | null>(value);

    useEffect(() => {
      if (value !== lastExternal.current) {
        lastExternal.current = value;
        setInternal(value == null ? '' : String(value));
      }
    }, [value]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const v = e.target.value;

      if (!/^-?\d*\.?\d*$/.test(v)) return;

      setInternal(v);

      if (v === '' || v === '-' || v === '.') {
        onValueChange(null);
        return;
      }

      const num = Number(v);
      onValueChange(Number.isNaN(num) ? null : num);
    }

    return (
      <Input
        {...props}
        ref={ref}
        value={internal}
        onChange={handleChange}
        inputMode='decimal'
        className={cn(className)}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';
