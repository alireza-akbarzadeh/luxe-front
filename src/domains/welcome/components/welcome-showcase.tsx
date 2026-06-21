'use client';

import { IconDiamond, IconShieldCheck, IconTruck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Text } from '@/components/ui/typography';
import { getHomeMarketingCopyParams } from '@/lib/i18n/marketing-copy-params';

const WELCOME_IMAGE =
  'https://images.unsplash.com/photo-1441984904996-e0b495a6de39?w=1600&h=2000&fit=crop';

const floatTransition = {
  duration: 6,
  repeat: Infinity,
  repeatType: 'reverse' as const,
  ease: 'easeInOut' as const
};

export function WelcomeShowcase() {
  const t = useTranslations('welcome');

  const highlights = [
    { icon: IconDiamond, label: t('highlights.curated') },
    { icon: IconShieldCheck, label: t('highlights.secure') },
    { icon: IconTruck, label: t('highlights.delivery') }
  ];

  return (
    <Box className='relative hidden min-h-svh flex-1 overflow-hidden lg:block'>
      <Image
        src={WELCOME_IMAGE}
        alt=''
        fill
        priority
        className='object-cover object-center'
        sizes='(min-width: 1024px) 50vw, 0px'
      />
      <Box className='absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-black/20' />
      <Box className='from-gold/20 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent' />

      <Flex
        direction='column'
        justify='between'
        className='relative z-10 h-full min-h-svh p-10 xl:p-14'
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <Text variant='overline' tone='inherit' className='text-gold/90'>
            {t('showcase.eyebrow')}
          </Text>
        </motion.div>

        <Flex direction='column' gap={8}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35 }}
          >
            <Text
              variant='h2'
              family='display'
              tone='inherit'
              className='max-w-md text-4xl leading-[1.05] text-white xl:text-5xl'
            >
              {t('showcase.headline')}
            </Text>
            <Text variant='lead' tone='inherit' className='mt-4 max-w-sm text-white/75'>
              {t('showcase.subhead', getHomeMarketingCopyParams().welcome)}
            </Text>
          </motion.div>

          <Grid cols={3} gap={4} className='max-w-lg'>
            {highlights.map(({ icon: Icon, label }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 + index * 0.08 }}
              >
                <Flex
                  direction='column'
                  gap={2}
                  className='border-gold/25 bg-black/25 rounded-2xl border p-4 backdrop-blur-md'
                >
                  <Icon className='text-gold size-5' stroke={1.5} aria-hidden />
                  <Text variant='small' tone='inherit' className='text-white/85'>
                    {label}
                  </Text>
                </Flex>
              </motion.div>
            ))}
          </Grid>
        </Flex>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={floatTransition}
          className='border-gold/30 bg-black/40 absolute end-10 top-1/3 max-w-[220px] rounded-2xl border p-4 backdrop-blur-lg xl:end-14'
        >
          <Text variant='overline' tone='inherit' className='text-gold'>
            {t('showcase.cardEyebrow')}
          </Text>
          <Text variant='small' tone='inherit' className='mt-2 text-white/80'>
            {t('showcase.cardBody')}
          </Text>
        </motion.div>
      </Flex>
    </Box>
  );
}
