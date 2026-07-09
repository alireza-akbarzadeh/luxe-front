'use client';

import { IconAlertTriangle, IconArrowLeft } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { ReturnQuickActions } from '@/domains/returns-admin/components/return-quick-actions';
import { ReturnTypeBadge } from '@/domains/returns-admin/components/return-type-badge';
import { ReturnDetailSkeleton } from '@/domains/returns-admin/sections/return-detail-skeleton';
import { ReturnNotesCard } from '@/domains/returns-admin/sections/return-notes-card';
import { EntityWorkflowPanel } from '@/domains/workflows/components/entity-workflow-panel';
import { WorkflowHistoryTimeline } from '@/domains/workflows/components/workflow-history-timeline';
import { WorkflowStateBadge } from '@/domains/workflows/components/workflow-state-badge';
import { parseWorkflowHistoryResponse } from '@/domains/workflows/lib/workflow-runtime';
import { formatCurrency } from '@/lib/format';
import {
  getGetAdminReturnsIdQueryKey,
  useGetAdminReturnsId
} from '@/services/-admin-returns-{id}-get';
import type {
  DtoReturnResponse,
  GetAdminReturnsId200
} from '@/services/-admin-returns-{id}-get.schemas';
import { getGetAdminReturnsQueryKey } from '@/services/-admin-returns-get';
import { getGetAdminReturnsStatsQueryKey } from '@/services/-admin-returns-stats-get';
import { useGetWorkflowsKeyEntityIdHistory } from '@/services/-workflows-{key}-{entityId}-history-get';

interface ReturnDetailDomainProps {
  returnId: string;
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

export function ReturnDetailDomain({ returnId }: ReturnDetailDomainProps) {
  const numericId = Number(returnId);
  const queryClient = useQueryClient();
  const isValidId = Number.isFinite(numericId) && numericId > 0;

  const { data, isLoading, isError, error, refetch } = useGetAdminReturnsId(numericId, {
    query: { enabled: isValidId }
  });

  const invalidateReturnQueries = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminReturnsIdQueryKey(numericId) });
    void queryClient.invalidateQueries({ queryKey: getGetAdminReturnsQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminReturnsStatsQueryKey() });
  }, [numericId, queryClient]);

  const applyReturnUpdate = useCallback(
    (returnItem: DtoReturnResponse) => {
      queryClient.setQueryData<GetAdminReturnsId200>(
        getGetAdminReturnsIdQueryKey(numericId),
        (previous) => ({
          ...(previous ?? {}),
          data: returnItem
        })
      );
      void queryClient.invalidateQueries({ queryKey: getGetAdminReturnsQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getGetAdminReturnsStatsQueryKey() });
    },
    [numericId, queryClient]
  );

  if (!isValidId) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className='mx-auto max-w-350 px-6 py-8'>
        <ReturnDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Failed to load return';

    return (
      <div className='flex min-h-[50vh] items-center justify-center p-8'>
        <div className='max-w-md rounded-2xl border-2 border-dashed p-12 text-center'>
          <IconAlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
          <h3 className='text-lg font-bold tracking-tight'>Return unavailable</h3>
          <p className='text-muted-foreground mt-2 text-sm'>{message}</p>
          <Button className='mt-4' variant='outline' onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const returnItem = data?.data;
  if (!returnItem?.id) {
    notFound();
  }

  return (
    <ReturnDetailView
      returnItem={returnItem}
      onWorkflowChange={invalidateReturnQueries}
      onReturnUpdate={applyReturnUpdate}
    />
  );
}

