'use client';

import Link from 'next/link';
import { useGetProducts } from '~/src/services/-products-get';
import { ProductCard } from '@/domains/shop/components/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { SectionHeader } from './section-header';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { mapProductForCard, resolveProducts, sectionContainerClass } from '../lib/home-utils';

const CAROUSEL_ITEM_CLASS =
  'basis-[85%] sm:basis-[48%] md:basis-[38%] lg:basis-1/3 xl:basis-1/6';

export function NewArrivalsSection() {
  const { data, isLoading, isError } = useGetProducts({
    status: 'active',
    limit: 6,
    offset: 0,
    is_new: true,
    sort: 'newest'
  });

  const products = resolveProducts(data?.data?.products)
    .slice(0, 6)
    .map(mapProductForCard);

  const displayProducts =
    products.length > 0
      ? products
      : resolveProducts(undefined)
          .filter((p) => p.items?.is_new)
          .slice(0, 6)
          .map(mapProductForCard);

  return (
    <section className='border-border/50 border-y py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <SectionHeader
          eyebrow='Just dropped'
          title='New arrivals'
          description='Fresh finds added weekly — be first to shop limited releases and seasonal colorways.'
          href='/shop?sortBy=newest'
          linkLabel='See all new'
          align='left'
        />

        {isError && !isLoading && (
          <p className='text-muted-foreground -mt-6 mb-6 text-sm'>Showing sample new arrivals.</p>
        )}

        {isLoading ? (
          <ProductGridSkeleton count={6} columns={2} />
        ) : (
          <Carousel
            opts={{
              align: 'start',
              dragFree: true,
              containScroll: 'trimSnaps'
            }}
            className='w-full px-8 sm:px-10'
          >
            <CarouselContent className='pb-1'>
              {displayProducts.map((product, index) => (
                <CarouselItem key={product.id ?? index} className={CAROUSEL_ITEM_CLASS}>
                  <ProductCard product={product} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='bg-background/95 shadow-sm backdrop-blur-sm' />
            <CarouselNext className='bg-background/95 shadow-sm backdrop-blur-sm' />
          </Carousel>
        )}

        <div className='mt-8 text-center lg:hidden'>
          <Link
            href='/shop?sortBy=newest'
            className='text-accent text-sm font-medium underline-offset-4 hover:underline'
          >
            Browse all new arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
