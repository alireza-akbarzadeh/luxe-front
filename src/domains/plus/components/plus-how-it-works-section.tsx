'use client';

import { IconCreditCard, IconShoppingBag, IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Text, Typography } from '@/components/ui/typography';
import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/plus/components/plus-landing-primitives';

const STEPS = [
  { key: 'subscribe', icon: IconCreditCard },
  { key: 'shop', icon: IconShoppingBag },
  { key: 'save', icon: IconSparkles }
] as const;

export function PlusHowItWorksSection() {
  const t = useTranslations('plus.landing.howItWorks');

  return (
    <LandingContainer className='bg-muted/15 py-16 md:py-24'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      </FadeInView>

      <Grid cols={1} className='gap-6 md:grid-cols-3 md:gap-8'>
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <FadeInView key={step.key} delay={index * 0.08}>
              <Box className='border-border/50 bg-card/60 relative h-full rounded-2xl border p-6 backdrop-blur-sm'>
                <Flex
                  align='center'
                  justify='center'
                  className='from-gold/20 to-gold/5 text-gold-strong mb-4 size-12 rounded-xl bg-linear-to-br'
                >
                  <Icon className='size-6' aria-hidden />
                </Flex>
                <Text className='text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase'>
                  {t('stepLabel', { step: index + 1 })}
                </Text>
                <Typography.H5 className='text-lg font-semibold'>
                  {t(`${step.key}.title`)}
                </Typography.H5>
                <Text variant='muted' className='mt-2 text-sm leading-relaxed'>
                  {t(`${step.key}.description`)}
                </Text>
              </Box>
            </FadeInView>
          );
        })}
      </Grid>
    </LandingContainer>
  );
}
