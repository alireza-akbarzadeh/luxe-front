'use client';

import { IconDiscount2, IconStar, IconTrophy } from '@tabler/icons-react';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getCompareWinners } from '@/domains/compare/lib/compare-utils';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoCompareProductResponse } from '@/services/-compare-post.schemas';

interface CompareSummaryProps {
  products: DtoCompareProductResponse[];
}

function SummaryCard({
  title,
  icon,
  product,
  detail
}: {
  title: string;
  icon: React.ReactNode;
  product: DtoCompareProductResponse | null | undefined;
  detail: React.ReactNode;
}) {
  if (!product) {
    return (
      <Card className='border-border/70 rounded-2xl border p-5'>
        <p className='text-muted-foreground mb-2 text-xs font-semibold tracking-[0.16em] uppercase'>
          {title}
        </p>
        <p className='text-muted-foreground text-sm'>Not enough data</p>
      </Card>
    );
  }

  return (
    <Card className='border-border/70 hover:border-accent/30 rounded-2xl border p-5 transition-colors'>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <p className='text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase'>
          {title}
        </p>
        <Badge variant='secondary' className='bg-accent/10 text-accent gap-1'>
          {icon}
          Winner
        </Badge>
      </div>

      <Link href={getProductPath(product)} className='group flex items-center gap-3'>
        <div className='bg-secondary relative h-14 w-14 shrink-0 overflow-hidden rounded-xl'>
          <AppImage
            src={product.images?.[0] || IMAGE_FALLBACK}
            alt={product.name ?? ''}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
        </div>
        <div className='min-w-0'>
          <p className='group-hover:text-accent line-clamp-2 text-sm font-semibold transition-colors'>
            {product.name}
          </p>
          <div className='mt-1'>{detail}</div>
        </div>
      </Link>
    </Card>
  );
}

export function CompareSummary({ products }: CompareSummaryProps) {
  if (products.length < 2) return null;

  const { bestPriceProduct, bestRatingProduct, bestDiscountProduct } = getCompareWinners(products);

  return (
    <section className='mt-10'>
      <div className='mb-5 flex items-center gap-2'>
        <IconTrophy className='text-accent h-5 w-5' />
        <h2 className='text-xl font-semibold tracking-tight'>Quick picks</h2>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <SummaryCard
          title='Best price'
          icon={<IconTrophy className='h-3 w-3' />}
          product={bestPriceProduct}
          detail={
            <p className='font-semibold text-emerald-600 tabular-nums dark:text-emerald-400'>
              {formatPrice(bestPriceProduct?.price)}
            </p>
          }
        />

        <SummaryCard
          title='Highest rated'
          icon={<IconStar className='h-3 w-3' />}
          product={bestRatingProduct}
          detail={
            <p className='text-accent flex items-center gap-1 tabular-nums'>
              <IconStar className='fill-accent h-4 w-4' />
              {bestRatingProduct?.rating ?? 0}
            </p>
          }
        />

        <SummaryCard
          title='Best value'
          icon={<IconDiscount2 className='h-3 w-3' />}
          product={bestDiscountProduct}
          detail={
            bestDiscountProduct ? (
              <p className='font-semibold text-emerald-600 tabular-nums dark:text-emerald-400'>
                {Math.round(bestDiscountProduct.discount_percent ?? 0)}% off
              </p>
            ) : (
              <p className='text-muted-foreground text-sm'>No discounted items</p>
            )
          }
        />
      </div>
    </section>
  );
}
