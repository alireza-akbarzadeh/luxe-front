'use client';

import { Badge } from '@/components/ui/badge';
import type { DtoBrandResponse } from '@/services/-brands-get.schemas';
import { useGetHomeTopBrands } from '@/services/-home-top-brands-get';

interface BrandHomepageBadgeProps {
  brand?: Pick<DtoBrandResponse, 'id' | 'is_featured'>;
}

/** Shows featured pin or sales-ranked homepage placement for a brand. */
export function BrandHomepageBadge({ brand }: BrandHomepageBadgeProps) {
  const { data } = useGetHomeTopBrands(
    { limit: 50 },
    { query: { staleTime: 5 * 60_000, enabled: Boolean(brand?.id) && !brand?.is_featured } }
  );

  if (!brand?.id) return null;

  if (brand.is_featured) {
    return (
      <Badge variant='default' className='text-[10px] font-semibold uppercase'>
        Featured
      </Badge>
    );
  }

  const isTopSales = data?.data?.brands?.some((item) => item.id === brand.id);
  if (!isTopSales) return null;

  return (
    <Badge variant='secondary' className='text-[10px] font-semibold uppercase'>
      Top sales
    </Badge>
  );
}
