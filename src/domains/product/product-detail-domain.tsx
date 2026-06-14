'use client';

import { IconChevronRight } from '@tabler/icons-react';
import { notFound } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DynamicBreadcrumb } from '~/src/components/breadcrumb-list';
import { useGetProductsId } from '~/src/services/-products-{id}-get';

import ProductDescription from './components/product-description';
import { ProductDetailSkeleton } from './components/product-detail-skeleton';
import { ProductGallery } from './components/product-gallery';
import { ProductInfo } from './components/product-info';
import ProductReviews from './components/product-reviews';
import { ProductSpecifications } from './components/product-specification';
import { ProductVideoPlayer } from './components/product-video-player';
import RelatedProduct from './related-product';

export default function ProductDetailDomain({ productId }: { productId: string }) {
  const { data, isPending, isError } = useGetProductsId(productId);

  if (isPending) {
    return <ProductDetailSkeleton />;
  }

  const product = data?.data?.product;

  if (isError || !product) {
    notFound();
  }

  const discount = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - Number(product.price)) / product.compare_at_price) * 100
      )
    : 0;

  const tabs = [
    { value: 'description', label: 'Description' },
    { value: 'video', label: 'Video' },
    { value: 'specs', label: 'Specifications' },
    { value: 'reviews', label: `Reviews (${product.reviews_count ?? 0})` }
  ] as const;

  return (
    <div className='app-container mt-20 pb-16'>
      <DynamicBreadcrumb
        items={[
          { label: 'Shop', href: '/shop' },
          { label: product.category?.name || 'Category' },
          { label: product.name || 'Product' }
        ]}
        direction='column'
        separator={<IconChevronRight className='h-3 w-3' />}
        className='text-muted-foreground text-xs'
        breadcrumbClassName='flex items-center gap-1.5'
      />

      <div className='mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12 xl:gap-16'>
        <ProductGallery discount={discount} product={product} />
        <ProductInfo is_liked={data.data?.is_liked || false} product={product} />
      </div>

      <section className='mt-20 lg:mt-24'>
        <Tabs defaultValue='description' className='w-full'>
          <TabsList className='border-border h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b bg-transparent p-0'>
            {tabs.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className='data-[state=active]:border-accent data-[state=active]:text-foreground text-muted-foreground rounded-none border-b-2 border-transparent bg-transparent px-4 pt-2 pb-3 text-sm font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='description' className='mt-10 max-w-3xl'>
            <h2 className='font-display mb-4 text-2xl font-semibold'>About this piece</h2>
            <ProductDescription description={product.description || ''} />
          </TabsContent>

          <TabsContent value='video' className='mt-10 max-w-3xl'>
            <h2 className='font-display mb-4 text-2xl font-semibold'>Product video</h2>
            <p className='text-muted-foreground mb-6 text-sm leading-relaxed'>
              Watch how this piece looks, moves, and fits — a closer look before you add it to your
              cart.
            </p>
            <ProductVideoPlayer product={product} className='max-w-2xl' />
          </TabsContent>

          <TabsContent value='specs' className='mt-10 max-w-3xl'>
            <h2 className='font-display mb-4 text-2xl font-semibold'>Specifications</h2>
            <div className='border-border/60 bg-card rounded-2xl border p-6'>
              <ProductSpecifications product={product} />
            </div>
          </TabsContent>

          <TabsContent value='reviews' className='mt-10 grid gap-10 lg:grid-cols-[280px_1fr]'>
            <ProductReviews productId={productId} product={product} />
          </TabsContent>
        </Tabs>
      </section>

      <RelatedProduct />
    </div>
  );
}
