import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

interface ProductInfoPricingProps {
  product: DtoProductWithLike;
  discountAmount: number;
}

export function ProductInfoPricing({ product, discountAmount }: ProductInfoPricingProps) {
  const t = useTranslations('pdp.info');
  const { formatPrice, moneyClassName } = useLocaleFormatters();
  const hasComparePrice =
    product.compare_at_price != null && product.compare_at_price > Number(product.price ?? 0);

  return (
    <div className='flex flex-wrap items-end gap-x-4 gap-y-2'>
      <span className={cn('text-4xl font-semibold tracking-tight', moneyClassName)}>
        {formatPrice(product.price)}
      </span>
      {hasComparePrice ? (
        <>
          <span className={cn('text-muted-foreground pb-1 text-lg line-through', moneyClassName)}>
            {formatPrice(product.compare_at_price)}
          </span>
          {discountAmount > 0 ? (
            <Badge
              variant='outline'
              className='border-accent/30 bg-accent/10 text-accent mb-1 rounded-full px-3 py-1 text-xs font-medium'
            >
              {t('saveAmount', { amount: formatPrice(discountAmount) })}
            </Badge>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
