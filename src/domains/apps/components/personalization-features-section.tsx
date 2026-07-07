'use client';

import {
  IconArrowsExchange,
  IconBrain,
  IconHomeHeart,
  IconMicrophone,
  IconMoodSmile,
  IconRefresh,
  IconRobot,
  IconTargetArrow
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { PERSONALIZATION_ROUTES } from '@/domains/personalization/lib/personalization-routes';
import { SectionShell } from '@/domains/support/components/section-shell';
import { SectionCarousel } from '~/src/components/section-carousel';
import { PlatformCard } from '~/src/domains/apps/components/platform-card';

/** Entry points for Phase 3 personalization features on the apps hub. */
export function PersonalizationFeaturesSection() {
  const t = useTranslations('platforms.personalization');

  const items = [
    {
      key: 'memory',
      icon: <IconBrain className='size-5' />,
      title: t('memory.title'),
      description: t('memory.description'),
      badge: t('memory.badge'),
      recommended: true,
      actionLabel: t('memory.action'),
      href: PERSONALIZATION_ROUTES.memory
    },
    {
      key: 'goal',
      icon: <IconTargetArrow className='size-5' />,
      title: t('goal.title'),
      description: t('goal.description'),
      badge: t('goal.badge'),
      actionLabel: t('goal.action'),
      href: PERSONALIZATION_ROUTES.goal
    },
    {
      key: 'mood',
      icon: <IconMoodSmile className='size-5' />,
      title: t('mood.title'),
      description: t('mood.description'),
      badge: t('mood.badge'),
      actionLabel: t('mood.action'),
      href: PERSONALIZATION_ROUTES.mood
    },
    {
      key: 'replenishment',
      icon: <IconRefresh className='size-5' />,
      title: t('replenishment.title'),
      description: t('replenishment.description'),
      badge: t('replenishment.badge'),
      actionLabel: t('replenishment.action'),
      href: PERSONALIZATION_ROUTES.replenishment
    },
    {
      key: 'household',
      icon: <IconHomeHeart className='size-5' />,
      title: t('household.title'),
      description: t('household.description'),
      badge: t('household.badge'),
      actionLabel: t('household.action'),
      href: PERSONALIZATION_ROUTES.household
    },
    {
      key: 'voiceShopping',
      icon: <IconMicrophone className='size-5' />,
      title: t('voiceShopping.title'),
      description: t('voiceShopping.description'),
      badge: t('voiceShopping.badge'),
      actionLabel: t('voiceShopping.action'),
      href: PERSONALIZATION_ROUTES.voiceShopping
    },
    {
      key: 'compatibility',
      icon: <IconArrowsExchange className='size-5' />,
      title: t('compatibility.title'),
      description: t('compatibility.description'),
      badge: t('compatibility.badge'),
      actionLabel: t('compatibility.action'),
      href: PERSONALIZATION_ROUTES.compatibility
    },
    {
      key: 'shoppingAgent',
      icon: <IconRobot className='size-5' />,
      title: t('shoppingAgent.title'),
      description: t('shoppingAgent.description'),
      badge: t('shoppingAgent.badge'),
      recommended: true,
      actionLabel: t('shoppingAgent.action'),
      href: PERSONALIZATION_ROUTES.shoppingAgent
    }
  ];

  return (
    <SectionShell className='mt-14'>
      <SectionCarousel
        title={t('title')}
        description={t('subtitle')}
        sectionId='favorite-categories'
        className='border-border/40 border-b py-10 sm:py-12 lg:py-16'
        columns={{ mobile: 2, tablet: 3, desktop: 4 }}
        loop={false}
      >
        {items.map((item) => (
          <PlatformCard
            key={item.key}
            icon={item.icon}
            title={item.title}
            description={item.description}
            badge={item.badge}
            recommended={item.recommended}
            actionLabel={item.actionLabel}
            href={item.href}
          />
        ))}
      </SectionCarousel>
    </SectionShell>
  );
}
