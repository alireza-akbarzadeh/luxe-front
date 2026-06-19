'use client';

import { IconAlertTriangle, IconArrowLeft } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { EntityWorkflowPanel } from '@/domains/workflows/components/entity-workflow-panel';
import { WorkflowHistoryTimeline } from '@/domains/workflows/components/workflow-history-timeline';
import { parseWorkflowHistoryResponse } from '@/domains/workflows/lib/workflow-runtime';
import { formatCurrency } from '@/lib/format';
import { getGetAdminShipmentsQueryKey } from '@/services/-admin-shipments-get';
import { getGetShipmentsIdQueryKey, useGetShipmentsId } from '@/services/-shipments-{id}-get';
import type { ModelsShipment } from '@/services/-shipments-{id}-get.schemas';
import { useGetWorkflowsKeyEntityIdHistory } from '@/services/-workflows-{key}-{entityId}-history-get';

import { ShipmentDetailSkeleton } from '../sections/shipment-detail-skeleton';

interface ShipmentDetailDomainProps {
  shipmentId: string;
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

function formatAddress(shipment: ModelsShipment) {
  const lines = [
    shipment.address_line1,
    shipment.address_line2,
    [shipment.city, shipment.state, shipment.postal_code].filter(Boolean).join(', '),
    shipment.country
  ].filter(Boolean);
  return lines.length > 0 ? lines.join('\n') : '—';
}

export function ShipmentDetailDomain({ shipmentId }: ShipmentDetailDomainProps) {
  const numericId = Number(shipmentId);
  const queryClient = useQueryClient();
  const isValidId = Number.isFinite(numericId) && numericId > 0;

  const { data, isLoading, isError, error, refetch } = useGetShipmentsId(numericId, {
    query: { enabled: isValidId }
  });

  const invalidateShipmentQueries = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: getGetShipmentsIdQueryKey(numericId) });
    void queryClient.invalidateQueries({ queryKey: getGetAdminShipmentsQueryKey() });
  }, [numericId, queryClient]);

  if (!isValidId) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className='mx-auto max-w-350 px-6 py-8'>
        <ShipmentDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Failed to load shipment';

    return (
      <div className='flex min-h-[50vh] items-center justify-center p-8'>
        <div className='max-w-md rounded-2xl border-2 border-dashed p-12 text-center'>
          <IconAlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
          <h3 className='text-lg font-bold tracking-tight'>Shipment unavailable</h3>
          <p className='text-muted-foreground mt-2 text-sm'>{message}</p>
          <Button className='mt-4' variant='outline' onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const shipment = data?.data;
  if (!shipment?.id) {
    notFound();
  }

  return (
    <ShipmentDetailView shipment={shipment} onWorkflowChange={invalidateShipmentQueries} />
  );
}

function ShipmentDetailView({
  shipment,
  onWorkflowChange
}: {
  shipment: ModelsShipment;
  onWorkflowChange: () => void;
}) {
  const shipmentId = shipment.id!;

  const { data: historyData, isLoading: isHistoryLoading } = useGetWorkflowsKeyEntityIdHistory(
    'shipment',
    shipmentId,
    { limit: 50, offset: 0 },
    { query: { enabled: shipmentId > 0 } }
  );

  const history = parseWorkflowHistoryResponse(historyData).history;

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 border-border/40 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-350 px-6 py-4'>
          <div className='flex items-start gap-4'>
            <Link href='/dashboard/shipments'>
              <Button
                variant='ghost'
                size='icon'
                className='border-border/60 h-9 w-9 shrink-0 rounded-xl border shadow-sm'
              >
                <IconArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
            <div>
              <h1 className='text-foreground font-mono text-xl font-black tracking-tight'>
                Shipment #{shipment.id}
              </h1>
              <p className='text-muted-foreground mt-1 text-xs'>
                Order{' '}
                {shipment.order_id ? (
                  <Link
                    href={`/dashboard/orders/${shipment.order_id}`}
                    className='text-primary font-semibold hover:underline'
                  >
                    #{shipment.order_id}
                  </Link>
                ) : (
                  '—'
                )}
                {' · '}
                {shipment.carrier ?? 'Unknown carrier'}
                {shipment.tracking_number ? ` · ${shipment.tracking_number}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-350 space-y-6 px-6 py-8'>
        <EntityWorkflowPanel
          workflowKey='shipment'
          entityId={shipmentId}
          title='Shipment workflow'
          description='Mark ready for pickup, track transit milestones, and confirm delivery.'
          onTransitionSuccess={onWorkflowChange}
        />

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <div className='bg-card border-border/40 rounded-2xl border p-6 shadow-sm'>
              <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                Shipping address
              </h2>
              <p className='text-foreground mt-3 text-sm leading-relaxed whitespace-pre-line'>
                {formatAddress(shipment)}
              </p>
            </div>

            <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
              <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
                <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                  Activity
                </h2>
              </div>
              <div className='p-6'>
                <WorkflowHistoryTimeline
                  entries={history}
                  isLoading={isHistoryLoading}
                  emptyMessage='No workflow activity yet.'
                />
              </div>
            </div>
          </div>

          <div className='space-y-5'>
            <div className='bg-card border-border/40 rounded-2xl border p-6 shadow-sm'>
              <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                Shipping cost
              </h2>
              <p className='text-foreground mt-3 text-2xl font-black tabular-nums'>
                {formatCurrency(shipment.shipping_price ?? 0)}
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>Charged to customer</p>
            </div>

            <div className='bg-card border-border/40 space-y-3 rounded-2xl border p-6 text-sm shadow-sm'>
              <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                Details
              </h2>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Carrier</span>
                <span className='text-xs font-semibold'>{shipment.carrier ?? '—'}</span>
              </div>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Tracking</span>
                <span className='font-mono text-xs'>{shipment.tracking_number ?? '—'}</span>
              </div>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Status</span>
                <span className='text-xs font-semibold capitalize'>{shipment.status ?? '—'}</span>
              </div>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Shipped</span>
                <span className='text-xs tabular-nums'>{formatDate(shipment.shipped_at)}</span>
              </div>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Delivered</span>
                <span className='text-xs tabular-nums'>{formatDate(shipment.delivered_at)}</span>
              </div>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Est. delivery</span>
                <span className='text-xs tabular-nums'>{formatDate(shipment.estimated_delivery)}</span>
              </div>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Created</span>
                <span className='text-xs tabular-nums'>{formatDate(shipment.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
