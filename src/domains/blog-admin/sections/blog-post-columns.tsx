import type { ColumnDef } from '@tanstack/react-table';

import { createSelectColumn } from '@/components/table/data-table';
import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { createWorkflowStateColumn } from '@/domains/workflows/lib/create-workflow-state-column';
import { mapBlogPostStatusToStateView } from '@/domains/workflows/lib/workflow-runtime';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoBlogPostListItem } from '@/services/-admin-blog-posts-get.schemas';

export const blogPostColumns: ColumnDef<DtoBlogPostListItem>[] = [
  createSelectColumn<DtoBlogPostListItem>(),

  {
    id: 'hero',
    header: 'Image',
    cell: ({ row }) => (
      <div className='relative h-12 w-16 overflow-hidden rounded-md border'>
        <AppImage
          src={row.original.hero_image_url ?? IMAGE_FALLBACK}
          alt={row.original.hero_image_alt || row.original.title || 'Post'}
          fill
          className='object-cover'
          sizes='64px'
        />
      </div>
    )
  },

  {
    accessorKey: 'title',
    header: 'Article',
    cell: ({ row }) => (
      <Flex direction='column' spacing={1}>
        <span className='font-medium'>{row.original.title || '—'}</span>
        <span className='text-muted-foreground text-xs'>/{row.original.slug || '—'}</span>
      </Flex>
    )
  },

  {
    accessorKey: 'section_type',
    header: 'Section',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs'>
        {(row.original.section_type || 'article').replaceAll('_', ' ')}
      </span>
    )
  },

  {
    id: 'category',
    header: 'Category',
    cell: ({ row }) => <span className='text-sm'>{row.original.category?.name || '—'}</span>
  },

  createWorkflowStateColumn<DtoBlogPostListItem>({
    workflowKey: 'blog_post',
    getEntityId: (row) => row.id,
    getState: (row) => mapBlogPostStatusToStateView(row.status),
    header: 'Status'
  }),

  {
    accessorKey: 'published_at',
    header: 'Published',
    cell: ({ row }) => {
      const date = row.original.published_at;
      return <div className='text-xs'>{date ? formatDate(date, DATE_FORMATS.SHORT) : '—'}</div>;
    }
  }
];
