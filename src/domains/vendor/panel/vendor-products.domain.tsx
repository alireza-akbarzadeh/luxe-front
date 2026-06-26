'use client';

import {
  IconDownload,
  IconGrid3x3,
  IconLayoutList,
  IconPlus,
  IconSearch,
  IconUpload
} from '@tabler/icons-react';
import { useDeferredValue, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { useVendorStoreProductsQuery } from '@/domains/vendor/panel/hooks/use-vendor-store-products';
import {
  VendorProductsGrid,
  VendorProductsTable
} from '@/domains/vendor/panel/sections/vendor-products-list';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';

export function VendorProductsDomain() {
  const viewMode = useVendorPanelStore((s) => s.productViewMode);
  const setProductViewMode = useVendorPanelStore((s) => s.setProductViewMode);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());

  const { data, isLoading, isError } = useVendorStoreProductsQuery({
    limit: 50,
    offset: 0,
    search: deferredSearch || undefined
  });

  const products = data?.data?.products ?? [];
  const total = data?.data?.total ?? 0;

  return (
    <div className='space-y-6'>
      <VendorModuleHeader
        title='Products'
        description='Manage catalog, variants, pricing, media, SEO, and inventory.'
        badge={isLoading ? '…' : `${total} products`}
        actions={
          <>
            <Button variant='outline' size='sm' className='gap-1 rounded-xl'>
              <IconUpload className='size-4' />
              Import
            </Button>
            <Button variant='outline' size='sm' className='gap-1 rounded-xl'>
              <IconDownload className='size-4' />
              Export
            </Button>
            <Button size='sm' className='gap-1 rounded-xl'>
              <IconPlus className='size-4' />
              Add product
            </Button>
          </>
        }
      />

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='relative max-w-md flex-1'>
          <IconSearch className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            placeholder='Search products, SKU, barcode…'
            className='rounded-xl pl-9'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className='flex items-center gap-1 rounded-xl border p-1'>
          <Button
            type='button'
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size='sm'
            className='rounded-lg'
            onClick={() => setProductViewMode('table')}
            aria-pressed={viewMode === 'table'}
          >
            <IconLayoutList className='size-4' />
          </Button>
          <Button
            type='button'
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size='sm'
            className='rounded-lg'
            onClick={() => setProductViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
          >
            <IconGrid3x3 className='size-4' />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          <Skeleton className='h-10 w-full rounded-xl' />
          <Skeleton className='h-48 w-full rounded-2xl' />
        </div>
      ) : isError ? (
        <p className='text-muted-foreground text-sm'>Could not load products. Try again later.</p>
      ) : products.length === 0 ? (
        <p className='text-muted-foreground text-sm'>
          {deferredSearch ? 'No products match your search.' : 'No products yet for this store.'}
        </p>
      ) : viewMode === 'grid' ? (
        <VendorProductsGrid products={products} />
      ) : (
        <VendorProductsTable products={products} />
      )}
    </div>
  );
}
