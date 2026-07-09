import { IconAlertTriangle } from '@tabler/icons-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DtoAdminDashboardLowStockProduct } from '@/services/-admin-dashboard-overview-get.schemas';

interface DashboardLowStockTableProps {
  lowStockProducts?: DtoAdminDashboardLowStockProduct[];
}

export function DashboardLowStockTable({ lowStockProducts = [] }: DashboardLowStockTableProps) {
  return (
    <Card className='dashboard-card border-0 shadow-none'>
      <CardHeader>
        <div className='flex items-center justify-between gap-2'>
          <div>
            <CardTitle>Low stock alerts</CardTitle>
            <CardDescription>Products at or below threshold</CardDescription>
          </div>
          <IconAlertTriangle className='h-4 w-4 text-amber-500' />
        </div>
      </CardHeader>
      <CardContent>
        {lowStockProducts.length === 0 ? (
          <div className='text-muted-foreground py-10 text-center text-sm'>
            Inventory levels look healthy.
          </div>
        ) : (
          <div className='space-y-3'>
            {lowStockProducts.map((product) => (
              <Link
                key={product.id ?? product.sku}
                href={
                  product.id ? `/dashboard/products/edit/${product.id}` : '/dashboard/inventory'
                }
                className='hover:bg-muted/60 block rounded-xl border p-3 transition-colors'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='truncate font-medium'>{product.name}</p>
                    <p className='text-muted-foreground text-xs'>{product.sku}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-semibold text-amber-600 tabular-nums'>
                      {product.stock ?? 0} left
                    </p>
                    <p className='text-muted-foreground text-[10px]'>
                      threshold {product.threshold ?? 0}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            <Link
              href='/dashboard/inventory'
              className='text-primary block pt-1 text-xs font-semibold hover:underline'
            >
              View inventory
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
