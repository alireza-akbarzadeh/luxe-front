'use client';

import { IconChartDots } from '@tabler/icons-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import { PdpInsightShell } from '@/domains/product/components/pdp-insight-shell';
import { PDP_CHART_SHELL_CLASS } from '@/domains/product/lib/pdp-insight-layout';
import { cn } from '@/lib/utils';
import { useGetProductsIdStockHeatmap } from '@/services/-products-{id}-stock-heatmap-get';
import type { DtoStockHeatmapPoint } from '@/services/-products-{id}-stock-heatmap-get.schemas';

type ProductStockHeatmapProps = {
  productId: string | number;
  enabled?: boolean;
  className?: string;
};

function levelClass(level?: string) {
  switch (level) {
    case 'in_stock':
      return 'bg-emerald-500/80';
    case 'low_stock':
      return 'bg-amber-500/80';
    case 'out_of_stock':
      return 'bg-muted-foreground/30';
    default:
      return 'bg-muted/50';
  }
}

function HeatmapLegend() {
  const t = useTranslations('pdp.stockHeatmap.legend');
  const items = [
    { key: 'in_stock', className: 'bg-emerald-500/80' },
    { key: 'low_stock', className: 'bg-amber-500/80' },
    { key: 'out_of_stock', className: 'bg-muted-foreground/30' }
  ] as const;

  return (
    <Flex direction='row' wrap='wrap' spacing={3} className='text-muted-foreground text-xs'>
      {items.map((item) => (
        <Flex key={item.key} direction='row' align='center' spacing={1.5}>
          <span className={cn('size-2.5 rounded-sm', item.className)} aria-hidden />
          <span>{t(item.key)}</span>
        </Flex>
      ))}
    </Flex>
  );
}

function HeatmapGrid({ points }: { points: DtoStockHeatmapPoint[] }) {
  return (
    <Grid className='grid w-full grid-cols-[repeat(14,minmax(0,1fr))] gap-0.5' aria-hidden>
      {points.map((point) => (
        <span
          key={point.date}
          title={`${point.date ?? ''}: ${point.stock ?? 0}`}
          className={cn('aspect-square min-h-2 rounded-[2px]', levelClass(point.level))}
        />
      ))}
    </Grid>
  );
}

/** Rolling stock availability heatmap for PDP transparency. */
export function ProductStockHeatmap({
  productId,
  enabled = false,
  className
}: ProductStockHeatmapProps) {
  const t = useTranslations('pdp.stockHeatmap');
  const formatter = useFormatter();

  const { data, isLoading } = useGetProductsIdStockHeatmap(
    String(productId),
    { days: 90 },
    { query: { enabled: enabled && Boolean(productId) } }
  );

  const heatmap = data?.data;

  if (!enabled) {
    return (
      <PdpInsightShell
        title={t('title')}
        icon={<IconChartDots className='text-gold-strong size-5' />}
        shellClassName={PDP_CHART_SHELL_CLASS}
        className={className}
      />
    );
  }

  if (isLoading) {
    return (
      <PdpInsightShell
        title={t('title')}
        icon={<IconChartDots className='text-gold-strong size-5' />}
        shellClassName={PDP_CHART_SHELL_CLASS}
        className={className}
      >
        <Skeleton className='min-h-[8rem] rounded-xl' />
      </PdpInsightShell>
    );
  }

  if (!heatmap || heatmap.is_digital || !heatmap.track_inventory) {
    return null;
  }

  const points = heatmap.points ?? [];
  if (points.length === 0) {
    return null;
  }

  return (
    <PdpInsightShell
      title={t('title')}
      icon={<IconChartDots className='text-gold-strong size-5' />}
      shellClassName={PDP_CHART_SHELL_CLASS}
      className={className}
    >
      <Flex direction='column' spacing={4}>
        <Grid cols={3} gap={3}>
          <Flex direction='column' spacing={0.5}>
            <Typography.Muted className='text-xs'>{t('inStockDays')}</Typography.Muted>
            <Typography.Large className='font-semibold'>
              {formatter.number(heatmap.in_stock_days ?? 0)}
            </Typography.Large>
          </Flex>
          <Flex direction='column' spacing={0.5}>
            <Typography.Muted className='text-xs'>{t('lowStockDays')}</Typography.Muted>
            <Typography.Large className='font-semibold'>
              {formatter.number(heatmap.low_stock_days ?? 0)}
            </Typography.Large>
          </Flex>
          <Flex direction='column' spacing={0.5}>
            <Typography.Muted className='text-xs'>{t('outOfStockDays')}</Typography.Muted>
            <Typography.Large className='font-semibold'>
              {formatter.number(heatmap.out_of_stock_days ?? 0)}
            </Typography.Large>
          </Flex>
        </Grid>

        <HeatmapGrid points={points} />
        <HeatmapLegend />
        <Typography.Muted className='text-xs'>{t('footer')}</Typography.Muted>
      </Flex>
    </PdpInsightShell>
  );
}
