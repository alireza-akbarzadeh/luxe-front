import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { TOP_PRODUCTS } from '@/domains/orders/mock_order';
import { ChartCard, type TopProductItem } from '@/domains/orders/sections/order-detail-chart';
import { fmtChartDigit } from '@/lib/format';
import { cn } from '@/lib/utils';

export function TopProductsTable() {
  const typedProducts = TOP_PRODUCTS as TopProductItem[];
  const max = Math.max(...typedProducts.map((p) => p.revenue), 1);

  return (
    <ChartCard title='Top Products by Revenue' subtitle='Based on all-time orders'>
      <div className='space-y-4'>
        {typedProducts.map((p, i) => (
          <div key={p.name} className='space-y-1.5'>
            <div className='flex items-center justify-between'>
              <div className='flex min-w-0 items-center gap-2'>
                <span className='text-muted-foreground w-5 text-[10px] font-black'>#{i + 1}</span>
                <span className='text-foreground truncate text-xs font-semibold'>{p.name}</span>
              </div>
              <div className='ml-2 flex shrink-0 items-center gap-3'>
                <span
                  className={cn(
                    'flex items-center gap-0.5 text-[10px] font-bold',
                    p.trend > 0 ? 'text-emerald-600' : 'text-red-600'
                  )}
                >
                  {p.trend > 0 ? (
                    <IconTrendingUp className='h-3 w-3' />
                  ) : (
                    <IconTrendingDown className='h-3 w-3' />
                  )}
                  {Math.abs(p.trend)}%
                </span>
                <span className='text-foreground text-xs font-bold tabular-nums'>
                  {fmtChartDigit(p.revenue)}
                </span>
              </div>
            </div>
            <div className='bg-muted h-1.5 w-full overflow-hidden rounded-full'>
              <div
                className='bg-primary h-full rounded-full transition-all duration-500'
                style={{
                  width: `${(p.revenue / max) * 100}%`,
                  opacity: 0.7 + 0.3 * ((max - p.revenue) / max)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
