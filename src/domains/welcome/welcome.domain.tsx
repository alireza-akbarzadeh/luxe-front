'use client';

import { IconArrowRight, IconSparkles, IconUserPlus } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { continueAsGuestAction } from '@/actions/welcome.actions';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';

import { WelcomeShowcase } from './components/welcome-showcase';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const }
  })
};

export function WelcomeDomain() {
  const t = useTranslations('welcome');
  const router = useRouter();
  const [isGuestPending, startGuestTransition] = useTransition();

  const onContinueAsGuest = () => {
    startGuestTransition(async () => {
      const { redirectTo } = await continueAsGuestAction();
      router.push(redirectTo);
      router.refresh();
    });
  };

  return (
    <Box className='bg-background relative min-h-svh overflow-hidden'>
      <Box
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05]'
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--gold) 1px, transparent 1px), linear-gradient(to bottom, var(--gold) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 20% 20%, black, transparent)'
        }}
      />

      <Flex justify='end' className='absolute end-4 top-4 z-20 sm:end-6 sm:top-6'>
        <LanguageSwitcher />
      </Flex>

      <Flex className='min-h-svh'>
        <Flex
          direction='column'
          justify='center'
          className='relative z-10 w-full px-6 py-16 sm:px-10 lg:w-[min(520px,46%)] lg:px-12 xl:px-16'
        >
          <motion.div custom={0.05} initial='hidden' animate='show' variants={fadeUp}>
            <Link href='/' className='inline-block'>
              <Text
                variant='h4'
                family='display'
                className='from-gold-strong via-gold to-gold-strong bg-linear-to-r bg-clip-text text-transparent'
              >
                LUXE
              </Text>
            </Link>
          </motion.div>

          <motion.div custom={0.12} initial='hidden' animate='show' variants={fadeUp}>
            <Flex align='center' gap={2} className='border-gold/25 bg-card/70 mt-8 inline-flex rounded-full border px-3 py-1.5 backdrop-blur-sm'>
              <IconSparkles className='text-gold size-4' aria-hidden />
              <Text variant='small'>{t('badge')}</Text>
            </Flex>
          </motion.div>

          <motion.div custom={0.18} initial='hidden' animate='show' variants={fadeUp}>
            <Text variant='h1' family='display' balance className='mt-6 max-w-lg'>
              {t('title')}
            </Text>
          </motion.div>

          <motion.div custom={0.24} initial='hidden' animate='show' variants={fadeUp}>
            <Text variant='lead' className='mt-4 max-w-md'>
              {t('subtitle')}
            </Text>
          </motion.div>

          <motion.div custom={0.32} initial='hidden' animate='show' variants={fadeUp}>
            <Flex direction='column' gap={3} className='mt-10 w-full max-w-md'>
              <Button asChild variant='brand' size='lg' className='h-12 w-full'>
                <Link href='/register'>
                  <IconUserPlus aria-hidden />
                  {t('signUp')}
                  <IconArrowRight aria-hidden className='ms-auto' />
                </Link>
              </Button>

              <Button asChild variant='outline-brand' size='lg' className='h-12 w-full'>
                <Link href='/login'>{t('signIn')}</Link>
              </Button>

              <Button
                type='button'
                variant='ghost'
                size='lg'
                className='text-muted-foreground hover:text-foreground h-11 w-full'
                loading={isGuestPending}
                onClick={onContinueAsGuest}
              >
                {t('continueAsGuest')}
              </Button>
            </Flex>
          </motion.div>

          <motion.div custom={0.4} initial='hidden' animate='show' variants={fadeUp}>
            <Text variant='muted' className='mt-8 max-w-md'>
              {t('guestNote')}
            </Text>
          </motion.div>
        </Flex>

        <WelcomeShowcase />
      </Flex>
    </Box>
  );
}
