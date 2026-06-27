'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text, Typography } from '@/components/ui/typography';
import { PlusMembershipBadge } from '@/domains/plus/components/plus-membership-badge';
import {
  usePlusBenefitsQuery,
  usePlusMembershipQuery
} from '@/domains/plus/hooks/use-plus-membership';

/** Account overview card showing Free vs Luxe Plus status and perks. */
export function PlusMembershipPanel() {
  const t = useTranslations('plus.account');
  const { data: benefitsData } = usePlusBenefitsQuery();
  const { data: membershipData, isLoading } = usePlusMembershipQuery();

  const benefits = benefitsData?.data;
  const membership = membershipData?.data;
  const isPlus = membership?.is_plus_active === true;

  return (
    <Box className='border-border from-gold/5 via-card to-card rounded-2xl border bg-linear-to-br p-6'>
      <Flex align='start' justify='between' wrap='wrap' gap={4} className='mb-4'>
        <Box>
          <Typography.H5 className='text-lg font-semibold'>{t('title')}</Typography.H5>
          <Text variant='muted' className='mt-1 text-sm'>
            {isLoading ? t('loading') : isPlus ? t('plusDescription') : t('freeDescription')}
          </Text>
        </Box>
        <PlusMembershipBadge size='md' />
      </Flex>

      {isPlus && membership?.plus_expires_at ? (
        <Text variant='muted' className='mb-4 text-sm'>
          {t('renewsOn', { date: new Date(membership.plus_expires_at).toLocaleDateString() })}
        </Text>
      ) : null}

      {!isPlus && benefits ? (
        <ul className='text-muted-foreground mb-5 space-y-1.5 text-sm'>
          <li>• {t('unlockDiscount', { percent: benefits.discount_percent ?? 0 })}</li>
          <li>• {t('unlockReturns', { days: benefits.return_window_days?.plus ?? 0 })}</li>
          <li>• {t('unlockShipping')}</li>
          <li>• {t('unlockSupport')}</li>
        </ul>
      ) : isPlus && membership?.benefits ? (
        <ul className='text-muted-foreground mb-5 space-y-1.5 text-sm'>
          <li>• {t('activeDiscount', { percent: membership.benefits.discount_percent ?? 0 })}</li>
          <li>• {t('activeReturns', { days: membership.benefits.return_window_days ?? 0 })}</li>
          {membership.benefits.priority_shipping ? <li>• {t('activeShipping')}</li> : null}
          {membership.benefits.priority_support ? <li>• {t('activeSupport')}</li> : null}
        </ul>
      ) : null}

      <Button asChild variant={isPlus ? 'outline' : 'default'} className='rounded-xl'>
        <Link href='/plus/landing'>{isPlus ? t('viewBenefits') : t('upgrade')}</Link>
      </Button>
    </Box>
  );
}
