import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { ProductCard } from '@/domains/shop/components/product-card';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getBrands } from '@/services/-brands-get';
import type { DtoBrandResponse } from '@/services/-brands-get.schemas';
import { getProducts } from '@/services/-products-get';
import { GetProductsSort, GetProductsStatus } from '@/services/-products-get.schemas';

type BrandDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function getBrandBySlug(slug: string): Promise<DtoBrandResponse | null> {
  const response = await getBrands({ limit: 100, search: slug });
  const brands = response.data?.brands ?? [];

  return brands.find((brand) => brand.slug === slug) ?? null;
}

export async function generateMetadata({ params }: BrandDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand?.name) {
    return { title: 'Brand Not Found' };
  }

  return buildPageMetadata({
    title: brand.name,
    description:
      brand.description?.replace(/\s+/g, ' ').trim().slice(0, 160) ??
      `Explore ${brand.name} on Luxe.`,
    path: `/brands/${slug}`,
    image: brand.logo_url
  });
}

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand?.id || !brand.slug) {
    notFound();
  }

  const productsResponse = await getProducts({
    brand_id: brand.id,
    limit: 12,
    offset: 0,
    status: GetProductsStatus.active,
    sort: GetProductsSort.newest
  });
  const products = productsResponse.data?.products ?? [];

  return (
    <main className='app-container py-12 sm:py-16 lg:py-20'>
      <Flex direction='column' gap={12}>
        <Link href='/brands' className='text-gold text-sm font-medium'>
          ← Back to brands
        </Link>

        <Grid
          cols={1}
          gap={8}
          className='items-center lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-12'
        >
          <Flex
            align='center'
            justify='center'
            className='luxury-glass min-h-72 rounded-[2rem] p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.7)]'
          >
            {brand.logo_url ? (
              <AppImage
                src={brand.logo_url}
                alt={brand.name ?? 'Brand logo'}
                width={240}
                height={240}
                className='max-h-40 w-auto object-contain'
              />
            ) : (
              <Typography.H1 family='display' className='text-6xl font-semibold'>
                {brand.name?.charAt(0)?.toUpperCase() ?? '—'}
              </Typography.H1>
            )}
          </Flex>

          <Flex direction='column' gap={5} className='max-w-3xl'>
            <Typography.Overline className='text-gold'>Brand spotlight</Typography.Overline>
            <Typography.H1
              family='display'
              className='text-4xl font-semibold tracking-tight sm:text-5xl'
            >
              {brand.name}
            </Typography.H1>
            <Typography.Lead>
              {brand.description ??
                'A featured Luxe brand with a curated point of view and a premium standard of craftsmanship.'}
            </Typography.Lead>

            <Flex direction='row' gap={3} wrap='wrap'>
              <Link
                href='#brand-products'
                className='bg-gold text-gold-foreground inline-flex h-11 items-center rounded-full px-6 text-sm font-medium'
              >
                Shop products
              </Link>
              <Link
                href='/brands'
                className='border-border/60 bg-card/70 inline-flex h-11 items-center rounded-full border px-6 text-sm font-medium'
              >
                Explore more brands
              </Link>
            </Flex>
          </Flex>
        </Grid>

        <Flex id='brand-products' direction='column' gap={6}>
          <Flex direction='column' gap={2}>
            <Typography.H2
              family='display'
              className='text-3xl font-semibold tracking-tight sm:text-4xl'
            >
              Latest from {brand.name}
            </Typography.H2>
            <Typography.Muted className='text-base'>
              Fresh arrivals and signature pieces currently available on Luxe.
            </Typography.Muted>
          </Flex>

          {products.length > 0 ? (
            <Grid cols={1} gap={5} className='sm:grid-cols-2 xl:grid-cols-4'>
              {products.map((product, index) => (
                <ProductCard
                  key={product.id ?? product.slug ?? index}
                  product={product}
                  index={index}
                  priority={index < 2}
                />
              ))}
            </Grid>
          ) : (
            <div className='luxury-glass rounded-[1.75rem] p-8'>
              <Typography.H3 family='display' className='text-xl font-semibold'>
                Products coming soon
              </Typography.H3>
              <Typography.Muted className='mt-2 text-sm leading-relaxed'>
                We do not have live products for this brand yet, but the brand page is now available
                and ready.
              </Typography.Muted>
            </div>
          )}
        </Flex>
      </Flex>
    </main>
  );
}
