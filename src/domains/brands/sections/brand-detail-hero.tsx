'use client';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { VerifiedBadge } from '@/domains/store/components/verified-badge';
import { cn } from '@/lib/utils';
import type { DtoBrandResponse } from '@/services/-brands-get.schemas';

interface BrandDetailHeroProps {
  brand: DtoBrandResponse;
  productCount: number;
}

/** Dark brand spotlight header matching the brand details mock. */
export function BrandDetailHero({ brand, productCount }: BrandDetailHeroProps) {
  const name = brand.name ?? 'Brand';
  const countLabel = productCount.toLocaleString('en-US');

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[1.75rem] bg-zinc-950 text-white',
        'border-border/40 border'
      )}
    >
      <Grid cols={1} className='lg:grid-cols-[auto_1fr_minmax(0,18rem)]'>
        <Flex align='center' justify='center' className='bg-white p-8 sm:p-10 lg:min-w-52'>
          {brand.logo_url ? (
            <AppImage
              src={brand.logo_url}
              alt={`${name} logo`}
              width={160}
              height={96}
              priority
              className='max-h-20 w-auto object-contain'
            />
          ) : (
            <Typography.H1 family='display' className='text-5xl font-semibold text-zinc-900'>
              {name.charAt(0).toUpperCase()}
            </Typography.H1>
          )}
        </Flex>

        <Flex direction='column' gap={4} className='relative z-10 p-8 sm:p-10'>
          <Flex direction='row' align='center' gap={2}>
            <Typography.H1
              family='display'
              className='text-3xl font-semibold tracking-tight sm:text-4xl'
            >
              {name}
            </Typography.H1>
            <VerifiedBadge size='md' />
          </Flex>

          {brand.meta_title ? (
            <Typography.Small className='text-gold font-medium tracking-wide uppercase'>
              {brand.meta_title}
            </Typography.Small>
          ) : null}

          <Typography.Muted className='max-w-xl text-sm leading-relaxed text-white/70'>
            {brand.description?.trim() ||
              `Explore ${name} on Luxe — curated pieces from a premium catalog brand.`}
          </Typography.Muted>

          <Flex direction='row' gap={6} wrap='wrap' className='pt-2 text-xs text-white/55'>
            <span>
              Products: <span className='font-medium text-white/90'>{countLabel}</span>
            </span>
            {brand.is_featured ? (
              <span>
                Status: <span className='font-medium text-white/90'>Featured</span>
              </span>
            ) : null}
            {brand.workflow_state?.name ? (
              <span>
                Collection:{' '}
                <span className='font-medium text-white/90'>{brand.workflow_state.name}</span>
              </span>
            ) : null}
          </Flex>
        </Flex>

        <div className='relative hidden min-h-64 lg:block'>
          <AppImage
            src='https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80'
            alt=''
            fill
            sizes='25vw'
            className='object-cover'
            aria-hidden
          />
          <div className='absolute inset-0 bg-linear-to-l from-transparent via-zinc-950/20 to-zinc-950' />
        </div>
      </Grid>
    </section>
  );
}
