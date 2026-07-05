'use client';

import { IconSparkles } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { PERSONALIZATION_ROUTES } from '@/domains/personalization/lib/personalization-routes';
import { cn } from '@/lib/utils';

type PersonalizationJourneyPromoProps = {
  className?: string;
  /** Emphasize goal/mood for empty carts; memory for wishlist. */
  variant?: 'default' | 'empty-cart' | 'wishlist';
};

/** Compact cross-sell strip — surfaces personalization pages outside /apps. */
export function PersonalizationJourneyPromo({
  className,
  variant = 'default'
}: PersonalizationJourneyPromoProps) {
  const t = useTranslations('personalizationDiscovery.promo');

  const links =
    variant === 'empty-cart'
      ? [
          { href: PERSONALIZATION_ROUTES.goal, label: t('goal') },
          { href: PERSONALIZATION_ROUTES.mood, label: t('mood') }
        ]
      : variant === 'wishlist'
        ? [
            { href: PERSONALIZATION_ROUTES.memory, label: t('memory') },
            { href: PERSONALIZATION_ROUTES.goal, label: t('goal') }
          ]
        : [
            { href: PERSONALIZATION_ROUTES.goal, label: t('goal') },
            { href: PERSONALIZATION_ROUTES.mood, label: t('mood') },
            { href: PERSONALIZATION_ROUTES.memory, label: t('memory') }
          ];

  return (
    <Flex
      direction='column'
      spacing={3}
      className={cn(
        'border-border/60 bg-muted/20 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6',
        className
      )}
    >
      <Flex direction='column' spacing={1} className='min-w-0'>
        <Flex align='center' spacing={2}>
          <IconSparkles className='text-gold-strong size-4 shrink-0' aria-hidden />
          <Typography.Text className='text-sm font-semibold'>{t('title')}</Typography.Text>
        </Flex>
        <Typography.Muted className='text-sm leading-relaxed'>{t('description')}</Typography.Muted>
      </Flex>
      <Flex className='flex-wrap gap-2 sm:shrink-0'>
        {links.map((link) => (
          <Button key={link.href} asChild variant='secondary' size='sm' className='rounded-full'>
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </Flex>
    </Flex>
  );
}
