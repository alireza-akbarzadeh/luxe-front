'use client';

import { IconGift, IconHeadset, IconRefresh, IconShieldCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';

const TRUST_ITEMS = [
  { key: 'securePayment', icon: IconShieldCheck },
  { key: 'easyReturns', icon: IconRefresh },
  { key: 'support', icon: IconHeadset },
  { key: 'thankYou', icon: IconGift }
] as const;

/** Trust and reassurance row below the order progress timeline. */
export function OrderConfirmedTrustBadges() {
  const t = useTranslations('orderConfirmed.trust');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className='mb-10'
    >
      <Grid gap={4} className='grid-cols-2 lg:grid-cols-4'>
        {TRUST_ITEMS.map(({ key, icon: Icon }, index) => (
          <GridItem key={key}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.06 }}
              className='bg-card border-border/50 h-full rounded-2xl border p-4 text-center sm:p-5'
            >
              <Flex direction='column' align='center' gap={2}>
                <div className='border-accent/30 bg-accent/5 flex size-11 items-center justify-center rounded-full border'>
                  <Icon className='text-accent size-5' aria-hidden />
                </div>
                <Typography.Text weight='semibold' className='text-sm'>
                  {t(`${key}.title`)}
                </Typography.Text>
                <Typography.Subtle className='leading-snug'>
                  {t(`${key}.description`)}
                </Typography.Subtle>
              </Flex>
            </motion.div>
          </GridItem>
        ))}
      </Grid>
    </motion.div>
  );
}
