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
    ? (table.getColumn(columnId)?.getFilterValue() as string)
    : (table.getState().globalFilter as string);

  // 1. Store BOTH the local typing text and the last known external value in state
  const [{ localValue, lastExternalValue }, setValues] = React.useState({
    localValue: externalValue ?? '',
    lastExternalValue: externalValue ?? ''
  });

  // 2. Adjust state inline during render when externalValue changes (e.g., when clicking Reset)
  // This avoids cascading effects entirely and updates everything in a single render pass
  if (externalValue !== lastExternalValue) {
    setValues({
      localValue: externalValue ?? '',
      lastExternalValue: externalValue ?? ''
    });
  }

  // 3. Debounce local value changes back up to the master table
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (columnId) {
        if (table.getColumn(columnId)?.getFilterValue() !== localValue) {
          table.getColumn(columnId)?.setFilterValue(localValue);
        }
      } else {
        if (table.getState().globalFilter !== localValue) {
          table.setGlobalFilter(localValue);
        }
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [localValue, columnId, table]);

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <IconSearch className='text-muted-foreground/50 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
      <Input
        placeholder={placeholder}
        value={localValue}
        onChange={(e) =>
          setValues((prev) => ({
            ...prev,
            localValue: e.target.value
          }))
        }
        className='bg-card/40 border-border/40 h-11 rounded-2xl pl-9 text-xs font-medium'
      />
    </div>
  );
};
