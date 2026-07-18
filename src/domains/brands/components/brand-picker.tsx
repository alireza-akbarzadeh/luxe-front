'use client';

import { IconTag } from '@tabler/icons-react';
import { keepPreviousData } from '@tanstack/react-query';
import { useDeferredValue, useMemo, useState } from 'react';

import { AsyncSearchCombobox } from '@/components/ui/async-search-combobox';
import { getBrandsFromListResponse } from '@/domains/brands/lib/brand-list';
import { useGetBrands } from '@/services/-brands-get';
import type { DtoBrandResponse } from '@/services/-brands-get.schemas';

export type BrandPickerProps = {
  /** Selected brand id as string; empty string = none. */
  value: string;
  onChange: (brandId: string | null, brand?: DtoBrandResponse | null) => void;
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

function brandLabel(brand: DtoBrandResponse) {
  return brand.name?.trim() || `Brand #${brand.id ?? ''}`;
}

function brandDescription(brand: DtoBrandResponse) {
  const parts: string[] = [];
  if (brand.id != null) parts.push(`ID ${brand.id}`);
  if (brand.slug) parts.push(brand.slug);
  return parts.length > 0 ? parts.join(' · ') : undefined;
}

/**
 * Reusable async brand field — Command combobox backed by GET /brands.
 */
export function BrandPicker({
  value,
  onChange,
  label = 'Brand',
  detail,
  error,
  placeholder = 'Search brands…',
  searchPlaceholder = 'Type a brand name…',
  emptyLabel = 'No brands found',
  searchingLabel = 'Searching…',
  allowClear = false,
  clearLabel = 'All brands',
  enabled = true
}: BrandPickerProps) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const deferredSearch = useDeferredValue(search.trim());

  // Trust API search; avoid client re-filter that can hide valid hits.
  const { data, isFetching } = useGetBrands(
    {
      limit: 100,
      page: 1,
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

  const brands = useMemo(
    () => getBrandsFromListResponse(data).filter((brand) => brand.id != null),
    [data]
  );

  return (
    <AsyncSearchCombobox
      value={value}
      options={brands}
      getOptionValue={(brand) => String(brand.id)}
      getOptionLabel={brandLabel}
      getOptionDescription={brandDescription}
      onSelect={(brand) => onChange(String(brand.id), brand)}
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
      icon={IconTag}
      valueFallbackLabel={(id) => `Brand #${id}`}
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
