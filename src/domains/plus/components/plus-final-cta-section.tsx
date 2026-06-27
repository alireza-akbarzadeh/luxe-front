'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Button, buttonVariants } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text, Typography } from '@/components/ui/typography';
import { FadeInView, LandingContainer } from '@/domains/plus/components/plus-landing-primitives';
import { cn } from '@/lib/utils';

export function PlusFinalCtaSection() {
  const t = useTranslations('plus.landing.finalCta');

  return (
    <LandingContainer className='pb-20 md:pb-28'>
      <FadeInView>
        <Box className='border-gold/30 from-gold/15 via-card to-card relative overflow-hidden rounded-3xl border bg-linear-to-br px-6 py-12 text-center shadow-xl sm:px-12 sm:py-16'>
          <Box
            aria-hidden
            className='bg-gold/20 pointer-events-none absolute -top-20 left-1/2 size-64 -translate-x-1/2 rounded-full blur-3xl'
          />
          <Typography.H2 family='display' className='relative text-3xl sm:text-4xl'>
            {t('title')}
          </Typography.H2>
          <Text variant='muted' className='relative mx-auto mt-4 max-w-xl text-lg leading-relaxed'>
            {t('description')}
          </Text>
          <Flex wrap='wrap' align='center' justify='center' gap={3} className='relative mt-8'>
            <Link
              href='#subscribe'
              className={cn(buttonVariants({ size: 'lg' }), 'rounded-full px-8')}
            >
              {t('ctaPrimary')}
            </Link>
            <Button variant='outline' size='lg' className='rounded-full px-6' asChild>
              <Link href='#faq'>{t('ctaSecondary')}</Link>
            </Button>
          </Flex>
        </Box>
      </FadeInView>
    </LandingContainer>
  );
}
