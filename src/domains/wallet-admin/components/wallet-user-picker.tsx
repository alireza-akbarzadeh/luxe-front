'use client';

import { IconCheck, IconChevronDown, IconUser } from '@tabler/icons-react';
import { useDeferredValue, useMemo, useState } from 'react';

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
import { useGetAdminUsers } from '@/services/-admin-users-get';
import type { DtoAdminUserResponse } from '@/services/-admin-users-get.schemas';

interface WalletUserPickerProps {
  value: string;
  onChange: (userId: string) => void;
  label?: string;
  detail?: string;
  error?: string;
}

function formatUserLabel(user: DtoAdminUserResponse) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  if (user.email && name) return `${name} · ${user.email}`;
  return user.email ?? name ?? `User #${user.id}`;
}

export function WalletUserPicker({ value, onChange, label, detail, error }: WalletUserPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());

  const { data, isFetching } = useGetAdminUsers({
    limit: 20,
    offset: 0,
    search: deferredSearch || undefined
  });

  const users = data?.data?.users ?? [];

  const selectedUser = useMemo(() => {
    if (!value) return undefined;
    return users.find((user) => String(user.id) === value);
  }, [users, value]);

  return (
    <div className='space-y-2'>
      {label ? <p className='text-sm font-medium'>{label}</p> : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='outline'
            role='combobox'
            className={cn(
              'h-11 w-full justify-between px-4',
              value ? 'text-foreground' : 'text-muted-foreground',
              error && 'border-destructive'
            )}
          >
            <span className='flex items-center gap-2 truncate'>
              <IconUser className='size-4 shrink-0 opacity-60' />
              {selectedUser
                ? formatUserLabel(selectedUser)
                : value
                  ? `User #${value}`
                  : 'Search by name or email…'}
            </span>
            <IconChevronDown className='size-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='start'>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder='Search customers…'
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>{isFetching ? 'Searching…' : 'No customers found'}</CommandEmpty>
              <CommandGroup>
                {users.map((user) => {
                  if (!user.id) return null;
                  const id = String(user.id);
                  const isSelected = value === id;

                  return (
                    <CommandItem
                      key={id}
                      value={id}
                      onSelect={() => {
                        onChange(id);
                        setOpen(false);
                      }}
                    >
                      <IconCheck
                        className={cn('mr-2 size-4', isSelected ? 'opacity-100' : 'opacity-0')}
                      />
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium'>{formatUserLabel(user)}</span>
                        <span className='text-muted-foreground text-xs'>ID {user.id}</span>
                      </div>
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
    </div>
  );
}
