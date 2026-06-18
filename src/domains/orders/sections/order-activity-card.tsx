'use client';

import { WorkflowHistoryTimeline } from '@/domains/workflows/components/workflow-history-timeline';
import { parseWorkflowHistoryResponse } from '@/domains/workflows/lib/workflow-runtime';
import { useGetWorkflowsKeyEntityIdHistory } from '@/services/-workflows-{key}-{entityId}-history-get';

interface OrderActivityCardProps {
  orderId: number;
}

/** Inline workflow history for an order on the detail page. */
export function OrderActivityCard({ orderId }: OrderActivityCardProps) {
  const { data, isLoading } = useGetWorkflowsKeyEntityIdHistory(
    'order',
    orderId,
    { limit: 50, offset: 0 },
    { query: { enabled: orderId > 0 } }
  );

  const history = parseWorkflowHistoryResponse(data).history;

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
        <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
          Fulfillment activity
        </h2>
        <p className='text-muted-foreground mt-0.5 text-xs'>
          Status changes and workflow events for this order
        </p>
      </div>
      <div className='p-6'>
        <WorkflowHistoryTimeline
          entries={history}
          isLoading={isLoading}
          emptyMessage='No fulfillment activity yet. Use the workflow panel above to advance this order.'
        />
      </div>
    </div>
  );
}
