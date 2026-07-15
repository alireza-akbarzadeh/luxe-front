import { getTranslations } from 'next-intl/server';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import type { VerdictBlock } from '@/domains/weblog/lib/content-blocks';
import { cn } from '@/lib/utils';

interface BlogReviewSummaryProps {
  verdict: VerdictBlock;
  className?: string;
}

/** Circular overall score card for the article sidebar. */
export async function BlogReviewSummary({ verdict, className }: BlogReviewSummaryProps) {
  const t = await getTranslations('weblog.post');
  const score = Math.max(0, Math.min(10, verdict.score));
  const scoreLabel = score > 0 ? score.toFixed(1) : '—';
  const pct = (score / 10) * 100;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;

  return (
    <aside className={cn('bg-card rounded-2xl border p-5 shadow-sm', className)}>
      <Typography.H3 className='font-display mb-4 text-lg'>{t('reviewSummaryTitle')}</Typography.H3>
      <Flex align='center' gap={4}>
        <div className='relative size-[7.5rem] shrink-0'>
          <svg viewBox='0 0 120 120' className='size-full -rotate-90' aria-hidden>
            <circle
              cx='60'
              cy='60'
              r={radius}
              fill='none'
              className='stroke-muted'
              strokeWidth='10'
            />
            <circle
              cx='60'
              cy='60'
              r={radius}
              fill='none'
              className='stroke-accent'
              strokeWidth='10'
              strokeLinecap='round'
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <Flex
            direction='column'
            align='center'
            justify='center'
            className='absolute inset-0 text-center'
          >
            <Typography.H2 className='font-display text-2xl leading-none tabular-nums'>
              {scoreLabel}
            </Typography.H2>
            <Typography.Muted className='mt-1 text-[10px] font-semibold tracking-wider uppercase'>
              {t('outOfTen')}
            </Typography.Muted>
          </Flex>
        </div>
        <Flex direction='column' gap={1.5} className='min-w-0 flex-1'>
          <Typography.S className='line-clamp-4 text-sm leading-snug'>
            {verdict.summary}
          </Typography.S>
          {verdict.label ? (
            <Typography.Muted className='text-xs font-medium'>{verdict.label}</Typography.Muted>
          ) : null}
        </Flex>
      </Flex>
    </aside>
  );
}
