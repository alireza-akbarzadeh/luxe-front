import { Card } from '@/components/ui/card';

interface AnalyticalStatsProperties {
  totalItems: number;
  totalSavings: number;
  priceDropsCount: number;
}

export function AnalyticalStats(properties: Readonly<AnalyticalStatsProperties>) {
  const { priceDropsCount, totalItems, totalSavings } = properties;
  return (
    <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3'>
      <Card className='p-4'>
        <p className='text-2xl font-bold'>{totalItems}</p>
        <p className='text-muted-foreground text-sm'>Saved Items</p>
      </Card>

      <Card className='p-4'>
        <p className='text-2xl font-bold'>${totalSavings.toFixed(2)}</p>
        <p className='text-muted-foreground text-sm'>Potential Savings</p>
      </Card>

      <Card className='p-4'>
        <p className='text-2xl font-bold'>{priceDropsCount}</p>
        <p className='text-muted-foreground text-sm'>Price Drops</p>
      </Card>
    </div>
  );
}
