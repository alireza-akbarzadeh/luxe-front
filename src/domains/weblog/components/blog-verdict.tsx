import { IconStarFilled, IconTrophy } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import type { VerdictBlock } from '@/domains/weblog/lib/content-blocks';
import { cn } from '@/lib/utils';

interface BlogVerdictProps {
  verdict: VerdictBlock;
  className?: string;
  /** `inline` for article body; `final` uses trophy styling. */
  variant?: 'inline' | 'final';
}

/** Quick / final verdict callout card matching the detail mockup. */
export async function BlogVerdict({ verdict, className, variant = 'inline' }: BlogVerdictProps) {
  const t = await getTranslations('weblog.post');
  const scoreLabel = verdict.score > 0 ? verdict.score.toFixed(1) : '—';
  const stars = Math.round((verdict.score / 10) * 5);
  const Icon = variant === 'final' ? IconTrophy : IconStarFilled;

  return (
    <aside
      className={cn(
        'border-accent/20 from-accent/12 via-accent/5 to-card rounded-2xl border bg-gradient-to-br p-5 shadow-sm md:p-6',
        className
      )}
    >
      <Flex direction='row' align='start' justify='between' wrap='wrap' gap={5}>
        <Flex direction='column' gap={2} className='min-w-0 flex-1'>
          <Flex direction='row' align='center' gap={2}>
            <span className='bg-accent/15 text-accent flex size-8 items-center justify-center rounded-full'>
              <Icon className='size-4' />
            </span>
            <Typography.S className='text-accent text-sm font-semibold tracking-wide uppercase'>
              {verdict.label || (variant === 'final' ? t('finalVerdictTitle') : t('verdictTitle'))}
            </Typography.S>
          </Flex>
          <Typography.P className='text-foreground/90 text-sm leading-relaxed md:text-base'>
            {verdict.summary}
          </Typography.P>
        </Flex>
        <Flex direction='column' align='end' gap={1} className='shrink-0'>
          <Flex direction='row' align='baseline' gap={1}>
            <Typography.H2 className='font-display text-4xl tracking-tight tabular-nums'>
              {scoreLabel}
            </Typography.H2>
            <Typography.Muted className='text-sm'>/10</Typography.Muted>
          </Flex>
          <Flex direction='row' gap={0.5} className='mt-0.5'>
            {Array.from({ length: 5 }).map((_, index) => (
              <IconStarFilled
                key={index}
                className={cn(
                  'size-3.5',
                  index < stars ? 'text-accent fill-accent' : 'text-muted-foreground/25'
                )}
              />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </aside>
  );
}
