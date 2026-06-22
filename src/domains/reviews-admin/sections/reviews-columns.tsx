'use client';

import { IconCheck, IconX } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import type { DtoAdminReviewResponse } from '@/domains/reviews-admin/lib/review-list';
import { createWorkflowStateColumn } from '@/domains/workflows/lib/create-workflow-state-column';
import { postAdminReviewsIdTransition } from '@/services/-admin-reviews-{id}-transition-post';

function formatReviewDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy');
}

async function transitionReview(id: number, event: 'approve' | 'reject', onDone?: () => void) {
  try {
    await postAdminReviewsIdTransition(id, { event });
    toast.success(event === 'approve' ? 'Review approved' : 'Review rejected');
    onDone?.();
  } catch (error) {
    toast.error('Moderation failed', {
      description: error instanceof Error ? error.message : 'Could not update review'
    });
  }
}

export const reviewColumns: ColumnDef<DtoAdminReviewResponse>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <span className='font-mono text-xs'>#{row.original.id ?? '—'}</span>
  },
  {
    accessorKey: 'product_name',
    header: 'Product',
    cell: ({ row }) => {
      const productId = row.original.product_id;
      const name = row.original.product_name ?? (productId ? `Product #${productId}` : '—');
      if (!productId) return <span className='text-sm'>{name}</span>;
      return (
        <Link
          href={`/product/${productId}`}
          className='text-primary text-sm font-medium hover:underline'
          onClick={(event) => event.stopPropagation()}
        >
          {name}
        </Link>
      );
    }
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => (
      <span className='text-sm font-semibold tabular-nums'>{row.original.rating ?? '—'}/5</span>
    )
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <p className='max-w-48 truncate text-sm' title={row.original.title}>
        {row.original.title ?? '—'}
      </p>
    )
  },
  {
    accessorKey: 'author',
    header: 'Author',
    cell: ({ row }) => <span className='text-sm'>{row.original.author ?? '—'}</span>
  },
  createWorkflowStateColumn<DtoAdminReviewResponse>({
    workflowKey: 'review',
    getEntityId: (row) => row.id,
    getState: (row) => row.state,
    header: 'Status',
    fallbackLabel: 'Pending'
  }),
  {
    accessorKey: 'created_at',
    header: 'Submitted',
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs'>
        {formatReviewDate(row.original.created_at)}
      </span>
    )
  }
];

export function reviewRowMenuActions(
  review: DtoAdminReviewResponse,
  onRefresh?: () => void
): React.ReactNode[] {
  if (!review.id) return [];
  const status = review.status ?? review.state?.code;
  const actions: React.ReactNode[] = [];

  if (status === 'pending') {
    actions.push(
      <DropdownMenuItem
        key='approve'
        onClick={() => void transitionReview(review.id!, 'approve', onRefresh)}
      >
        <IconCheck className='mr-2 size-4' />
        Approve
      </DropdownMenuItem>,
      <DropdownMenuItem
        key='reject'
        onClick={() => void transitionReview(review.id!, 'reject', onRefresh)}
      >
        <IconX className='mr-2 size-4' />
        Reject
      </DropdownMenuItem>
    );
  }

  return actions;
}
