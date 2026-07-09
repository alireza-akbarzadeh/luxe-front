'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { DtoBrandResponse } from '@/services/-brands-get.schemas';
import { useGetProducts } from '@/services/-products-get';

interface BrandProductCountCellProps {
  brand?: Pick<DtoBrandResponse, 'id' | 'product_count'>;
}

/** Admin table cell — uses list product_count when available, otherwise queries products API. */
export function BrandProductCountCell({ brand }: BrandProductCountCellProps) {
  const hasInlineCount = brand?.product_count != null;
  const { data, isLoading } = useGetProducts(
    brand?.id ? { brand_id: brand.id, limit: 1, offset: 0 } : undefined,
    {
      query: {
        enabled: Boolean(brand?.id) && !hasInlineCount,
        staleTime: 60_000
      }
    }
  );

  if (!brand?.id) return <span className='text-muted-foreground text-sm'>—</span>;

  if (hasInlineCount) {
    return <span className='text-sm tabular-nums'>{brand.product_count!.toLocaleString()}</span>;
  }

  if (isLoading) return <Skeleton className='h-4 w-8' />;

  const total = data?.data?.total ?? 0;
  return <span className='text-sm tabular-nums'>{total.toLocaleString()}</span>;
}
