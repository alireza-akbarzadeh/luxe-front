import { IconSearch } from '@tabler/icons-react';
import type * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { useTableContext } from './table-context';

// --- Types ---
export interface StatusOption {
  label: string;
  value?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// --- Components ---

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
  const value = columnId
    ? (table.getColumn(columnId)?.getFilterValue() as string)
    : (table.getState().globalFilter as string);

  const onChange = (val: string) => {
    if (columnId) {
      table.getColumn(columnId)?.setFilterValue(val);
    } else {
      table.setGlobalFilter(val);
    }
  };

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <IconSearch className='text-muted-foreground/50 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
      <Input
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className='bg-card/40 border-border/40 h-11 rounded-2xl pl-9'
      />
    </div>
  );
};
