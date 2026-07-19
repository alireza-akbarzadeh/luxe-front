'use client';

import { IconBuildingStore } from '@tabler/icons-react';
import { keepPreviousData } from '@tanstack/react-query';
import { useDeferredValue, useMemo, useState } from 'react';

import { AsyncSearchCombobox } from '@/components/ui/async-search-combobox';
import { getVendorsFromListResponse } from '@/domains/vendors-admin/lib/vendors-list';
import { useGetAdminStores } from '@/services/-admin-stores-get';
import type { DtoAdminStoreResponse } from '@/services/-admin-stores-get.schemas';

export type VendorPickerProps = {
  /** Selected vendor (store) id as string; empty string = none. */
  value: string;
  onChange: (vendorId: string | null, vendor?: DtoAdminStoreResponse | null) => void;
  label?: string;
  detail?: string;
  error?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  searchingLabel?: string;
  allowClear?: boolean;
  clearLabel?: string;
  enabled?: boolean;
};

function vendorLabel(vendor: DtoAdminStoreResponse) {
  return vendor.name?.trim() || `Vendor #${vendor.id ?? ''}`;
}

function vendorDescription(vendor: DtoAdminStoreResponse) {
  const parts: string[] = [];
  if (vendor.id != null) parts.push(`ID ${vendor.id}`);
  if (vendor.slug) parts.push(vendor.slug);
  if (vendor.owner_email) parts.push(vendor.owner_email);
  return parts.length > 0 ? parts.join(' · ') : undefined;
}

/**
 * Async vendor field — Command combobox backed by GET /admin/stores
 * (vendors are store records in the admin API).
 */
export function VendorPicker({
  value,
  onChange,
  label = 'Vendor',
  detail,
  error,
  placeholder = 'Search vendors…',
  searchPlaceholder = 'Type a vendor name…',
  emptyLabel = 'No vendors found',
  searchingLabel = 'Searching…',
  allowClear = false,
  clearLabel = 'Clear selection',
  enabled = true
}: VendorPickerProps) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const deferredSearch = useDeferredValue(search.trim());

  const { data, isFetching } = useGetAdminStores(
    {
      limit: 50,
      offset: 0,
      sort_by: 'newest',
      search: deferredSearch.length >= 1 ? deferredSearch : undefined
    },
    {
      query: {
        enabled: enabled && menuOpen,
        staleTime: 30_000,
        placeholderData: keepPreviousData
      }
    }
  );

  const vendors = useMemo(
    () => getVendorsFromListResponse(data).filter((vendor) => vendor.id != null),
    [data]
  );

  return (
    <AsyncSearchCombobox
      value={value}
      options={vendors}
      getOptionValue={(vendor) => String(vendor.id)}
      getOptionLabel={vendorLabel}
      getOptionDescription={vendorDescription}
      onSelect={(vendor) => onChange(String(vendor.id), vendor)}
      search={search}
      onSearchChange={setSearch}
      onOpenChange={(open) => {
        setMenuOpen(open);
        if (!open) setSearch('');
      }}
      isFetching={isFetching}
      label={label}
      detail={detail}
      error={error}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyLabel={emptyLabel}
      searchingLabel={searchingLabel}
      icon={IconBuildingStore}
      valueFallbackLabel={(id) => `Vendor #${id}`}
      clearLabel={allowClear ? clearLabel : undefined}
      onClear={
        allowClear
          ? () => {
              onChange(null, null);
              setSearch('');
            }
          : undefined
      }
    />
  );
}
