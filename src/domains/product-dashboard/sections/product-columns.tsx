import type { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { ProductRowActions } from '@/domains/product-dashboard/components/product-row-actions';
import { cn } from '@/lib/utils';
import { createSelectColumn } from '~/src/components/table/data-table';
import { formatPrice } from '~/src/domains/home/lib/home-utils';
import { StoreRatingStars } from '~/src/domains/store/components/store-rating-start';
import { createWorkflowStateColumn } from '~/src/domains/workflows/lib/create-workflow-state-column';
import type { DtoProductWithLike } from '~/src/services/-products-get.schemas';

export const productColumns: ColumnDef<DtoProductWithLike>[] = [
  createSelectColumn<DtoProductWithLike>(),
  // Product Image (first)
  {
    accessorKey: 'images',
    id: 'images',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.original.images?.[0];
      return (
        <div className='bg-muted relative h-12 w-12 overflow-hidden rounded-md border'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={row.original.name ?? 'Product'}
              fill
              className='object-cover'
              sizes='48px'
            />
          ) : (
            <div className='text-muted-foreground flex h-full w-full items-center justify-center text-xs'>
              —
            </div>
          )}
        </div>
      );
    }
  },
  // Product Name & SKU
  {
    accessorKey: 'name',
    id: 'name',
    header: 'Product',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.name || '—'}</span>
        <span className='text-muted-foreground text-xs'>SKU: {row.original.sku || '—'}</span>
      </div>
    )
  },
  // Price (formatted)
  {
    accessorKey: 'price',
    id: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = row.original.price;
      const compareAt = row.original.compare_at_price;
      const isOnSale = compareAt && compareAt > (price ?? 0);
      return (
        <div className='flex flex-col'>
          <span className={cn(isOnSale && 'text-destructive text-xs line-through')}>
            {formatPrice(price ?? 0)}
          </span>
          {isOnSale && (
            <span className='font-medium text-emerald-600'>{formatPrice(compareAt)}</span>
          )}
        </div>
      );
    }
  },
  // Stock status
  {
    accessorKey: 'stock',
    id: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.original.stock ?? 0;
      return (
        <div className='flex flex-col'>
          <span className={cn(stock <= 5 && 'text-destructive font-bold')}>{stock}</span>
          {stock <= 5 && stock > 0 && (
            <span className='text-destructive text-[10px]'>Low stock</span>
          )}
          {stock === 0 && <span className='text-muted-foreground text-[10px]'>Out of stock</span>}
        </div>
      );
    }
  },
  // Rating
  {
    accessorKey: 'rating',
    id: 'rating',
    header: 'Rating',
    cell: ({ row }) => (
      <div className='flex flex-col gap-0.5'>
        <StoreRatingStars rating={row.original.rating ?? 0} />
        <span className='text-muted-foreground text-[10px]'>
          ({row.original.reviews_count ?? 0} reviews)
        </span>
      </div>
    )
  },
  // Category
  {
    accessorKey: 'category',
    id: 'category',
    header: 'Category',
    cell: ({ row }) => <span>{row.original.category?.name || '—'}</span>
  },
  // Badges (Digital / New)
  {
    id: 'badges',
    header: 'Type',
    cell: ({ row }) => (
      <div className='flex gap-1'>
        {row.original.is_digital && (
          <Badge variant='secondary' className='text-[10px]'>
            Digital
          </Badge>
        )}
        {row.original.is_new && (
          <Badge variant='outline' className='border-emerald-500 text-[10px] text-emerald-600'>
            New
          </Badge>
        )}
      </div>
    )
  },
  // Workflow state (from product workflow engine)
  createWorkflowStateColumn<DtoProductWithLike>({
    workflowKey: 'product',
    getEntityId: (row) => row.id,
    getState: (row) => row.workflow_state,
    header: 'Workflow'
  }),
  // Created date
  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: 'Created',
    filterFn: 'arrIncludesSome',
    cell: ({ row }) => {
      const date = row.original.created_at;
      return <div className='text-xs'>{date ? new Date(date).toLocaleDateString() : '—'}</div>;
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <ProductRowActions product={row.original} />,
    enableSorting: false,
    enableHiding: false
  }
];
