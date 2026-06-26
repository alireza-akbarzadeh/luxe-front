'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { VendorProductListItem } from '@/lib/api/vendor-products';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  draft: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  archived: 'bg-muted text-muted-foreground',
  inactive: 'bg-muted text-muted-foreground'
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function VendorProductsGrid({ products }: { products: VendorProductListItem[] }) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {products.map((product) => (
        <Card
          key={product.id}
          className='border-border/40 bg-card/50 hover:border-border cursor-pointer rounded-2xl shadow-none transition-colors'
        >
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt='' className='aspect-square rounded-t-2xl object-cover' />
          ) : (
            <div className='bg-muted/40 aspect-square rounded-t-2xl' />
          )}
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
            <p className='text-foreground text-sm font-semibold'>{formatCurrency(product.price)}</p>
            <p>
              {product.stock} in stock
              {product.category ? ` · ${product.category}` : null}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function VendorProductsTable({ products }: { products: VendorProductListItem[] }) {
  return (
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
          {products.map((product) => (
            <TableRow key={product.id} className='cursor-pointer'>
              <TableCell className='font-medium'>{product.name}</TableCell>
              <TableCell className='text-muted-foreground'>{product.sku}</TableCell>
              <TableCell>{product.category ?? '—'}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell className={cn(product.low_stock && 'text-amber-600 dark:text-amber-400')}>
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
  );
}
