import { IconSearch } from '@tabler/icons-react';
import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { useTableContext } from './table-context';

export const TableSearch = ({
  columnId,
  placeholder,
  className
}: {
  columnId?: string;
  placeholder: string;
  className?: string;
}) => {
  const { table } = useTableContext();

  const externalValue = columnId
    ? (table.getColumn(columnId)?.getFilterValue() as string | undefined)
    : (table.getState().globalFilter as string | undefined);

  const [localValue, setLocalValue] = React.useState(externalValue ?? '');
  const lastExternalRef = React.useRef(externalValue ?? '');

  // Sync down: external value changed from outside (e.g. Clear button) -> update local
  React.useEffect(() => {
    if (externalValue !== lastExternalRef.current) {
      lastExternalRef.current = externalValue ?? '';
      setLocalValue(externalValue ?? '');
    }
  }, [externalValue]);

  // Sync up: debounce local typing back to the table
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue === lastExternalRef.current) return;

      lastExternalRef.current = localValue;

      if (columnId) {
        table.getColumn(columnId)?.setFilterValue(localValue);
      } else {
        table.setGlobalFilter(localValue);
      }
    }, 200);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue, columnId]);

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <IconSearch className='text-muted-foreground/50 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
      <Input
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className='bg-card/40 border-border/40 h-11 rounded-none border-none pl-9 text-xs font-medium outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
      />
    </div>
  );
};
