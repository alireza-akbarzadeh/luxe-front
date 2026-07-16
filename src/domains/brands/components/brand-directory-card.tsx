'use client';

import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import type { BrandDirectoryCardData } from '@/domains/brands/types/brands.types';
import { cn } from '@/lib/utils';

interface BrandDirectoryCardProps {
  brand: BrandDirectoryCardData;
}

/** Grid card for the storefront brands directory. */
export function BrandDirectoryCard({ brand }: BrandDirectoryCardProps) {
  const countLabel =
    brand.productCount === 1
      ? '1 Product'
      : `${brand.productCount.toLocaleString('en-US')} Products`;

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={cn(
        'group border-border/60 bg-card hover:border-foreground/25 block overflow-hidden rounded-2xl border',
        'transition-[border-color,box-shadow] duration-300 hover:shadow-lg'
      )}
    >
      <Flex direction='column' gap={4} className='p-6 sm:p-8'>
        <Flex
          align='center'
          justify='center'
          className='bg-muted/40 border-border/40 h-28 rounded-xl border sm:h-32'
        >
          {brand.logoUrl ? (
            <AppImage
              src={brand.logoUrl}
              alt={brand.name}
              width={120}
              height={64}
              className='max-h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105'
            />
          ) : (
            <Typography.H2 family='display' className='text-3xl font-semibold tracking-tight'>
              {brand.name.charAt(0).toUpperCase()}
            </Typography.H2>
          )}
        </Flex>

        <Flex direction='column' gap={1} className='text-center'>
          <Typography.H3 className='text-base font-semibold tracking-tight'>
            {brand.name}
          </Typography.H3>
          <Typography.Muted className='text-xs'>{countLabel}</Typography.Muted>
        </Flex>
      </Flex>
    </Link>
  );
}
