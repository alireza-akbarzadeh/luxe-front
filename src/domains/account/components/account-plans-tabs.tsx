'use client';

import { IconCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text, Typography } from '@/components/ui/typography';
import { PlusMembershipPanel } from '@/domains/account/components/plus-membership-panel';
import { PlusPlanCompareTable } from '@/domains/plus/components/plus-plan-compare-table';
import { PlusPricingCard } from '@/domains/plus/components/plus-pricing-card';
import {
  usePlusBenefitsQuery,
  usePlusMembershipQuery
} from '@/domains/plus/hooks/use-plus-membership';
import { cn } from '@/lib/utils';

const USER_PLAN_IDS = ['free', 'plus'] as const;

function AccountFreePlanCard({ isCurrentPlan }: { isCurrentPlan: boolean }) {
  const t = useTranslations('account.plans');
  const tCompare = useTranslations('plus.landing.compare');
  const { data: benefitsData } = usePlusBenefitsQuery();
  const benefits = benefitsData?.data;
  const freeDays = benefits?.return_window_days?.free ?? 30;

  const perks = [
    t('freePerks.checkout'),
    t('freePerks.returns', { days: freeDays }),
    t('freePerks.support'),
    t('freePerks.wishlist')
  ];

  return (
    <Box className='border-border/50 bg-card/40 flex h-full flex-col rounded-3xl border p-6 md:p-8'>
      <Typography.H3 className='text-xl font-semibold'>{tCompare('freePlan')}</Typography.H3>
      <Text variant='muted' className='mt-2 text-sm leading-relaxed'>
        {t('freeDescription')}
      </Text>
      <Flex align='end' gap={2} className='mt-6'>
        <Typography.H2 className='text-4xl font-bold tabular-nums'>$0</Typography.H2>
        <Text variant='muted' className='pb-1.5 text-sm'>
          {t('perYear')}
        </Text>
      </Flex>
      <ul className='mt-8 flex-1 space-y-3'>
        {perks.map((perk) => (
          <li key={perk} className='flex items-start gap-3 text-sm'>
            <span className='bg-muted mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full'>
              <IconCheck className='text-muted-foreground size-3.5' stroke={2.5} aria-hidden />
            </span>
            {perk}
          </li>
        ))}
      </ul>
      {isCurrentPlan ? (
        <Badge variant='outline' className='mt-8 w-fit rounded-full'>
          {t('currentPlanBadge')}
        </Badge>
      ) : null}
    </Box>
  );
}

function AccountPlansSkeleton() {
  return (
    <Box className='space-y-6'>
      <Skeleton className='h-10 w-full max-w-xl rounded-full' />
      <div className='grid gap-6 lg:grid-cols-2'>
        <Skeleton className='h-96 rounded-3xl' />
        <Skeleton className='h-96 rounded-3xl' />
      </div>
    </Box>
  );
}

/** Account Plans tab — membership cards and Free vs Plus compare sheet. */
export function AccountPlansTabs() {
  const t = useTranslations('account.plans');
  const tCompare = useTranslations('plus.landing.compare');
  const { data: benefitsData, isLoading } = usePlusBenefitsQuery();
  const { data: membershipData } = usePlusMembershipQuery();

  const benefits = benefitsData?.data;
  const isPlus = membershipData?.data?.is_plus_active === true;

  if (isLoading || !benefits) {
    return <AccountPlansSkeleton />;
  }

  return (
    <Box className='space-y-6'>
      <Box>
        <Typography.H2 className='text-2xl font-semibold tracking-tight'>
          {t('title')}
        </Typography.H2>
        <Text variant='muted' className='mt-1 text-sm'>
          {t('description')}
        </Text>
      </Box>

      <PlusMembershipPanel />

      <Tabs defaultValue='all' className='w-full'>
        <TabsList className='bg-muted/40 flex h-auto w-full max-w-xl flex-wrap justify-start gap-1 rounded-full p-1'>
          <TabsTrigger value='all' className='rounded-full px-4 py-2 text-sm'>
            {t('tabs.allPlans')}
          </TabsTrigger>
          {USER_PLAN_IDS.map((planId) => (
            <TabsTrigger key={planId} value={planId} className='rounded-full px-4 py-2 text-sm'>
              {planId === 'free' ? tCompare('freePlan') : tCompare('plusPlan')}
            </TabsTrigger>
          ))}
          <TabsTrigger value='compare' className='rounded-full px-4 py-2 text-sm'>
            {t('tabs.compare')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='all' className='mt-8'>
          <div className='grid gap-6 lg:grid-cols-2'>
            <AccountFreePlanCard isCurrentPlan={!isPlus} />
            <PlusPricingCard benefits={benefits} />
          </div>
        </TabsContent>

        <TabsContent value='free' className='mt-8'>
          <div className='mx-auto max-w-xl'>
            <AccountFreePlanCard isCurrentPlan={!isPlus} />
          </div>
        </TabsContent>

        <TabsContent value='plus' className='mt-8'>
          <div className='mx-auto max-w-xl'>
            <PlusPricingCard benefits={benefits} />
          </div>
        </TabsContent>

        <TabsContent value='compare' className='mt-8'>
          <Box>
            <Typography.H3 className='mb-1 text-lg font-semibold'>
              {tCompare('title')}
            </Typography.H3>
            <Text variant='muted' className='mb-6 text-sm'>
              {tCompare('description')}
            </Text>
            <PlusPlanCompareTable benefits={benefits} />
            {isPlus ? (
              <Text variant='muted' className={cn('mt-4 text-center text-xs')}>
                {t('plusActiveNote')}
              </Text>
            ) : null}
          </Box>
        </TabsContent>
      </Tabs>
    </Box>
  );
}
