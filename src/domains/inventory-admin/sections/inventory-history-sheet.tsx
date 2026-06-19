'use client';

import { formatDistanceToNow, parseISO } from 'date-fns';

import { AppDialog } from '@/components/app-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useInventoryStore } from '@/domains/inventory-admin/stores/inventory-store';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { useGetAdminInventoryProductsIdHistory } from '@/services/-admin-inventory-products-{id}-history-get';
import type { DtoInventoryAdjustmentResponse } from '@/services/-admin-inventory-products-{id}-history-get.schemas';

function formatAdjustmentType(type?: string) {
  return (type ?? 'adjustment').replaceAll('_', ' ');
}

export function InventoryHistorySheet() {
  const historyProductId = useInventoryStore((state) => state.historyProductId);
  const closeHistory = useInventoryStore((state) => state.closeHistory);

  const { data, isLoading } = useGetAdminInventoryProductsIdHistory(historyProductId ?? 0, {
    page: 1,
    limit: 50
  });

  const adjustments = data?.data?.adjustments ?? [];
  const productName = adjustments[0]?.product_name;

  return (
    <AppDialog
      open={historyProductId !== null}
      onOpenChange={(open) => {
        if (!open) closeHistory();
      }}
      component='sheet'
      size='lg'
      title='Inventory history'
      description={productName ? `Audit log for ${productName}` : 'Stock movement ledger'}
    >
      {isLoading ? (
        <div className='space-y-3'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
      ) : adjustments.length === 0 ? (
        <p className='text-muted-foreground py-8 text-center text-sm'>
          No adjustments recorded yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className='text-right'>Delta</TableHead>
              <TableHead className='text-right'>After</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adjustments.map((row: DtoInventoryAdjustmentResponse) => {
              const createdAt = row.created_at ? parseISO(row.created_at) : null;
              const delta = row.quantity_delta ?? 0;
              return (
                <TableRow key={row.id}>
                  <TableCell className='text-xs whitespace-nowrap'>
                    <div>
                      {row.created_at ? formatDate(row.created_at, DATE_FORMATS.SHORT) : '—'}
                    </div>
                    <div className='text-muted-foreground'>
                      {createdAt && !Number.isNaN(createdAt.getTime())
                        ? formatDistanceToNow(createdAt, { addSuffix: true })
                        : '—'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline' className='text-[10px] uppercase'>
                      {formatAdjustmentType(row.adjustment_type)}
                    </Badge>
                    {row.actor_name ? (
                      <div className='text-muted-foreground mt-1 text-[10px]'>{row.actor_name}</div>
                    ) : null}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-semibold tabular-nums',
                      delta > 0 && 'text-emerald-600',
                      delta < 0 && 'text-destructive'
                    )}
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {row.quantity_after ?? '—'}
                  </TableCell>
                  <TableCell className='max-w-[200px] truncate text-xs'>
                    {row.note || '—'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </AppDialog>
  );
}
