'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = 'View all',
  align = 'center',
  className
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={cn(
        'mb-10 flex flex-col gap-4 md:mb-14',
        isCenter ? 'items-center text-center' : 'items-start text-left',
        href && !isCenter && 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn('max-w-2xl', isCenter && 'mx-auto')}>
        {eyebrow && (
          <span className='text-accent mb-3 inline-block text-xs font-semibold tracking-[0.2em] uppercase'>
            {eyebrow}
          </span>
        )}
        <h2 className='font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]'>
          {title}
        </h2>
        {description && (
          <p className='text-muted-foreground mt-3 text-base leading-relaxed sm:text-lg'>
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className='text-foreground hover:text-accent group flex-start shrink-0 gap-2 text-sm font-medium transition-colors'
        >
          {linkLabel}
          <IconArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
        </Link>
      )}
    </motion.div>
  );
}
