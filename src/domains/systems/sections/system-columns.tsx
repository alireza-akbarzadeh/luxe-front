// --------------- Table columns ---------------

import { type ColumnDef } from '@tanstack/react-table';

import { SystemTableActions } from '@/domains/systems/components/system-table-actions';
import { formatDate } from '@/lib/date';
import { truncate } from '@/lib/format';
import type { DtoSettingResponse } from '@/services/-settings-get.schemas';

export const systemColumns: ColumnDef<DtoSettingResponse>[] = [
  {
    accessorKey: 'key',
    header: 'Key',
    cell: ({ getValue }) => (
      <span className='font-mono text-sm font-medium'>{getValue<string>()}</span>
    )
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ getValue }) => {
      const desc = getValue<string | undefined>();
      return (
        <span className='text-muted-foreground text-xs'>{desc ? truncate(desc, 50) : '—'}</span>
      );
    }
  },
  {
    id: 'valuePreview',
    header: 'Value',
    cell: ({ row }) => {
      const str = JSON.stringify(row.original.value);
      return (
        <code className='bg-muted rounded px-1.5 py-0.5 text-[11px]'>{truncate(str, 40)}</code>
      );
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ getValue }) => (
      <span className='text-muted-foreground text-xs'>
        {formatDate(new Date(getValue<string>()), '')}
      </span>
    )
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <SystemTableActions row={row} />
  }
];
