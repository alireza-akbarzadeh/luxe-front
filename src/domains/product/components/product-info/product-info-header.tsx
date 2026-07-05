import { IconStar, IconStarFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

interface ProductInfoHeaderProps {
  product: DtoProductWithLike;
}

export function ProductInfoHeader({ product }: ProductInfoHeaderProps) {
  const t = useTranslations('pdp.info');
  const { formatDecimal, moneyClassName } = useLocaleFormatters();

  return (
    <div className='space-y-5'>
      <div className='text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-[0.18em] uppercase'>
        {product.category?.name ? (
          <Link
            href={`/shop?categoryId=${product.category.id ?? ''}`}
            className='hover:text-accent transition-colors'
          >
            {product.category.name}
          </Link>
        ) : null}
        {product.sku ? <span>{t('sku', { sku: product.sku })}</span> : null}
      </div>

      <div className='space-y-4'>
        <h1 className='font-display text-[clamp(1.625rem,5vw,3rem)] leading-[1.08] font-semibold tracking-tight lg:text-[clamp(2rem,4vw,3rem)] lg:leading-[1.05]'>
          {product.name}
        </h1>

        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex items-center gap-0.5'>
            {Array.from({ length: 5 }).map((_, index) => {
              const filled = index < Math.round(product.rating || 0);
              const StarIcon = filled ? IconStarFilled : IconStar;
              return (
                <StarIcon
                  key={index}
                  className={cn(
                    'h-4 w-4',
                    filled ? 'fill-accent text-accent' : 'text-muted-foreground/30'
                  )}
                />
              );
            })}
          </div>
          <p className='text-muted-foreground text-sm'>
            <span className={cn('text-foreground font-medium', moneyClassName)}>
              {formatDecimal(product.rating ?? 0)}
            </span>
            {product.reviews_count ? t('ratingReviews', { count: product.reviews_count }) : null}
          </p>
        </div>
      </div>
    </div>
  );
}
