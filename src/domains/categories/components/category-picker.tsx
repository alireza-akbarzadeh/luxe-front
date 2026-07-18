'use client';

import { IconCategory } from '@tabler/icons-react';
import { useDeferredValue, useState } from 'react';

import { AsyncSearchCombobox } from '@/components/ui/async-search-combobox';
import { useGetCategories } from '@/services/-categories-get';
import type { ModelsCategory } from '@/services/-categories-get.schemas';

export type CategoryPickerProps = {
  /** Selected category id as string; empty string = none. */
  value: string;
  onChange: (categoryId: string | null, category?: ModelsCategory | null) => void;
  label?: string;
  detail?: string;
  error?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  /** Show an "All / none" row (filters, optional form fields). */
  allowClear?: boolean;
  clearLabel?: string;
  /** Only active categories (default true). */
  isActiveOnly?: boolean;
  /** Gate the categories query (e.g. sheet open). Default true. */
  enabled?: boolean;
  className?: string;
};

function categoryLabel(category: ModelsCategory) {
  return category.name?.trim() || `Category #${category.id ?? ''}`;
}

function categoryDescription(category: ModelsCategory) {
  const parts: string[] = [];
  if (category.id != null) parts.push(`ID ${category.id}`);
  if (category.slug) parts.push(category.slug);
  if (category.path) parts.push(category.path);
  return parts.length > 0 ? parts.join(' · ') : undefined;
}

/**
 * Reusable async category field — Command combobox backed by GET /categories.
 * Use in admin filters, product forms, discounts, vendor onboarding, etc.
 */
export function CategoryPicker({
  value,
  onChange,
  label = 'Category',
  detail,
  error,
  placeholder = 'Search categories…',
  searchPlaceholder = 'Type a category name…',
  allowClear = false,
  clearLabel = 'All categories',
  isActiveOnly = true,
  enabled = true
}: CategoryPickerProps) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const deferredSearch = useDeferredValue(search.trim());

  const { data, isFetching } = useGetCategories(
    {
      limit: 40,
      search: deferredSearch || undefined,
      is_active: isActiveOnly ? true : undefined
    },
    {
      query: {
        enabled: enabled && menuOpen,
        staleTime: 30_000
      }
    }
  );

  const categories = (data?.data?.categories ?? []).filter((category) => category.id != null);

  return (
    <AsyncSearchCombobox
      value={value}
      options={categories}
      getOptionValue={(category) => String(category.id)}
      getOptionLabel={categoryLabel}
      getOptionDescription={categoryDescription}
      onSelect={(category) => onChange(String(category.id), category)}
      search={search}
      onSearchChange={setSearch}
      onOpenChange={setMenuOpen}
      isFetching={isFetching}
      label={label}
      detail={detail}
      error={error}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyLabel='No categories found'
      searchingLabel='Searching…'
      icon={IconCategory}
      valueFallbackLabel={(id) => `Category #${id}`}
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
