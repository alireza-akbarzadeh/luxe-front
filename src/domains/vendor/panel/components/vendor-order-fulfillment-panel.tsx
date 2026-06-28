'use client';

import { IconLoader2, IconRefresh } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { WorkflowStateBadge } from '@/domains/workflows/components/workflow-state-badge';
import type { VendorWorkflowTransitionView } from '@/lib/api/vendor-orders';
import { cn } from '@/lib/utils';

import { useVendorOrderWorkflow } from '../hooks/use-vendor-order-workflow';

interface VendorOrderFulfillmentPanelProps {
  storeId: number;
  orderId: number;
  className?: string;
}

export function VendorOrderFulfillmentPanel({
  storeId,
  orderId,
  className
}: VendorOrderFulfillmentPanelProps) {
  const t = useTranslations('vendor.panel.orders');
  const [pendingTransition, setPendingTransition] = useState<VendorWorkflowTransitionView | null>(
    null
  );
  const [note, setNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const workflow = useVendorOrderWorkflow({ storeId, orderId });

  const closeDialog = () => {
    setPendingTransition(null);
    setNote('');
    setTrackingNumber('');
  };

  const handleConfirm = async () => {
    if (!pendingTransition?.event) return;
    if (pendingTransition.event === 'ship' && !trackingNumber.trim()) {
      return;
    }

    try {
      await workflow.performTransition(
        pendingTransition.event,
        note,
        pendingTransition.event === 'ship' ? trackingNumber : undefined
      );
      closeDialog();
    } catch {
      // Toast handled in hook
    }
  };

  const shipRequiresTracking = pendingTransition?.event === 'ship';

  return (
    <>
      <Card className={cn('border-border/40 bg-card/50 rounded-2xl shadow-none', className)}>
        <CardHeader className='flex flex-row items-start justify-between gap-4 space-y-0 pb-4'>
          <div className='space-y-1'>
            <CardTitle className='text-base'>{t('fulfillmentTitle')}</CardTitle>
            <CardDescription>{t('fulfillmentDescription')}</CardDescription>
          </div>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='size-8 shrink-0 rounded-xl'
            disabled={workflow.isFetching}
            onClick={() => void workflow.refetch()}
            aria-label='Refresh fulfillment actions'
          >
            <IconRefresh className={cn('size-4', workflow.isFetching && 'animate-spin')} />
          </Button>
        </CardHeader>

        <CardContent>
          {workflow.isLoading ? (
            <Skeleton className='h-10 w-full rounded-xl' />
          ) : (
            <Flex direction='column' spacing={4}>
              <Flex align='center' spacing={2}>
                <WorkflowStateBadge
                  state={workflow.currentState}
                  fallbackLabel={t('detailStatus')}
                />
              </Flex>

              {workflow.transitions.length === 0 ? (
                <p className='text-muted-foreground text-sm'>{t('fulfillmentNoActions')}</p>
              ) : (
                <Flex direction='row' wrap='wrap' spacing={2}>
                  {workflow.transitions.map((transition) => {
                    const label =
                      transition.name ?? transition.to_state?.name ?? transition.event ?? 'Update';

                    return (
                      <Button
                        key={transition.event ?? String(transition.id)}
                        type='button'
                        size='sm'
                        className='rounded-xl'
                        disabled={workflow.isTransitioning}
                        onClick={() => {
                          setNote('');
                          setTrackingNumber('');
                          setPendingTransition(transition);
                        }}
                      >
                        {label}
                      </Button>
                    );
                  })}
                </Flex>
              )}
            </Flex>
          )}
        </CardContent>
      </Card>

      <AppDialog
        open={Boolean(pendingTransition)}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        title={pendingTransition?.name ?? t('fulfillmentTitle')}
        description={
          pendingTransition?.to_state?.name
            ? pendingTransition.to_state.name
            : t('fulfillmentDescription')
        }
        size='sm'
      >
        <Flex direction='column' spacing={4}>
          {shipRequiresTracking ? (
            <Flex direction='column' spacing={2}>
              <Label htmlFor='vendor-tracking'>{t('fulfillmentTrackingLabel')}</Label>
              <Input
                id='vendor-tracking'
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                placeholder={t('fulfillmentTrackingPlaceholder')}
                className='rounded-xl'
              />
            </Flex>
          ) : null}

          <Flex direction='column' spacing={2}>
            <Label htmlFor='vendor-fulfillment-note'>
              Note <span className='text-muted-foreground font-normal'>(optional)</span>
            </Label>
            <Textarea
              id='vendor-fulfillment-note'
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              maxLength={512}
              className='rounded-xl'
            />
          </Flex>

          <Flex justify='end' spacing={2}>
            <Button type='button' variant='ghost' onClick={closeDialog}>
              {t('fulfillmentCancel')}
            </Button>
            <Button
              type='button'
              disabled={
                workflow.isTransitioning || (shipRequiresTracking && !trackingNumber.trim())
              }
              onClick={() => void handleConfirm()}
            >
              {workflow.isTransitioning ? (
                <>
                  <IconLoader2 className='size-4 animate-spin' />
                  {t('fulfillmentApplying')}
                </>
              ) : (
                t('fulfillmentConfirm')
              )}
            </Button>
          </Flex>
        </Flex>
      </AppDialog>
    </>
  );
}
