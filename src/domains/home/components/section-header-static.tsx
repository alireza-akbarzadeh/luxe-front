import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
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
    <Flex
      direction='column'
      gap={4}
      className={cn(
        'luxe-rise mb-10 md:mb-14',
        isCenter ? 'items-center text-center' : 'items-start text-start',
        href && !isCenter && 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <Flex direction='column' gap={3} className={cn('max-w-2xl', isCenter && 'mx-auto')}>
        {eyebrow ? (
          <Badge
            variant='outline'
            className='border-border/60 bg-card/50 w-fit rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase backdrop-blur'
          >
            {eyebrow}
          </Badge>
        ) : null}
        <Typography.H2
          family='display'
          className='text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]'
        >
          {title}
        </Typography.H2>
        {description ? (
          <Typography.Muted className='text-base leading-relaxed sm:text-lg'>
            {description}
          </Typography.Muted>
        ) : null}
      </Flex>

      {href ? (
        <Link
          href={href}
          className='text-foreground hover:text-accent group flex shrink-0 items-center gap-2 text-sm font-medium transition-colors'
        >
          {resolvedLinkLabel}
          <IconArrowRight className='cn-rtl-flip h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
        </Link>
      ) : null}
    </Flex>
  );
}
