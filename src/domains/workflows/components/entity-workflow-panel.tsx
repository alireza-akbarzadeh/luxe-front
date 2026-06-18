'use client';

import { IconArrowRight, IconHistory, IconLoader2, IconRefresh } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { DtoTransitionView } from '@/services/-workflows-{key}-{entityId}-available-transitions-get.schemas';

import { useEntityWorkflow } from '../hooks/use-entity-workflow';
import type { WorkflowEntityKey } from '../types/workflow-runtime.types';
import { WorkflowHistoryTimeline } from './workflow-history-timeline';
import { WorkflowStateBadge } from './workflow-state-badge';

const ENTITY_LABELS: Record<WorkflowEntityKey, string> = {
  product: 'Product',
  order: 'Order',
  shipment: 'Shipment',
  return: 'Return',
  user: 'User'
};

interface EntityWorkflowPanelProps {
  workflowKey: WorkflowEntityKey;
  entityId: number;
  title?: string;
  description?: string;
  className?: string;
  onTransitionSuccess?: () => void;
}

export function EntityWorkflowPanel({
  workflowKey,
  entityId,
  title,
  description,
  className,
  onTransitionSuccess
}: EntityWorkflowPanelProps) {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [pendingTransition, setPendingTransition] = useState<DtoTransitionView | null>(null);
  const [note, setNote] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);

  const workflow = useEntityWorkflow({
    workflowKey,
    entityId,
    onTransitionSuccess
  });

  const entityLabel = ENTITY_LABELS[workflowKey];
  const panelTitle = title ?? `${entityLabel} workflow`;
  const panelDescription =
    description ?? `Change lifecycle state and review activity for this ${entityLabel.toLowerCase()}.`;

  const transitionByEvent = useMemo(() => {
    const map = new Map<string, DtoTransitionView>();
    for (const transition of workflow.transitions) {
      if (transition.event) map.set(transition.event, transition);
    }
    return map;
  }, [workflow.transitions]);

  const openConfirmForEvent = (event: string) => {
    const transition = transitionByEvent.get(event);
    if (!transition) return;
    setNote('');
    setPendingTransition(transition);
  };

  const handleConfirmTransition = async () => {
    if (!pendingTransition?.event) return;

    try {
      await workflow.performTransition(pendingTransition.event, note);
      setPendingTransition(null);
      setSelectedEvent('');
      setNote('');
    } catch {
      // Toast handled in hook
    }
  };

  const closeConfirmDialog = () => {
    setPendingTransition(null);
    setNote('');
    setSelectedEvent('');
  };

  return (
    <>
      <Card className={cn('border-border/40 bg-card/40 backdrop-blur-2xl', className)}>
        <CardHeader className='flex flex-row items-start justify-between gap-4 space-y-0 pb-4'>
          <div className='space-y-1'>
            <CardTitle className='text-base'>{panelTitle}</CardTitle>
            <CardDescription>{panelDescription}</CardDescription>
          </div>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='size-8 shrink-0'
            disabled={workflow.isFetching}
            onClick={workflow.refetch}
            aria-label='Refresh workflow'
          >
            <IconRefresh className={cn('size-4', workflow.isFetching && 'animate-spin')} />
          </Button>
        </CardHeader>

        <CardContent>
          {workflow.isLoading ? (
            <div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
              <Skeleton className='h-16 w-full sm:max-w-[140px]' />
              <Skeleton className='h-9 flex-1' />
              <Skeleton className='h-9 w-28' />
              <Skeleton className='h-9 w-32' />
            </div>
          ) : (
            <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
              <div className='grid flex-1 gap-4 sm:grid-cols-[minmax(0,140px)_minmax(0,1fr)] sm:items-end'>
                <div className='space-y-2'>
                  <Label className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                    Current
                  </Label>
                  <div className='flex min-h-9 items-center'>
                    <WorkflowStateBadge
                      state={workflow.currentState}
                      fallbackLabel='Not started'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='workflow-transition-select'
                    className='text-muted-foreground text-xs font-medium tracking-wide uppercase'
                  >
                    Move to
                  </Label>
                  <Select
                    value={selectedEvent}
                    onValueChange={(event) => {
                      setSelectedEvent(event);
                      openConfirmForEvent(event);
                    }}
                    disabled={workflow.isTransitioning || workflow.transitions.length === 0}
                  >
                    <SelectTrigger
                      id='workflow-transition-select'
                      className='bg-background/60 w-full'
                    >
                      <SelectValue
                        placeholder={
                          workflow.transitions.length === 0
                            ? 'No transitions available'
                            : 'Select next state…'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {workflow.transitions.map((transition) => {
                        const event = transition.event ?? String(transition.id);
                        const targetLabel =
                          transition.to_state?.name ??
                          transition.to_state?.code ??
                          transition.name ??
                          event;

                        return (
                          <SelectItem key={event} value={event}>
                            <span className='flex items-center gap-2'>
                              <span>{targetLabel}</span>
                              {transition.name && transition.name !== targetLabel ? (
                                <span className='text-muted-foreground text-xs'>
                                  · {transition.name}
                                </span>
                              ) : null}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type='button'
                variant='outline'
                className='w-full shrink-0 sm:w-auto'
                onClick={() => setHistoryOpen(true)}
              >
                <IconHistory className='size-4' />
                View history
                {workflow.historyTotal > 0 ? (
                  <span className='bg-muted text-muted-foreground ml-1 rounded-full px-2 py-0.5 text-xs font-medium'>
                    {workflow.historyTotal}
                  </span>
                ) : null}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AppDialog
        open={Boolean(pendingTransition)}
        onOpenChange={(open) => {
          if (!open) closeConfirmDialog();
        }}
        title={pendingTransition?.name ?? 'Confirm state change'}
        description={
          pendingTransition?.to_state
            ? `Move to ${pendingTransition.to_state.name ?? pendingTransition.to_state.code}`
            : 'Apply this workflow transition'
        }
        size='sm'
      >
        <div className='space-y-4'>
          {pendingTransition?.from_state || pendingTransition?.to_state ? (
            <div className='flex flex-wrap items-center gap-2'>
              {pendingTransition.from_state ? (
                <WorkflowStateBadge state={pendingTransition.from_state} />
              ) : (
                <WorkflowStateBadge state={workflow.currentState} />
              )}
              <IconArrowRight className='text-muted-foreground size-4' />
              {pendingTransition.to_state ? (
                <WorkflowStateBadge state={pendingTransition.to_state} />
              ) : null}
            </div>
          ) : null}

          <div className='space-y-2'>
            <label htmlFor='workflow-note' className='text-sm font-medium'>
              Note <span className='text-muted-foreground font-normal'>(optional)</span>
            </label>
            <Textarea
              id='workflow-note'
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder='Reason for this change…'
              rows={3}
              maxLength={512}
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button type='button' variant='ghost' onClick={closeConfirmDialog}>
              Cancel
            </Button>
            <Button
              type='button'
              disabled={workflow.isTransitioning}
              onClick={() => void handleConfirmTransition()}
            >
              {workflow.isTransitioning ? (
                <>
                  <IconLoader2 className='size-4 animate-spin' />
                  Applying…
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </div>
        </div>
      </AppDialog>

      <AppDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        title='Workflow history'
        description={`All state changes for this ${entityLabel.toLowerCase()}.`}
        size='md'
      >
        <WorkflowHistoryTimeline
          entries={workflow.history}
          isLoading={workflow.isLoading}
          emptyMessage='No workflow activity yet.'
        />
      </AppDialog>
    </>
  );
}
