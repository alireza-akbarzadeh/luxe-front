'use client';

import { IconCheck, IconExternalLink, IconMinus } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PricingCard } from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import {
  PRICING_COMPARE_MATRIX,
  PRICING_COMPARE_ROW_IDS,
  PRICING_PLAN_IDS,
  type PricingCompareCell,
  type PricingPlanId
} from '@/domains/vendor/landing/data/vendor-pricing-compare.data';
import { useVendorLandingContent } from '@/domains/vendor/landing/hooks/use-vendor-landing-content';
import { getVendorStartHref } from '@/domains/vendor/lib/vendor-routes';
import { cn } from '@/lib/utils';

interface VendorPricingCompareSheetProps {
  hasVendorStore: boolean;
  className?: string;
}

function CompareCell({
  cell,
  resolveText
}: {
  cell: PricingCompareCell;
  resolveText: (valueKey: string) => string;
}) {
  if (cell.kind === 'check') {
    return (
      <span className='inline-flex size-6 items-center justify-center' aria-label='Included'>
        <IconCheck className='text-gold size-4' stroke={2.5} aria-hidden />
      </span>
    );
  }

  if (cell.kind === 'dash') {
    return (
      <span
        className='text-muted-foreground/50 inline-flex size-6 items-center justify-center'
        aria-hidden
      >
        <IconMinus className='size-4' />
      </span>
    );
  }

  return <span className='text-sm font-medium tabular-nums'>{resolveText(cell.valueKey)}</span>;
}

