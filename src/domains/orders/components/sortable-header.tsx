import { IconArrowsDownUp, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import type { SortableHeadProps, SortDirection } from '@/domains/orders/orders-types';

function SortIcon({ direction }: { direction: SortDirection | null }) {
  if (direction === 'asc') return <IconChevronUp className='ml-1 h-3 w-3' />;
  if (direction === 'desc') return <IconChevronDown className='ml-1 h-3 w-3' />;
  return <IconArrowsDownUp className='ml-1 h-3 w-3 opacity-40' />;
}

export function SortableHead({
  label,
  colKey,
  currentSortKey,
  currentSortDir,
  onSort
}: SortableHeadProps) {
  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => onSort(colKey)}
      className='-ml-3 h-8 text-[10px] font-bold tracking-widest uppercase'
    >
      {label}
      <SortIcon direction={currentSortKey === colKey ? currentSortDir : null} />
    </Button>
  );
}
