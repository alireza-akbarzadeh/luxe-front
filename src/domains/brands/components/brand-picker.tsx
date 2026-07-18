'use client';

import { IconTag } from '@tabler/icons-react';
import { useDeferredValue, useState } from 'react';

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
  allowClear = false,
  clearLabel = 'All brands',
  enabled = true
}: BrandPickerProps) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const deferredSearch = useDeferredValue(search.trim());

  const { data, isFetching } = useGetBrands(
    {
      limit: 40,
      page: 1,
      search: deferredSearch || undefined
    },
    {
      query: {
        enabled: enabled && menuOpen,
        staleTime: 30_000
      }
    }
  );

  const brands = getBrandsFromListResponse(data).filter((brand) => brand.id != null);

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
      onOpenChange={setMenuOpen}
      isFetching={isFetching}
      label={label}
      detail={detail}
      error={error}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyLabel='No brands found'
      searchingLabel='Searching…'
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
