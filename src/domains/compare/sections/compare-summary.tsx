'use client';
import { Card } from '@/components/ui/card';
import { IconShield, IconStar } from '@tabler/icons-react';
import Image from 'next/image';
import type { DtoCompareProductResponse } from '~/src/services/-compare-post.schemas';

interface CompareSummaryProps {
  products: DtoCompareProductResponse[];
}

export function CompareSummary({ products }: CompareSummaryProps) {
  if (products.length < 2) return null;

  // Helper functions
  const bestPrice = Math.min(...products.map((p) => p.price ?? 0));
  const bestPriceProduct = products.find((p) => p.price === bestPrice);

  const bestRating = Math.max(...products.map((p) => p.rating || 0));
  const bestRatingProduct = products.find((p) => p.rating === bestRating);

  const productsWithDiscount = products.filter((p) => p.discount_percent && p.discount_percent > 0);
  let bestDiscountProduct = null;
  let bestDiscount = 0;
  if (productsWithDiscount.length > 0) {
    bestDiscount = Math.max(...productsWithDiscount.map((p) => p.discount_percent || 0));
    bestDiscountProduct = productsWithDiscount.find((p) => p.discount_percent === bestDiscount);
  }

  return (
    <div className='mt-8'>
      <Card className='p-6'>
        <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
          <IconShield className='text-primary h-5 w-5' />
          Quick Summary
        </h3>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {/* Best Price */}
          <div>
            <p className='text-muted-foreground mb-2 text-sm'>Best Price</p>
            {bestPriceProduct && (
              <div className='flex items-center gap-3'>
                <div className='bg-secondary relative h-10 w-10 overflow-hidden rounded-md'>
                  <Image
                    src={bestPriceProduct.images?.[0] || '/placeholder.png'}
                    alt={bestPriceProduct.name ?? ''}
                    fill
                    className='object-cover'
                  />
                </div>
                <div>
                  <p className='line-clamp-1 text-sm font-medium'>{bestPriceProduct.name}</p>
                  <p className='font-semibold text-green-500'>${bestPriceProduct.price}</p>
                </div>
              </div>
            )}
          </div>

          {/* Best Rating */}
          <div>
            <p className='text-muted-foreground mb-2 text-sm'>Highest Rated</p>
            {bestRatingProduct && (
              <div className='flex items-center gap-3'>
                <div className='bg-secondary relative h-10 w-10 overflow-hidden rounded-md'>
                  <Image
                    src={bestRatingProduct.images?.[0] || '/placeholder.png'}
                    alt={bestRatingProduct.name ?? ''}
                    fill
                    className='object-cover'
                  />
                </div>
                <div>
                  <p className='line-clamp-1 text-sm font-medium'>{bestRatingProduct.name}</p>
                  <p className='text-accent flex items-center gap-1'>
                    <IconStar className='fill-accent h-4 w-4' />
                    {bestRatingProduct.rating}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Best Value (highest discount) */}
          <div>
            <p className='text-muted-foreground mb-2 text-sm'>Best Value</p>
            {bestDiscountProduct ? (
              <div className='flex items-center gap-3'>
                <div className='bg-secondary relative h-10 w-10 overflow-hidden rounded-md'>
                  <Image
                    src={bestDiscountProduct.images?.[0] || '/placeholder.png'}
                    alt={bestDiscountProduct.name ?? ''}
                    fill
                    className='object-cover'
                  />
                </div>
                <div>
                  <p className='line-clamp-1 text-sm font-medium'>{bestDiscountProduct.name}</p>
                  <p className='font-semibold text-green-500'>{Math.round(bestDiscount)}% off</p>
                </div>
              </div>
            ) : (
              <p className='text-muted-foreground text-sm'>No discounted items</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
