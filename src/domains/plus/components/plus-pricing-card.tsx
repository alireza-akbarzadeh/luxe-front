'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text, Typography } from '@/components/ui/typography';
import { PlusMembershipBadge } from '@/domains/plus/components/plus-membership-badge';
import {
  usePlusMembershipQuery,
  useSubscribeToPlusMutation
} from '@/domains/plus/hooks/use-plus-membership';
import { cn } from '@/lib/utils';
import type { DtoPlusBenefitsResponse } from '@/services/-plus-benefits-get.schemas';

type PlusPricingCardProps = {
  benefits: DtoPlusBenefitsResponse;
  className?: string;
};

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

/** Primary CTA card for subscribing to Luxe Plus. */
export function PlusPricingCard({ benefits, className }: PlusPricingCardProps) {
  const t = useTranslations('plus.pricing');
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: membershipData, isLoading: membershipLoading } = usePlusMembershipQuery();
  const subscribe = useSubscribeToPlusMutation();

  const isPlus = membershipData?.data?.is_plus_active === true;
  const expiresAt = membershipData?.data?.plus_expires_at;

  const onSubscribe = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/plus/landing');
      return;
    }

    try {
      const result = await subscribe.mutateAsync();
      toast.success(result.message ?? t('success'));
    } catch {
      toast.error(t('error'));
    }
  };

  return (
    <Box
      className={cn(
        'border-gold/40 from-gold/15 via-card to-card relative overflow-hidden rounded-3xl border bg-linear-to-br p-6 shadow-xl sm:p-8',
        className
      )}
    >
      <Box
        aria-hidden
        className='bg-gold/20 pointer-events-none absolute -top-24 -right-16 size-56 rounded-full blur-3xl'
      />

      <Flex direction='column' gap={6} className='relative'>
        <Flex align='center' justify='between' wrap='wrap' gap={3}>
          <Box>
            <Typography.H3 family='display' className='text-2xl sm:text-3xl'>
              {benefits.plan_name}
            </Typography.H3>
            <Text variant='muted' className='mt-1 text-sm'>
              {t('subtitle')}
            </Text>
          </Box>
          <PlusMembershipBadge size='md' />
        </Flex>

        <Flex align='end' gap={2}>
          <Typography.H2 className='text-4xl font-bold tabular-nums sm:text-5xl'>
            {formatPrice(benefits.annual_price ?? 0, benefits.currency ?? 'USD')}
          </Typography.H2>
          <Text variant='muted' className='pb-1.5 text-sm'>
            {t('perYear')}
          </Text>
        </Flex>

        <ul className='text-muted-foreground space-y-2 text-sm'>
          <li>• {t('perkDiscount', { percent: benefits.discount_percent ?? 0 })}</li>
          <li>• {t('perkReturns', { days: benefits.return_window_days?.plus ?? 0 })}</li>
          <li>• {t('perkShipping')}</li>
          <li>• {t('perkSupport')}</li>
        </ul>

        {isPlus ? (
          <Box className='rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4'>
            <Text className='text-sm text-emerald-800 dark:text-emerald-300'>
              {expiresAt
                ? t('activeUntil', { date: new Date(expiresAt).toLocaleDateString() })
                : t('active')}
            </Text>
            <Button asChild variant='outline' className='mt-3 w-full rounded-xl'>
              <Link href='/account'>{t('manageAccount')}</Link>
            </Button>
          </Box>
        ) : (
          <Button
            size='lg'
            className='from-gold via-gold-strong to-gold w-full rounded-xl bg-linear-to-r text-amber-950 hover:opacity-95'
            onClick={onSubscribe}
            disabled={subscribe.isPending || membershipLoading}
          >
            {subscribe.isPending
              ? t('processing')
              : isAuthenticated
                ? t('subscribe')
                : t('signInToSubscribe')}
          </Button>
        )}

        <Text variant='muted' className='text-center text-xs'>
          {t('walletNote')}
        </Text>
      </Flex>
    </Box>
  );
}
