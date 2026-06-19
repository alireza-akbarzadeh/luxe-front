'use client';

import { formatDistanceToNow, parseISO } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useGetAdminInventoryAdjustmentsRecent } from '@/services/-admin-inventory-adjustments-recent-get';
import type { DtoInventoryAdjustmentResponse } from '@/services/-admin-inventory-adjustments-recent-get.schemas';

export function InventoryActivityFeed() {
  const { data, isLoading } = useGetAdminInventoryAdjustmentsRecent({ limit: 8 });
  const rows = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Recent activity</CardTitle>
        <CardDescription>Latest stock movements across the catalog</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-3'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='h-12 w-full' />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className='text-muted-foreground py-6 text-center text-sm'>No stock movements yet.</p>
        ) : (
          <div className='space-y-3'>
            {rows.map((row: DtoInventoryAdjustmentResponse) => {
              const createdAt = row.created_at ? parseISO(row.created_at) : null;
              const delta = row.quantity_delta ?? 0;
              return (
                <div key={row.id} className='rounded-xl border p-3'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <p className='truncate font-medium'>{row.product_name ?? 'Product'}</p>
                      <p className='text-muted-foreground text-xs'>
                        {row.product_sku ?? '—'} ·{' '}
                        {(row.adjustment_type ?? 'adjustment').replaceAll('_', ' ')}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p
                        className={cn(
                          'text-sm font-semibold tabular-nums',
                          delta > 0 && 'text-emerald-600',
                          delta < 0 && 'text-destructive'
                        )}
                      >
                        {delta > 0 ? `+${delta}` : delta}
                      </p>
                      <p className='text-muted-foreground text-[10px] tabular-nums'>
                        → {row.quantity_after ?? '—'}
                      </p>
                    </div>
                  </div>
                  <p className='text-muted-foreground mt-2 text-[10px]'>
                    {createdAt && !Number.isNaN(createdAt.getTime())
                      ? formatDistanceToNow(createdAt, { addSuffix: true })
                      : '—'}
                    {row.actor_name ? ` · ${row.actor_name}` : ''}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
