import { IconPackage, IconShieldCheck, IconTag, IconTruck } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

interface ProductDetailsHighlightsProps {
  product: DtoProductWithLike;
}

/** Quick-read merchandising facts for the PDP details tab. */
export function ProductDetailsHighlights({ product }: ProductDetailsHighlightsProps) {
  const highlights = [
    product.brand?.name && {
      icon: IconTag,
      label: 'Brand',
      value: product.brand.name
    },
    product.category?.name && {
      icon: IconTag,
      label: 'Category',
      value: product.category.name
    },
    {
      icon: IconPackage,
      label: 'Availability',
      value:
        (product.stock ?? 0) > 0
          ? `${product.stock} in stock`
          : product.allow_backorder
            ? 'Available on backorder'
            : 'Out of stock'
    },
    product.is_digital && {
      icon: IconShieldCheck,
      label: 'Delivery',
      value: 'Instant digital delivery'
    },
    !product.is_digital && {
      icon: IconTruck,
      label: 'Fulfillment',
      value: product.track_inventory ? 'Tracked inventory' : 'Standard shipping'
    }
  ].filter(Boolean) as Array<{
    icon: typeof IconTag;
    label: string;
    value: string;
  }>;

  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      {highlights.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className='border-border/60 bg-muted/20 flex items-start gap-3 rounded-2xl border p-4'
        >
          <div className='bg-background flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border'>
            <Icon className='text-muted-foreground h-4 w-4' />
          </div>
          <div>
            <p className='text-muted-foreground text-xs tracking-wide uppercase'>{label}</p>
            <p className='mt-1 text-sm font-medium'>{value}</p>
          </div>
        </div>
      ))}

      {product.tags && product.tags.length > 0 && (
        <div className='border-border/60 bg-muted/20 rounded-2xl border p-4 sm:col-span-2'>
          <p className='text-muted-foreground mb-3 text-xs tracking-wide uppercase'>Tags</p>
          <div className='flex flex-wrap gap-2'>
            {product.tags.map((tag) => (
              <Badge key={tag} variant='outline' className='rounded-full font-normal'>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
