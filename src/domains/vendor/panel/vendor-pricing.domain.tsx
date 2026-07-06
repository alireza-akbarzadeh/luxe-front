'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { VendorAiPricingAssistantPanel } from '@/domains/vendor/panel/components/ui/vendor-ai-pricing-assistant-panel';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { getVendorModuleConfig } from '@/domains/vendor/panel/data/vendor-module-registry';
import { useVendorAiPricingAssistantQuery } from '@/domains/vendor/panel/hooks/use-vendor-ai-pricing-assistant';
import { cn } from '@/lib/utils';

const PERIOD_DAYS = 30;

const ACTION_STYLES: Record<string, string> = {
  increase: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  decrease: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  hold: 'bg-muted text-muted-foreground'
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function VendorPricingDomain() {
  const t = useTranslations('vendor.panel.pricingAssistant');
  const config = getVendorModuleConfig('discounts');
  const { data, isLoading } = useVendorAiPricingAssistantQuery(PERIOD_DAYS);

  const assistant = data?.data;
  const suggestions = assistant?.suggestions ?? [];

  const increaseCount = suggestions.filter((s) => s.action === 'increase').length;
  const decreaseCount = suggestions.filter((s) => s.action === 'decrease').length;
  const holdCount = suggestions.filter((s) => s.action === 'hold').length;

  return (
    <div className='space-y-8'>
      <VendorModuleHeader
        title={config?.title ?? 'Discounts & Promotions'}
        description='AI pricing assistant plus promotion tools for your catalog.'
      />

      <VendorAiPricingAssistantPanel days={PERIOD_DAYS} />

      <section className='grid gap-4 sm:grid-cols-3'>
        <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-sm font-medium'>{t('increase')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-semibold tabular-nums'>{isLoading ? '—' : increaseCount}</p>
          </CardContent>
        </Card>
        <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-sm font-medium'>{t('decrease')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-semibold tabular-nums'>{isLoading ? '—' : decreaseCount}</p>
          </CardContent>
        </Card>
        <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-sm font-medium'>{t('hold')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-semibold tabular-nums'>{isLoading ? '—' : holdCount}</p>
          </CardContent>
        </Card>
      </section>

      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
        <CardHeader>
          <CardTitle>{t('suggestionsTable')}</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 && !isLoading ? (
            <p className='text-muted-foreground text-sm'>{t('empty')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('product')}</TableHead>
                  <TableHead className='text-right'>{t('current')}</TableHead>
                  <TableHead className='text-right'>{t('suggested')}</TableHead>
                  <TableHead>{t('action')}</TableHead>
                  <TableHead className='text-right'>{t('units')}</TableHead>
                  <TableHead>{t('rationale')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((row) => (
                  <TableRow key={row.product_id ?? row.name}>
                    <TableCell className='max-w-40 truncate font-medium'>{row.name}</TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {formatCurrency(row.current_price ?? 0)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {row.suggested_price != null ? formatCurrency(row.suggested_price) : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={cn('rounded-full capitalize', ACTION_STYLES[row.action ?? 'hold'])}
                      >
                        {row.action ?? 'hold'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>{row.units_sold ?? 0}</TableCell>
                    <TableCell className='text-muted-foreground max-w-xs text-sm'>{row.rationale}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
