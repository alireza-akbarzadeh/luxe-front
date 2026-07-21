'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
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
  /** Stagger delay for stories entrance (ms). */
  animationIndex?: number;
}

function CompactRingBorder() {
  return (
    <span className='pointer-events-none absolute inset-0 rounded-full' aria-hidden>
      <span className='category-ring-border absolute inset-[-2px] rounded-full' />
      <span className='bg-background absolute inset-[2px] rounded-full' />
    </span>
  );
}

export function CategoryCard({
  name,
  description,
  categoryId,
  image,
  shopNowLabel,
  categoryAlt,
  className,
  variant = 'grid',
  animationIndex = 0
}: Readonly<CategoryCardProps>) {
  const href = categoryId ? `/shop?categoryId=${categoryId}` : '/shop';
  const isCompact = variant === 'compact';

  if (isCompact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 28,
          delay: Math.min(animationIndex, 12) * 0.04
        }}
        className={cn('shrink-0', className)}
      >
        <Link
          href={href}
          className='group category-story-item flex w-[5.25rem] shrink-0 flex-col items-center gap-2 sm:w-[5.75rem]'
        >
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className='relative size-[4.75rem] sm:size-20'
          >
            <CompactRingBorder />

            <Flex
              align='center'
              justify='center'
              className='bg-secondary/40 relative size-full overflow-hidden rounded-full ring-2 ring-transparent transition-[box-shadow] duration-300 group-hover:shadow-[0_0_0_2px_var(--background),0_0_18px_-4px_rgb(201_169_110_/_0.55)]'
            >
              <AppImage
                src={image}
                alt=''
                aria-hidden
                fill
                sizes='96px'
                loading='lazy'
                className='object-cover transition-transform duration-500 group-hover:scale-110'
              />
            </Flex>
          </motion.div>

          <Typography.Text
            variant='subtle'
            weight='medium'
            align='center'
            className='text-foreground/90 group-hover:text-foreground line-clamp-2 w-full text-xs leading-tight transition-colors'
          >
            {name ?? categoryAlt}
          </Typography.Text>
        </Link>
      </motion.div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'group relative block aspect-4/5 overflow-hidden rounded-xl shadow-md sm:rounded-2xl',
        className
      )}
    >
      <AppImage
        src={image}
        alt={name ?? categoryAlt}
        fill
        sizes='(max-width: 640px) 45vw, 18vw'
        loading='lazy'
        className='object-cover transition-transform duration-700 group-hover:scale-105'
      />
      <div className='from-foreground/85 via-foreground/25 absolute inset-0 bg-gradient-to-t to-transparent' />
      <div className='absolute right-0 bottom-0 left-0 p-3 sm:p-4'>
        <Typography.H3 className='text-primary-foreground font-display text-base font-semibold sm:text-lg'>
          {name}
        </Typography.H3>
        {description != null && (
          <Typography.Text
            variant='small'
            className='text-primary-foreground/75 mt-0.5 line-clamp-1 text-xs'
          >
            {description}
          </Typography.Text>
        )}
        <Typography.Text
          variant='small'
          weight='medium'
          className='text-primary-foreground mt-2 inline-flex items-center gap-1.5 text-xs'
        >
          {shopNowLabel}
          <span
            className='cn-rtl-flip inline-block h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5'
            aria-hidden
          >
            →
          </span>
        </Typography.Text>
      </div>
    </Link>
  );
}
