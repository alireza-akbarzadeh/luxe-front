'use client';

import { IconUser } from '@tabler/icons-react';
import { useDeferredValue, useState } from 'react';

import { AsyncSearchCombobox } from '@/components/ui/async-search-combobox';
import { useGetGiftCardsRecipientLookup } from '@/services/-gift-cards-recipient-lookup-get';
import type { DtoGiftRecipientLookupResponse } from '@/services/-gift-cards-recipient-lookup-get.schemas';

type GiftCardRecipientPickerProps = {
  value: string;
  onChange: (user: DtoGiftRecipientLookupResponse | null) => void;
  label?: string;
  placeholder?: string;
  emptyLabel?: string;
  searchingLabel?: string;
};

function formatRecipientLabel(user: DtoGiftRecipientLookupResponse) {
  const name = user.display_name?.trim() || `User #${user.id ?? ''}`;
  const contact = user.masked_email ?? user.masked_phone;
  if (contact) return `${name} · ${contact}`;
  return name;
}

function recipientDescription(user: DtoGiftRecipientLookupResponse) {
  const parts = [user.masked_email, user.masked_phone].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : undefined;
}

/** Search Luxe members by name, email, or phone when gifting a card to another user. */
export function GiftCardRecipientPicker({
  value,
  onChange,
  label,
  placeholder = 'Search by name, email, or phone…',
  emptyLabel = 'No members found',
  searchingLabel = 'Searching…'
}: GiftCardRecipientPickerProps) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const deferredSearch = useDeferredValue(search.trim());

  const { data, isFetching } = useGetGiftCardsRecipientLookup(
    { q: deferredSearch },
    {
      query: {
        // Load up to 10 members as soon as the popover opens (empty q); refine as user types
        enabled: menuOpen,
        staleTime: 30_000
      }
    }
  );

  return (
    <AsyncSearchCombobox
      value={value}
      options={data?.data ?? []}
      getOptionValue={(user) => String(user.id ?? '')}
      getOptionLabel={formatRecipientLabel}
      onSelect={(user) => onChange(user)}
      search={search}
      onSearchChange={setSearch}
      onOpenChange={setMenuOpen}
      isFetching={isFetching}
      label={label}
      placeholder={placeholder}
      emptyLabel={emptyLabel}
      searchingLabel={searchingLabel}
      icon={IconUser}
      valueFallbackLabel={(id) => `User #${id}`}
      renderOption={(user) => {
        const id = String(user.id ?? '');
        const description = recipientDescription(user);
        return (
          <div className='flex flex-col'>
            <span className='text-sm font-medium'>
              {user.display_name?.trim() || `User #${id}`}
            </span>
            {description ? (
              <span className='text-muted-foreground text-xs'>{description}</span>
            ) : null}
          </div>
        );
      }}
    />
  );
}
