'use client';

import { IconArrowRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export type CategoryCardVariant = 'grid' | 'compact';

export interface CategoryCardProps {
  name?: string;
  description?: string;
  categoryId?: number;
  image: string;
  shopNowLabel: string;
  categoryAlt: string;
  className?: string;
  variant?: CategoryCardVariant;
}

export function CategoryCard({
  name,
  description,
  categoryId,
  image,
  shopNowLabel,
  categoryAlt,
  className,
  variant = 'grid'
}: Readonly<CategoryCardProps>) {
  const href = categoryId ? `/shop?categoryId=${categoryId}` : '/shop';
  const isCompact = variant === 'compact';

  if (isCompact) {
    return (
      <Link
        href={href}
        className={cn(
          'group flex w-[5.5rem] shrink-0 flex-col items-center gap-2.5 sm:w-28',
          className
        )}
      >
        <Flex
          align='center'
          justify='center'
          className='border-border/60 bg-secondary/40 relative size-[4.5rem] overflow-hidden rounded-full border shadow-sm transition-transform duration-300 group-hover:scale-105 sm:size-20'
        >
          <Image src={image} alt={name ?? categoryAlt} fill sizes='80px' className='object-cover' />
        </Flex>
        <Typography.Text
          variant='subtle'
          weight='medium'
          align='center'
          className='text-foreground line-clamp-2 w-full leading-snug'
        >
          {name ?? categoryAlt}
        </Typography.Text>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'group relative block aspect-3/4 overflow-hidden rounded-2xl shadow-md sm:rounded-3xl',
        className
      )}
    >
      <Image
        src={image}
        alt={name ?? categoryAlt}
        fill
        sizes='(max-width: 640px) 75vw, 25vw'
        className='object-cover transition-transform duration-700 group-hover:scale-105'
      />
      <div className='from-foreground/85 via-foreground/25 absolute inset-0 bg-gradient-to-t to-transparent' />
      <div className='absolute right-0 bottom-0 left-0 p-5 sm:p-6'>
        <Typography.H3 className='text-primary-foreground font-display text-xl font-semibold sm:text-2xl'>
          {name}
        </Typography.H3>
        {description != null && (
          <Typography.Text variant='small' className='text-primary-foreground/75 mt-1 line-clamp-2'>
            {description}
          </Typography.Text>
        )}
        <span className='text-primary-foreground mt-4 inline-flex items-center gap-2 text-sm font-medium'>
          {shopNowLabel}
          <IconArrowRight className='cn-rtl-flip h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
        </span>
      </div>
    </Link>
  );
}