export function VendorPricingCompareSheet({
  hasVendorStore,
  className
}: VendorPricingCompareSheetProps) {
  const t = useTranslations('vendor.landing.pricing.compare');
  const tPricing = useTranslations('vendor.landing.pricing');
  const { pricingPlans } = useVendorLandingContent();
  const startHref = getVendorStartHref(hasVendorStore);

  const planById = Object.fromEntries(pricingPlans.map((plan) => [plan.id, plan])) as Record<
    PricingPlanId,
    (typeof pricingPlans)[number]
  >;

  const resolveText = (valueKey: string) => t(`values.${valueKey}` as Parameters<typeof t>[0]);

  const planHref = (planId: PricingPlanId) => (planId === 'enterprise' ? '/contact' : startHref);

  return (
    <div
      className={cn(
        'border-border/60 bg-card/30 overflow-hidden rounded-3xl border backdrop-blur-xl',
        className
      )}
    >
      <div className='border-border/50 border-b px-6 py-5 sm:px-8'>
        <h3 className='text-xl font-semibold tracking-tight md:text-2xl'>{t('title')}</h3>
        <p className='text-muted-foreground mt-1 text-sm'>{t('subtitle')}</p>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-[640px] border-collapse text-left'>
          <thead>
            <tr className='border-border/50 border-b'>
              <th className='text-muted-foreground w-[34%] px-6 py-4 text-xs font-medium tracking-wide uppercase sm:px-8'>
                {t('featureColumn')}
              </th>
              {PRICING_PLAN_IDS.map((planId) => {
                const plan = planById[planId];
                const highlighted = planId === 'growth';

                return (
                  <th
                    key={planId}
                    className={cn('px-4 py-4 text-center sm:px-6', highlighted && 'bg-gold/5')}
                  >
                    <div className='flex flex-col items-center gap-1.5'>
                      {highlighted ? (
                        <Badge className='bg-gold text-gold-foreground rounded-full px-2 py-0 text-[10px]'>
                          {tPricing('recommended')}
                        </Badge>
                      ) : (
                        <span className='h-5' aria-hidden />
                      )}
                      <span className='text-sm font-semibold'>{plan?.name}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {PRICING_COMPARE_ROW_IDS.map((rowId) => (
              <tr key={rowId} className='border-border/40 border-b last:border-b-0'>
                <td className='text-muted-foreground px-6 py-3.5 text-sm sm:px-8'>
                  {t(`rows.${rowId}` as Parameters<typeof t>[0])}
                </td>
                {PRICING_PLAN_IDS.map((planId) => (
                  <td
                    key={`${rowId}-${planId}`}
                    className={cn(
                      'px-4 py-3.5 text-center sm:px-6',
                      planId === 'growth' && 'bg-gold/5'
                    )}
                  >
                    <div className='flex justify-center'>
                      <CompareCell
                        cell={PRICING_COMPARE_MATRIX[rowId][planId]}
                        resolveText={resolveText}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className='border-border/50 border-t'>
              <td className='px-6 py-5 sm:px-8' />
              {PRICING_PLAN_IDS.map((planId) => {
                const plan = planById[planId];
                const highlighted = planId === 'growth';

                return (
                  <td
                    key={`cta-${planId}`}
                    className={cn('px-4 py-5 sm:px-6', highlighted && 'bg-gold/5')}
                  >
                    <Button
                      asChild
                      variant={highlighted ? 'default' : 'outline'}
                      className='w-full rounded-full'
                      size='sm'
                    >
                      <Link href={planHref(planId)} className='inline-flex items-center gap-1.5'>
                        {plan?.cta}
                        {planId === 'enterprise' ? (
                          <IconExternalLink className='size-3.5' aria-hidden />
                        ) : null}
                      </Link>
                    </Button>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

interface VendorPricingPlanPanelProps {
  planId: PricingPlanId;
  hasVendorStore: boolean;
}

/** Single-plan detail panel (tab view). */
export function VendorPricingPlanPanel({ planId, hasVendorStore }: VendorPricingPlanPanelProps) {
  const tPricing = useTranslations('vendor.landing.pricing');
  const { pricingPlans } = useVendorLandingContent();
  const plan = pricingPlans.find((p) => p.id === planId);
  const startHref = getVendorStartHref(hasVendorStore);
  const href = planId === 'enterprise' ? '/contact' : startHref;
  const highlighted = planId === 'growth';

  if (!plan) return null;

  return (
    <div
      className={cn(
        'mx-auto max-w-xl rounded-3xl border p-6 md:p-8',
        highlighted
          ? 'border-gold/40 from-gold/10 via-card/80 to-card/40 bg-linear-to-b'
          : 'border-border/50 bg-card/40'
      )}
    >
      {highlighted ? (
        <Badge className='bg-gold text-gold-foreground mb-4 rounded-full px-3'>
          {tPricing('recommended')}
        </Badge>
      ) : null}
      <h3 className='text-2xl font-semibold tracking-tight'>{plan.name}</h3>
      <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{plan.description}</p>
      <div className='mt-6 flex items-end gap-2'>
        <span className='text-4xl font-semibold tracking-tight'>{plan.commission}</span>
        <span className='text-muted-foreground mb-1 text-sm'>{tPricing('commissionLabel')}</span>
      </div>
      <p className='text-muted-foreground mt-1 text-sm'>
        {plan.monthlyFee === 'Custom'
          ? tPricing('customMonthlyFee')
          : tPricing('perMonth', { fee: plan.monthlyFee })}
      </p>
      <ul className='mt-8 space-y-3'>
        {plan.features.map((feature) => (
          <li key={feature} className='flex items-start gap-3 text-sm'>
            <span className='bg-gold/15 text-gold mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full'>
              <IconCheck className='size-3.5' stroke={2.5} aria-hidden />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <Button
        asChild
        variant={highlighted ? 'default' : 'outline'}
        className='mt-8 w-full rounded-full'
        size='lg'
      >
        <Link href={href} className='inline-flex items-center justify-center gap-1.5'>
          {plan.cta}
          {planId === 'enterprise' ? <IconExternalLink className='size-4' aria-hidden /> : null}
        </Link>
      </Button>
    </div>
  );
}

interface VendorPricingTabsProps {
  hasVendorStore: boolean;
}

/** Pricing section with plan cards, per-plan detail tabs, and compare diff sheet. */
export function VendorPricingTabs({ hasVendorStore }: VendorPricingTabsProps) {
  const t = useTranslations('vendor.landing.pricing.compare');
  const tPricing = useTranslations('vendor.landing.pricing');
  const { pricingPlans } = useVendorLandingContent();
  const startHref = getVendorStartHref(hasVendorStore);

  return (
    <Tabs defaultValue='plans' className='w-full'>
      <TabsList className='bg-muted/40 mx-auto mb-10 flex h-auto w-full max-w-2xl flex-wrap justify-center gap-1 rounded-full p-1'>
        <TabsTrigger value='plans' className='rounded-full px-4 py-2 text-sm'>
          {t('tabs.allPlans')}
        </TabsTrigger>
        {PRICING_PLAN_IDS.map((planId) => (
          <TabsTrigger key={planId} value={planId} className='rounded-full px-4 py-2 text-sm'>
            {tPricing(`${planId}.name` as Parameters<typeof tPricing>[0])}
          </TabsTrigger>
        ))}
        <TabsTrigger value='compare' className='rounded-full px-4 py-2 text-sm'>
          {t('tabs.compare')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value='plans'>
        <div className='grid gap-6 lg:grid-cols-3 lg:gap-8'>
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              {...plan}
              href={plan.id === 'enterprise' ? '/contact' : startHref}
            />
          ))}
        </div>
      </TabsContent>

      {PRICING_PLAN_IDS.map((planId) => (
        <TabsContent key={planId} value={planId}>
          <VendorPricingPlanPanel planId={planId} hasVendorStore={hasVendorStore} />
        </TabsContent>
      ))}

      <TabsContent value='compare'>
        <VendorPricingCompareSheet hasVendorStore={hasVendorStore} />
      </TabsContent>
    </Tabs>
  );
}
