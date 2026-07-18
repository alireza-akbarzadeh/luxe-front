import type { ColumnDef } from '@tanstack/react-table';

import { createSelectColumn } from '@/components/table/data-table';
import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import type { DtoStoreHolidayResponse } from '@/services/-admin-calendar-holidays-get.schemas';

const HOLIDAY_TYPE_LABEL: Record<string, string> = {
  national: 'National',
  regional: 'Regional',
  store: 'Store',
  vendor: 'Vendor'
};

export const holidayColumns: ColumnDef<DtoStoreHolidayResponse>[] = [
  createSelectColumn<DtoStoreHolidayResponse>(),

  {
    accessorKey: 'name',
    header: 'Holiday',
    cell: ({ row }) => (
      <Flex direction='column' spacing={1}>
        <Typography.Text className='font-medium'>{row.original.name || '—'}</Typography.Text>
        {row.original.region && <Typography.Muted className='text-xs'>{row.original.region}</Typography.Muted>}
      </Flex>
    )
  },

  {
    accessorKey: 'holiday_type',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant='outline'>
        {HOLIDAY_TYPE_LABEL[row.original.holiday_type ?? ''] ?? row.original.holiday_type ?? '—'}
      </Badge>
    )
  },

  {
    accessorKey: 'start_date',
    header: 'Date',
    cell: ({ row }) => {
      const start = row.original.start_date;
      const end = row.original.end_date;
      if (!start) return <Typography.Muted className='text-xs'>—</Typography.Muted>;
      const label =
        end && end !== start
          ? `${formatDate(start, DATE_FORMATS.SHORT)} – ${formatDate(end, DATE_FORMATS.SHORT)}`
          : formatDate(start, DATE_FORMATS.SHORT);
      return <Typography.Text className='text-xs'>{label}</Typography.Text>;
    }
  },

  {
    id: 'store_count',
    header: 'Store Count',
    cell: ({ row }) => {
      const applyTo = row.original.apply_to;
      const count = row.original.store_ids?.length ?? 0;
      return (
        <Typography.Text className='text-xs'>
          {applyTo === 'all' ? 'All stores' : `${count} store${count === 1 ? '' : 's'}`}
        </Typography.Text>
      );
    }
  },

  {
    accessorKey: 'is_recurring',
    header: 'Recurring',
    cell: ({ row }) => (
      <Typography.Text className='text-xs'>{row.original.is_recurring ? 'Yes' : 'No'}</Typography.Text>
    )
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'published' ? 'default' : 'secondary'}>
        {row.original.status === 'published' ? 'Published' : 'Draft'}
      </Badge>
    )
  },

  {
    accessorKey: 'created_by',
    header: 'Created By',
    cell: ({ row }) => (
      <Typography.Muted className='text-xs'>
        {row.original.created_by ? `User #${row.original.created_by}` : '—'}
      </Typography.Muted>
    )
  }
];
