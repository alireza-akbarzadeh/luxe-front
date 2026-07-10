'use client';

import { useMemo } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useRoleSelectOptions } from '@/domains/users/hooks/use-role-options';

export type CustomerRoleFilter = 'all' | string;

interface CustomerRoleFilterSelectProps {
  value: CustomerRoleFilter;
  onValueChange: (value: CustomerRoleFilter) => void;
}

/** Role filter for the customers grid — Select on desktop, bottom drawer on mobile. */
export function CustomerRoleFilterSelect({ value, onValueChange }: CustomerRoleFilterSelectProps) {
  const { options: roleOptions, isLoading } = useRoleSelectOptions();

  const options = useMemo(
    () => [
      { value: 'all', label: 'All roles' },
      { value: 'user', label: 'Customers' },
      ...roleOptions.filter((option) => option.value !== 'user')
    ],
    [roleOptions]
  );

  return (
    <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
      <SelectTrigger
        size='sm'
        className='border-border/60 h-10 min-w-36 rounded-xl text-[10px] font-bold uppercase'
      >
        <SelectValue placeholder='All roles' />
      </SelectTrigger>
      <SelectContent className='rounded-xl'>
        <SelectGroup>
          <SelectLabel>Role</SelectLabel>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className='text-[10px] font-bold uppercase'
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
