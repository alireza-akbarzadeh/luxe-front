'use client';

import { useMemo, useState } from 'react';

import { FieldContainer } from '@/components/forms/form';
import { CompactMultiSelect } from '@/components/ui/compact-multi-select';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { useGetProducts } from '@/services/-products-get';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

interface CollectionProductPickerProps {
  field: {
    state: { value: string[] | undefined };
    handleChange: (value: string[]) => void;
  };
}

interface ProductOption {
  label: string;
  value: string;
}

function productLabel(product: DtoProductWithLike): string {
  const sku = product.sku ? ` · ${product.sku}` : '';
  return `${product.name ?? 'Product'}${sku}`;
}

export function CollectionProductPicker({ field }: CollectionProductPickerProps) {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetProducts(
    {
      status: 'active',
      limit: 50,
      offset: 0,
      name: search.trim() || undefined
    },
    { query: { staleTime: 30_000 } }
  );

  const selectedIds = field.state.value ?? [];

  const options = useMemo(() => {
    const fromApi = data?.data?.products ?? [];
    const map = new Map<string, ProductOption>();

    for (const product of fromApi) {
      if (product.id == null) continue;
      const value = String(product.id);
      map.set(value, { value, label: productLabel(product) });
    }

    for (const id of selectedIds) {
      if (!map.has(id)) {
        map.set(id, { value: id, label: `Product #${id}` });
      }
    }

    return [...map.values()];
  }, [data, selectedIds]);

  return (
    <FieldContainer
      label='Products'
      detail='Order in the list is the display order on the storefront preview'
    >
      <Flex direction='column' spacing={3}>
        <input
          type='search'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder='Search products by name or SKU…'
          className='border-input bg-background h-9 w-full rounded-md border px-3 text-sm'
        />

        <CompactMultiSelect<ProductOption>
          props={{
            options,
            getOptionValue: (opt) => opt.value,
            getOptionLabel: (opt) => opt.label
          }}
          field={field}
          baseStyles=''
          placeholder={isLoading ? 'Loading products…' : 'Select products for this collection…'}
          label='Products'
        />

        {selectedIds.length === 0 ? (
          <Text variant='muted' className='text-xs'>
            Manual collections can start empty and be filled later.
          </Text>
        ) : (
          <Text variant='muted' className='text-xs'>
            {selectedIds.length} product{selectedIds.length === 1 ? '' : 's'} selected
          </Text>
        )}
      </Flex>
    </FieldContainer>
  );
}
