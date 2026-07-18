import type { ColumnDef } from '@tanstack/react-table';

import { createSelectColumn } from '@/components/table/data-table';
import { Flex } from '@/components/ui/flex';
import { createWorkflowStateColumn } from '@/domains/workflows/lib/create-workflow-state-column';
import { mapPrivacyRuleStatusToStateView } from '@/domains/workflows/lib/workflow-runtime';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import type { DtoPrivacyRuleResponse } from '@/services/-admin-privacy-rules-get.schemas';

export const privacyRuleColumns: ColumnDef<DtoPrivacyRuleResponse>[] = [
  createSelectColumn<DtoPrivacyRuleResponse>(),

  {
    accessorKey: 'name',
    header: 'Rule',
    cell: ({ row }) => (
      <Flex direction='column' spacing={1}>
        <span className='font-medium'>{row.original.name || '—'}</span>
        <span className='text-muted-foreground text-xs'>key: {row.original.key || '—'}</span>
      </Flex>
    )
  },

  {
    accessorKey: 'provider',
    header: 'Provider',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
        {(row.original.provider || '—').replaceAll('_', ' ')}
      </span>
    )
  },

  {
    accessorKey: 'locale',
    header: 'Locale',
    cell: ({ row }) => <span className='text-xs'>{row.original.locale || 'en'}</span>
  },

  {
    accessorKey: 'version',
    header: 'Version',
    cell: ({ row }) => <span className='text-xs'>v{row.original.version ?? 1}</span>
  },

  createWorkflowStateColumn<DtoPrivacyRuleResponse>({
    workflowKey: 'privacy_rule',
    getEntityId: (row) => row.id,
    getState: (row) => row.workflow_state ?? mapPrivacyRuleStatusToStateView(row.status),
    header: 'Workflow'
  }),

  {
    accessorKey: 'updated_at',
    header: 'Updated',
    cell: ({ row }) => {
      const date = row.original.updated_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  }
];
