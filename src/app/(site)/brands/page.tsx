import type { Metadata } from 'next';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getBrands } from '@/services/-brands-get';

export const metadata: Metadata = buildPageMetadata({
  title: 'Brands',
  description: 'Discover the independent brands and maisons featured on Luxe.',
  path: '/brands'
});

export default async function BrandsPage() {
  const response = await getBrands({ limit: 60 });
  const brands = response.data?.brands ?? [];

  return (
    <main className='app-container py-12 sm:py-16 lg:py-20'>
      <Flex direction='column' gap={10}>
        <Flex direction='column' gap={3} className='max-w-3xl'>
          <Typography.Overline className='text-gold'>Brands</Typography.Overline>
          <Typography.H1
            family='display'
            className='text-4xl font-semibold tracking-tight sm:text-5xl'
          >
            Independent maisons, curated in one place
          </Typography.H1>
          <Typography.Lead>
            Explore the labels behind Luxe — premium craftsmanship, considered design, and enduring
            pieces.
          </Typography.Lead>
        </Flex>

        <Grid autoFit='lg' gap={5}>
          {brands.map((brand) => {
            const slug = brand.slug?.trim();
            if (!slug) return null;

            return (
              <Link
                key={brand.id ?? slug}
                href={`/brands/${slug}`}
                className='luxury-glass luxury-card group block overflow-hidden rounded-[1.75rem] p-6'
              >
                <Flex direction='column' gap={5} fullHeight>
                  <Flex
                    align='center'
                    justify='center'
                    className='bg-background/80 border-border/50 h-24 rounded-2xl border'
                  >
                    {brand.logo_url ? (
                      <AppImage
                        src={brand.logo_url}
                        alt={brand.name ?? 'Brand logo'}
                        width={112}
                        height={112}
                        className='h-16 w-16 object-contain'
                      />
                    ) : (
                      <Typography.H2 family='display' className='text-2xl font-semibold'>
                        {brand.name?.charAt(0)?.toUpperCase() ?? '—'}
                      </Typography.H2>
                    )}
                  </Flex>

                  <Flex direction='column' gap={2} grow>
                    <Typography.H3 family='display' className='text-xl font-semibold'>
                      {brand.name ?? 'Brand'}
                    </Typography.H3>
                    <Typography.Muted className='line-clamp-3 text-sm leading-relaxed'>
                      {brand.description ?? 'Explore this brand on Luxe.'}
                    </Typography.Muted>
                  </Flex>

                  <Typography.Small className='text-gold font-medium'>View brand</Typography.Small>
                </Flex>
              </Link>
            );
          })}
        </Grid>
      </Flex>
    </main>
  );
}