function ReturnDetailView({
  returnItem,
  onWorkflowChange,
  onReturnUpdate
}: {
  returnItem: DtoReturnResponse;
  onWorkflowChange: () => void;
  onReturnUpdate: (returnItem: DtoReturnResponse) => void;
}) {
  const returnId = returnItem.id!;
  const isExchange = returnItem.return_type === 'exchange';

  const { data: historyData, isLoading: isHistoryLoading } = useGetWorkflowsKeyEntityIdHistory(
    'return',
    returnId,
    { limit: 50, offset: 0 },
    { query: { enabled: returnId > 0 } }
  );

  const history = parseWorkflowHistoryResponse(historyData).history;

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 border-border/40 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-350 px-6 py-4'>
          <Flex align='start' className='gap-4'>
            <Link href='/dashboard/returns'>
              <Button
                variant='ghost'
                size='icon'
                className='border-border/60 h-9 w-9 shrink-0 rounded-xl border shadow-sm'
              >
                <IconArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
            <Flex direction='column' className='gap-2'>
              <Flex align='center' wrap='wrap' className='gap-2'>
                <Text variant='h4' as='h1' className='font-mono'>
                  Return #{returnItem.id}
                </Text>
                <ReturnTypeBadge returnType={returnItem.return_type} />
                <WorkflowStateBadge state={returnItem.state} fallbackLabel='Requested' />
              </Flex>
              <Text variant='muted' className='text-xs'>
                Order{' '}
                {returnItem.order_id ? (
                  <Link
                    href={`/dashboard/orders/${returnItem.order_id}`}
                    className='text-primary font-semibold hover:underline'
                  >
                    {returnItem.order_number ?? `#${returnItem.order_id}`}
                  </Link>
                ) : (
                  '—'
                )}
                {' · '}Requested {formatDate(returnItem.created_at)}
              </Text>
              <ReturnQuickActions returnItem={returnItem} onUpdated={onWorkflowChange} />
            </Flex>
          </Flex>
        </div>
      </div>

      <div className='mx-auto max-w-350 space-y-6 px-6 py-8'>
        <EntityWorkflowPanel
          workflowKey='return'
          entityId={returnId}
          title='Return workflow'
          description='Approve or reject requests, confirm receipt, and complete refunds or exchanges.'
          onTransitionSuccess={onWorkflowChange}
        />

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <div className='bg-card border-border/40 rounded-2xl border p-6 shadow-sm'>
              <Text variant='overline' className='text-muted-foreground'>
                Customer reason
              </Text>
              <Text variant='p' className='mt-3 leading-relaxed'>
                {returnItem.reason?.trim() || 'No reason provided.'}
              </Text>
              {isExchange && returnItem.exchange_notes ? (
                <>
                  <Text variant='overline' className='text-muted-foreground mt-5'>
                    Exchange notes
                  </Text>
                  <Text variant='p' className='mt-2 leading-relaxed'>
                    {returnItem.exchange_notes}
                  </Text>
                </>
              ) : null}
            </div>

            <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
              <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
                <Text variant='overline' className='text-muted-foreground'>
                  Activity
                </Text>
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
              <Text variant='overline' className='text-muted-foreground'>
                {isExchange ? 'Resolution' : 'Refund'}
              </Text>
              <Text variant='h3' className='mt-3 tabular-nums'>
                {isExchange ? 'Product exchange' : formatCurrency(returnItem.refund_amount ?? 0)}
              </Text>
              <Text variant='muted' className='mt-1 text-xs'>
                {isExchange
                  ? 'No monetary refund for exchange requests'
                  : 'Amount to refund customer'}
              </Text>
            </div>

            <div className='bg-card border-border/40 space-y-3 rounded-2xl border p-6 text-sm shadow-sm'>
              <Text variant='overline' className='text-muted-foreground'>
                Details
              </Text>
              <Flex justify='between' className='gap-4'>
                <Text variant='muted'>Customer</Text>
                <Text variant='small'>{returnItem.customer_name?.trim() || 'Unknown'}</Text>
              </Flex>
              <Flex justify='between' className='gap-4'>
                <Text variant='muted'>Email</Text>
                <Text variant='small'>{returnItem.customer_email ?? '—'}</Text>
              </Flex>
              <Flex justify='between' className='gap-4'>
                <Text variant='muted'>Last updated</Text>
                <Text variant='small' className='tabular-nums'>
                  {formatDate(returnItem.updated_at)}
                </Text>
              </Flex>
            </div>

            <ReturnNotesCard
              key={returnItem.admin_notes ?? 'empty'}
              returnId={returnId}
              notes={returnItem.admin_notes}
              onSaved={onReturnUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
