import type { ColumnDef } from '@tanstack/react-table';

import { createSelectColumn } from '@/components/table/data-table';
import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { BrandHomepageBadge } from '@/domains/brands/components/brand-homepage-badge';
import { BrandProductCountCell } from '@/domains/brands/components/brand-product-count-cell';
import { createWorkflowStateColumn } from '@/domains/workflows/lib/create-workflow-state-column';
import { mapBrandStatusToStateView } from '@/domains/workflows/lib/workflow-runtime';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoBrandResponse } from '@/services/-brands-get.schemas';

export const brandColumns: ColumnDef<DtoBrandResponse>[] = [
  createSelectColumn<DtoBrandResponse>(),

  {
    id: 'logo',
    header: 'Logo',
    cell: ({ row }) => {
      const logoUrl = row.original.logo_url;
      return (
        <div className='relative h-12 w-12 overflow-hidden rounded-md border p-1'>
          <AppImage
            src={logoUrl ?? IMAGE_FALLBACK}
            alt={row.original.name ?? 'Brand'}
            fill
            className='object-contain'
            sizes='48px'
          />
        </div>
      );
    }
  },

  {
    accessorKey: 'name',
    header: 'Brand',
    cell: ({ row }) => (
      <Flex direction='column' spacing={1}>
        <Flex direction='row' align='center' wrap='wrap' spacing={2}>
          <span className='font-medium'>{row.original.name || '—'}</span>
          <BrandHomepageBadge brand={row.original} />
        </Flex>
        <span className='text-muted-foreground text-xs'>Slug: {row.original.slug || '—'}</span>
      </Flex>
    )
  },

  {
    id: 'product_count',
    header: 'Products',
    cell: ({ row }) => <BrandProductCountCell brand={row.original} />
  },

  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const desc = row.original.description;
      return <span className='line-clamp-2 max-w-[280px] text-sm'>{desc || '—'}</span>;
    }
  },

  createWorkflowStateColumn<DtoBrandResponse>({
    workflowKey: 'brand',
    getEntityId: (row) => row.id,
    getState: (row) => row.workflow_state ?? mapBrandStatusToStateView(row.status),
    header: 'Workflow'
  }),

  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.original.created_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated',
    cell: ({ row }) => {
      const date = row.original.updated_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  }
];
