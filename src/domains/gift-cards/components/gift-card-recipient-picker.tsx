'use client';

import { IconCheck, IconChevronDown, IconUser } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useDeferredValue, useState } from 'react';

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

import {
  getGiftCardRecipientLookup,
  type GiftRecipientLookup
} from '../lib/gift-card-transfer-api';

type GiftCardRecipientPickerProps = {
  value: string;
  onChange: (user: GiftRecipientLookup | null) => void;
  label?: string;
  placeholder?: string;
  emptyLabel?: string;
  searchingLabel?: string;
};

function formatRecipientLabel(user: GiftRecipientLookup) {
  const contact = user.masked_email ?? user.masked_phone;
  if (contact) return `${user.display_name} · ${contact}`;
  return user.display_name;
}

/** Search Luxe members by email or phone when gifting a card to another user. */
export function GiftCardRecipientPicker({
  value,
  onChange,
  label,
  placeholder = 'Search by email or phone…',
  emptyLabel = 'No members found',
  searchingLabel = 'Searching…'
}: GiftCardRecipientPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());

  const { data, isFetching } = useQuery({
    queryKey: ['gift-card-recipient-lookup', deferredSearch],
    queryFn: () => getGiftCardRecipientLookup(deferredSearch),
    enabled: deferredSearch.length >= 3,
    staleTime: 30_000
  });

  const users = data?.data ?? [];
  const selectedUser = users.find((user) => String(user.id) === value);

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
              'border-border/80 h-11 w-full justify-between rounded-xl px-4',
              value ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            <span className='flex items-center gap-2 truncate'>
              <IconUser className='text-accent size-4 shrink-0' />
              {selectedUser
                ? formatRecipientLabel(selectedUser)
                : value
                  ? `User #${value}`
                  : placeholder}
            </span>
            <IconChevronDown className='size-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='start'>
          <Command shouldFilter={false}>
            <CommandInput placeholder={placeholder} value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>
                {deferredSearch.length < 3
                  ? 'Type at least 3 characters'
                  : isFetching
                    ? searchingLabel
                    : emptyLabel}
              </CommandEmpty>
              <CommandGroup>
                {users.map((user) => {
                  const id = String(user.id);
                  const isSelected = value === id;

                  return (
                    <CommandItem
                      key={id}
                      value={id}
                      onSelect={() => {
                        onChange(user);
                        setOpen(false);
                      }}
                    >
                      <IconCheck
                        className={cn('mr-2 size-4', isSelected ? 'opacity-100' : 'opacity-0')}
                      />
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium'>{user.display_name}</span>
                        <span className='text-muted-foreground text-xs'>
                          {[user.masked_email, user.masked_phone].filter(Boolean).join(' · ')}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
