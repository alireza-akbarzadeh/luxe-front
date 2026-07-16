'use client';

import { IconPackage, IconRotateClockwise2, IconShieldCheck, IconTruck } from '@tabler/icons-react';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';

const TRUST_ITEMS = [
  { icon: IconPackage, title: '200+ Brands', body: 'Curated maisons and labels' },
  { icon: IconShieldCheck, title: '100% Authentic', body: 'Verified sellers only' },
  { icon: IconTruck, title: 'Fast Delivery', body: 'Tracked shipping worldwide' },
  { icon: IconRotateClockwise2, title: 'Easy Returns', body: 'Hassle-free exchanges' }
] as const;

/** Dark CTA when a shopper cannot find their brand. */
export function BrandRequestCta() {
  return (
    <section className='relative overflow-hidden rounded-[1.75rem] bg-zinc-950 text-white'>
      <Grid cols={1} className='lg:grid-cols-[1.2fr_1fr]'>
        <Flex direction='column' gap={5} className='relative z-10 p-8 sm:p-10 lg:p-12'>
          <Typography.H2
            family='display'
            className='text-3xl font-semibold tracking-tight sm:text-4xl'
          >
            Can&apos;t find your favorite brand?
          </Typography.H2>
          <Typography.Muted className='max-w-md text-sm leading-relaxed text-white/65'>
            Tell us which label you want on Luxe. We review every request and prioritize the most
            sought-after houses.
          </Typography.Muted>
          <Button asChild className='w-fit rounded-full bg-white text-zinc-950 hover:bg-white/90'>
            <Link href='/support'>Request a Brand</Link>
          </Button>
        </Flex>

        <div className='relative hidden min-h-56 lg:block'>
          <AppImage
            src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'
            alt=''
            fill
            sizes='40vw'
            className='object-cover'
            aria-hidden
          />
          <div className='absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/40 to-transparent' />
        </div>
      </Grid>
    </section>
  );
}

/** Trust row under the brands directory. */
export function BrandsTrustStripe() {
  return (
    <Grid cols={2} gap={6} className='border-border/50 border-t py-10 md:grid-cols-4'>
      {TRUST_ITEMS.map(({ icon: Icon, title, body }) => (
        <Flex key={title} direction='column' gap={2} align='center' className='text-center'>
          <Icon className='text-foreground h-6 w-6' aria-hidden />
          <Typography.Small className='font-semibold'>{title}</Typography.Small>
          <Typography.Muted className='text-xs'>{body}</Typography.Muted>
        </Flex>
      ))}
    </Grid>
  );
}
