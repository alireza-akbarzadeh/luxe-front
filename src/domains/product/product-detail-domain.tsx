'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useGetProductsId } from '~/src/services/-products-{id}-get';
import ProductDescription from './components/product-description';
import { ProductGallery } from './components/product-gallery';
import { ProductInfo } from './components/product-info';
import ProductReviews from './components/product-reviews';
import { ProductSpecifications } from './components/product-specificaitons';
import RelatedProduct from './related-product';

export default function ProductDetailDomain({ productId }: { productId: string }) {
  const { data } = useGetProductsId(productId);

  const product = data?.data?.product;

  if (!product) throw notFound();

  const discount = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - Number(product.price)) / product.compare_at_price) * 100
      )
    : 0;

  return (
    <div className='container mx-auto mt-20 px-4 py-8'>
      {/* Breadcrumb */}
      <nav className='text-muted-foreground flex items-center gap-1.5 text-xs'>
        <Link href='/' className='hover:text-foreground'>
          Home
        </Link>
        <IconChevronRight className='h-3 w-3' />
        <Link href='/' className='hover:text-foreground'>
          Shop
        </Link>
        <IconChevronRight className='h-3 w-3' />
        <span className='hover:text-foreground'>{product.category?.name}</span>
        <IconChevronRight className='h-3 w-3' />
        <span className='text-foreground'>{product.name}</span>
      </nav>

      {/* Main */}
      <div className='mt-6 grid gap-10 lg:grid-cols-2'>
        {/* Gallery */}
        <ProductGallery discount={discount} product={product} />
        {/* Info */}
        <ProductInfo is_liked={data.data?.is_liked || false} product={product} />
      </div>

      {/* Tabs */}
      <div className='mt-20'>
        <Tabs defaultValue='description'>
          <TabsList className='border-border h-auto w-full justify-start gap-2 rounded-none border-b bg-transparent p-0'>
            {[
              ['description', 'Description'],
              ['specs', 'Specifications'],
              ['reviews', `Reviews (${product.reviews_count})`]
            ].map(([v, l]) => (
              <TabsTrigger
                key={v}
                value={v || ''}
                className='data-[state=active]:border-foreground rounded-none border-b-2 border-transparent bg-transparent px-4 pt-2 pb-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              >
                {l}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value='description'
            className='text-muted-foreground mt-8 max-w-3xl space-y-4'
          >
            <ProductDescription description={product.description || ''} />
          </TabsContent>
          <TabsContent value='specs' className='mt-8 max-w-3xl'>
            <ProductSpecifications product={product} />
          </TabsContent>
          <TabsContent value='reviews' className='mt-8 grid gap-10 lg:grid-cols-[280px_1fr]'>
            <ProductReviews productId={productId} product={product} />
          </TabsContent>
        </Tabs>
      </div>
      {/* Related */}
      <RelatedProduct />
    </div>
  );
}
