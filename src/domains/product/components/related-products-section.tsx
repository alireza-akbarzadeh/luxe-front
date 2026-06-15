'use client';

import { IconArrowUpRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetProductsIdRelated } from '@/services/-products-{id}-related-get';

const PREVIEW_LIMIT = 4;
const SHEET_LIMIT = 10;

interface RelatedProductsSectionProps {
  productId: number;
  categoryId?: number;
  categoryName?: string;
}

/** Category-based recommendations with expandable sheet for more picks. */
export function RelatedProductsSection({
  productId,
  categoryId,
  categoryName
}: RelatedProductsSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: previewData, isLoading: previewLoading } = useGetProductsIdRelated(productId, {
    limit: PREVIEW_LIMIT
  });

  const { data: sheetData, isLoading: sheetLoading } = useGetProductsIdRelated(
    productId,
    { limit: SHEET_LIMIT },
    { query: { enabled: sheetOpen && productId > 0 } }
  );

  const previewProducts = previewData?.data ?? [];
  const sheetProducts = sheetData?.data ?? previewProducts;

  if (!previewLoading && previewProducts.length === 0) {
    return null;
  }

  const categoryHref = categoryId ? `/shop?categoryId=${categoryId}` : '/shop';

  return (
    <>
      <section className='mt-20'>
        <div className='mb-8 flex items-end justify-between gap-4'>
          <div>
            <h2 className='font-display text-2xl md:text-3xl'>You may also like</h2>
            {categoryName && (
              <p className='text-muted-foreground mt-1 text-sm'>More picks in {categoryName}</p>
            )}
          </div>
          {previewProducts.length > 0 && (
            <Button
              type='button'
              variant='ghost'
              className='text-accent hover:text-accent/80 shrink-0 rounded-full px-4'
              onClick={() => setSheetOpen(true)}
            >
              View all
              <IconArrowUpRight className='ml-1 h-4 w-4' />
            </Button>
          )}
        </div>

        {previewLoading ? (
          <div className='grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='aspect-4/5 w-full rounded-2xl' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4'>
            {previewProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side='right' className='flex w-full flex-col gap-0 p-0 sm:max-w-xl'>
          <SheetHeader className='border-border border-b px-6 py-5 text-left'>
            <SheetTitle className='font-display text-xl'>You may also like</SheetTitle>
            <SheetDescription>
              {categoryName
                ? `Hand-picked alternatives in ${categoryName}.`
                : 'Explore more products you might love.'}
            </SheetDescription>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6 py-6'>
            {sheetLoading ? (
              <div className='grid grid-cols-2 gap-4'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className='aspect-4/5 w-full rounded-2xl' />
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-4'>
                {sheetProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} size='compact' />
                ))}
              </div>
            )}
          </div>

          <div className='border-border border-t px-6 py-4'>
            <Button asChild variant='outline' className='w-full rounded-full'>
              <Link href={categoryHref} onClick={() => setSheetOpen(false)}>
                Browse all in {categoryName ?? 'shop'}
                <IconArrowUpRight className='ml-1 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
