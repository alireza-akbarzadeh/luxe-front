import { IconGitBranch } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ModelsWorkflow } from '@/services/-admin-workflows-get.schemas';

export const workflowColumns: ColumnDef<ModelsWorkflow>[] = [
  {
    accessorKey: 'name',
    header: 'Workflow',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <span className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg'>
          <IconGitBranch size={16} />
        </span>
        <div>
          <p className='font-medium'>{row.original.name}</p>
          <p className='text-muted-foreground font-mono text-xs'>{row.original.key}</p>
        </div>
      </div>
    )
  },
  {
    accessorKey: 'entity_type',
    header: 'Entity',
    cell: ({ getValue }) => <Badge variant='outline'>{getValue<string>()}</Badge>
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ getValue }) => (
      <span className='text-muted-foreground line-clamp-1 text-sm'>
        {getValue<string>() || '—'}
      </span>
    )
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ getValue }) => {
      const active = getValue<boolean>();
      return (
        <Badge variant={active ? 'default' : 'secondary'}>{active ? 'Active' : 'Inactive'}</Badge>
      );
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Button asChild size='sm' variant='outline'>
        <Link href={`/dashboard/workflows/${row.original.key ?? ''}`}>Open editor</Link>
      </Button>
    )
  }
];
