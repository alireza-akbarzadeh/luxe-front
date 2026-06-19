'use client';

import {
  IconDownload,
  IconGrid3x3,
  IconLayoutList,
  IconPlus,
  IconSearch,
  IconUpload
} from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { VENDOR_MOCK_PRODUCTS } from '@/domains/vendor/panel/data/vendor-dashboard.data';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  draft: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  archived: 'bg-muted text-muted-foreground'
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function VendorProductsDomain() {
  const viewMode = useVendorPanelStore((s) => s.productViewMode);
  const setProductViewMode = useVendorPanelStore((s) => s.setProductViewMode);

  return (
    <div className='space-y-6'>
      <VendorModuleHeader
        title='Products'
        description='Manage catalog, variants, pricing, media, SEO, and inventory.'
        badge={`${VENDOR_MOCK_PRODUCTS.length} products`}
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
          <Input placeholder='Search products, SKU, barcode…' className='rounded-xl pl-9' />
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

      {viewMode === 'grid' ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {VENDOR_MOCK_PRODUCTS.map((product) => (
            <Card
              key={product.id}
              className='border-border/40 bg-card/50 cursor-pointer rounded-2xl shadow-none transition-colors hover:border-border'
            >
              <div className='bg-muted/40 aspect-square rounded-t-2xl' />
              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between gap-2'>
                  <CardTitle className='text-sm font-medium'>{product.name}</CardTitle>
                  <Badge
                    variant='secondary'
                    className={cn('rounded-full capitalize', STATUS_STYLES[product.status])}
                  >
                    {product.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='text-muted-foreground space-y-1 text-xs'>
                <p>{product.sku}</p>
                <p className='text-foreground text-sm font-semibold'>
                  {formatCurrency(product.price)}
                </p>
                <p>{product.stock} in stock · {product.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className='border-border/40 bg-card/50 overflow-hidden rounded-2xl border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VENDOR_MOCK_PRODUCTS.map((product) => (
                <TableRow key={product.id} className='cursor-pointer'>
                  <TableCell className='font-medium'>{product.name}</TableCell>
                  <TableCell className='text-muted-foreground'>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell className={cn(product.stock < 15 && product.stock > 0 && 'text-amber-600')}>
                    {product.stock}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='secondary'
                      className={cn('rounded-full capitalize', STATUS_STYLES[product.status])}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
