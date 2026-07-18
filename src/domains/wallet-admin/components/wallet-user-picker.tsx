'use client';

import { IconUser } from '@tabler/icons-react';
import { useDeferredValue, useState } from 'react';

import { AsyncSearchCombobox } from '@/components/ui/async-search-combobox';
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

/** Admin wallet adjust — search customers by name or email. */
export function WalletUserPicker({ value, onChange, label, detail, error }: WalletUserPickerProps) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());

  const { data, isFetching } = useGetAdminUsers({
    limit: 20,
    offset: 0,
    search: deferredSearch || undefined
  });

  const users = (data?.data?.users ?? []).filter((user) => user.id != null);

  return (
    <AsyncSearchCombobox
      value={value}
      options={users}
      getOptionValue={(user) => String(user.id)}
      getOptionLabel={formatUserLabel}
      getOptionDescription={(user) => (user.id != null ? `ID ${user.id}` : undefined)}
      onSelect={(user) => onChange(String(user.id))}
      search={search}
      onSearchChange={setSearch}
      isFetching={isFetching}
      label={label}
      detail={detail}
      error={error}
      placeholder='Search by name or email…'
      searchPlaceholder='Search customers…'
      emptyLabel='No customers found'
      searchingLabel='Searching…'
      icon={IconUser}
      valueFallbackLabel={(id) => `User #${id}`}
    />
  );
}
