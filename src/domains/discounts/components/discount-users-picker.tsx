'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { FieldContainer } from '@/components/forms/form';
import { CompactMultiSelect } from '@/components/ui/compact-multi-select';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { useGetAdminUsers } from '@/services/-admin-users-get';
import type { DtoAdminUserResponse } from '@/services/-admin-users-get.schemas';

interface DiscountUsersPickerProps {
  field: {
    state: { value: string[] | undefined };
    handleChange: (value: string[]) => void;
  };
}

interface UserOption {
  label: string;
  value: string;
}

function formatUserLabel(user: DtoAdminUserResponse) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  if (user.email && name) return `${name} · ${user.email}`;
  return user.email ?? name ?? `User #${user.id}`;
}

/** Searchable multi-select for assigning a promotion to specific customers. */
export function DiscountUsersPicker({ field }: DiscountUsersPickerProps) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());
  const selectedIds = field.state.value ?? [];

  const { data, isFetching } = useGetAdminUsers({
    limit: 20,
    offset: 0,
    search: deferredSearch || undefined
  });

  const options = useMemo(() => {
    const fromApi = data?.data?.users ?? [];
    const map = new Map<string, UserOption>();

    for (const user of fromApi) {
      if (user.id == null) continue;
      const value = String(user.id);
      map.set(value, { value, label: formatUserLabel(user) });
    }

    for (const id of selectedIds) {
      if (!map.has(id)) {
        map.set(id, { value: id, label: `User #${id}` });
      }
    }

    return [...map.values()];
  }, [data, selectedIds]);

  return (
    <FieldContainer
      label='Assigned customers'
      detail='Leave empty to allow any customer. When set, only selected users can use this promotion.'
    >
      <Flex direction='column' spacing={3}>
        <input
          type='search'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder='Search by name or email…'
          className='border-input bg-background h-9 w-full rounded-md border px-3 text-sm'
        />

        <CompactMultiSelect<UserOption>
          props={{
            options,
            getOptionValue: (opt) => opt.value,
            getOptionLabel: (opt) => opt.label
          }}
          field={field}
          baseStyles=''
          placeholder={isFetching ? 'Searching customers…' : 'Select customers…'}
          label='customers'
        />

        {selectedIds.length > 0 ? (
          <Text variant='muted' className='text-xs'>
            {selectedIds.length} customer{selectedIds.length === 1 ? '' : 's'} assigned
          </Text>
        ) : null}
      </Flex>
    </FieldContainer>
  );
}
