import type { DtoStateView } from '@/services/-workflows-{key}-{entityId}-available-transitions-get.schemas';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { getWorkflowStateStyle } from '../lib/workflow-runtime';

interface WorkflowStateBadgeProps {
  state?: DtoStateView;
  className?: string;
  fallbackLabel?: string;
}

export function WorkflowStateBadge({
  state,
  className,
  fallbackLabel = 'Unknown'
}: WorkflowStateBadgeProps) {
  const label = state?.name ?? state?.code ?? fallbackLabel;
  const style = getWorkflowStateStyle(state);

  return (
    <Badge
      variant='secondary'
      className={cn('border-0 text-xs font-semibold tracking-wide uppercase', className)}
      style={style}
    >
      {label}
    </Badge>
  );
}
