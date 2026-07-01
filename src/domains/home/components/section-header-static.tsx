import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { cn } from '@/lib/utils';

interface SectionHeaderStaticProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: 'left' | 'center';
  className?: string;
}

/** Server-safe section header — no framer-motion (use for RSC marketing sections). */
export async function SectionHeaderStatic({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  align = 'center',
  className
}: SectionHeaderStaticProps) {
  const t = await getTranslations('home');
  const resolvedLinkLabel = linkLabel ?? t('common.viewAll');
  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        'luxe-rise mb-10 flex flex-col gap-4 md:mb-14',
        isCenter ? 'items-center text-center' : 'items-start text-start',
        href && !isCenter && 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn('max-w-2xl', isCenter && 'mx-auto')}>
        {eyebrow ? (
          <span className='text-accent mb-3 inline-block text-xs font-semibold tracking-[0.2em] uppercase'>
            {eyebrow}
          </span>
        ) : null}
        <h2 className='font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]'>
          {title}
        </h2>
        {description ? (
          <p className='text-muted-foreground mt-3 text-base leading-relaxed sm:text-lg'>
            {description}
          </p>
        ) : null}
      </div>

      {href ? (
        <Link
          href={href}
          className='text-foreground hover:text-accent group flex shrink-0 items-center gap-2 text-sm font-medium transition-colors'
        >
          {resolvedLinkLabel}
          <IconArrowRight className='cn-rtl-flip h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
        </Link>
      ) : null}
    </div>
  );
}
