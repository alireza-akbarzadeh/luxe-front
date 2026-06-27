'use client';

import { useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Text } from '@/components/ui/typography';
import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/plus/components/plus-landing-primitives';

const TESTIMONIAL_KEYS = ['sara', 'james', 'elena'] as const;

export function PlusTestimonialsSection() {
  const t = useTranslations('plus.landing.testimonials');

  return (
    <LandingContainer className='py-16 md:py-24'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      </FadeInView>

      <Grid cols={1} className='gap-6 md:grid-cols-3'>
        {TESTIMONIAL_KEYS.map((key, index) => (
          <FadeInView key={key} delay={index * 0.06}>
            <Box className='border-border/50 bg-card/50 flex h-full flex-col rounded-3xl border p-6 backdrop-blur-sm'>
              <Flex gap={3} className='mb-5'>
                <MetricPill value={t(`${key}.metricValue`)} label={t(`${key}.metricLabel`)} />
                <MetricPill value={t(`${key}.metric2Value`)} label={t(`${key}.metric2Label`)} />
              </Flex>
              <Text className='flex-1 text-base leading-relaxed'>
                &ldquo;{t(`${key}.quote`)}&rdquo;
              </Text>
              <Flex align='center' gap={3} className='mt-6'>
                <Box
                  className='bg-gold/15 text-gold-strong flex size-10 items-center justify-center rounded-full text-sm font-semibold'
                  aria-hidden
                >
                  {t(`${key}.initials`)}
                </Box>
                <Box>
                  <Text className='text-sm font-medium'>{t(`${key}.name`)}</Text>
                  <Text variant='muted' className='text-xs'>
                    {t(`${key}.role`)}
                  </Text>
                </Box>
              </Flex>
            </Box>
          </FadeInView>
        ))}
      </Grid>
    </LandingContainer>
  );
}

function MetricPill({ value, label }: { value: string; label: string }) {
  return (
    <Box className='border-border/50 bg-muted/30 flex-1 rounded-xl border px-3 py-2 text-center'>
      <Text className='text-gold-strong text-sm font-semibold'>{value}</Text>
      <Text variant='muted' className='text-[10px] tracking-wide uppercase'>
        {label}
      </Text>
    </Box>
  );
}
