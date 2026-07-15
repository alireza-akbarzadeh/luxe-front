import { IconStarFilled } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import type { VerdictBlock } from '@/domains/weblog/lib/content-blocks';
import { cn } from '@/lib/utils';

interface BlogVerdictProps {
  verdict: VerdictBlock;
  className?: string;
}

/** Quick verdict score card derived from a content block. */
export async function BlogVerdict({ verdict, className }: BlogVerdictProps) {
  const t = await getTranslations('weblog.post');
  const scoreLabel = verdict.score > 0 ? verdict.score.toFixed(1) : '—';
  const stars = Math.round((verdict.score / 10) * 5);

  return (
    <aside
      className={cn(
        'border-accent/25 from-accent/10 to-card rounded-2xl border bg-gradient-to-br p-5 shadow-sm',
        className
      )}
    >
      <Flex align='start' justify='between' gap={4} className='flex-wrap'>
        <Flex direction='column' gap={2} className='min-w-0 flex-1'>
          <Typography.S className='text-accent font-semibold tracking-wide uppercase'>
            {verdict.label || t('verdictTitle')}
          </Typography.S>
          <Typography.P className='text-sm leading-relaxed md:text-base'>
            {verdict.summary}
          </Typography.P>
        </Flex>
        <Flex direction='column' align='end' gap={1} className='shrink-0'>
          <Typography.H2 className='font-display text-3xl tabular-nums'>{scoreLabel}</Typography.H2>
          <Typography.Muted className='text-xs'>/ 10</Typography.Muted>
          <Flex gap={0.5} className='mt-1'>
            {Array.from({ length: 5 }).map((_, index) => (
              <IconStarFilled
                key={index}
                className={cn(
                  'size-3.5',
                  index < stars ? 'text-accent fill-accent' : 'text-muted-foreground/30'
                )}
              />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </aside>
  );
}
