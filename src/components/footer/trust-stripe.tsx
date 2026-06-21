'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useSyncExternalStore } from 'react';

import { getFooterTrustCopyParams } from '@/lib/i18n/marketing-copy-params';
import { trustBadges } from '~/src/components/footer/footer.data';

const trustBadgeParams = getFooterTrustCopyParams();

const itemClassName =
  'group bg-card hover:bg-muted/50 flex items-center gap-4 p-5 transition-colors';

function TrustBadgeContent({
  badge,
  title,
  subtitle
}: {
  badge: (typeof trustBadges)[number];
  title: string;
  subtitle: string;
}) {
  return (
    <>
      <div className='bg-accent/10 text-accent flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110'>
        <badge.icon className='size-5' />
      </div>
      <div className='min-w-0'>
        <div className='truncate text-sm font-semibold'>{title}</div>
        <div className='text-muted-foreground truncate text-xs'>{subtitle}</div>
      </div>
    </>
  );
}

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function TrustStrip() {
  const reduce = useReducedMotion();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const animate = mounted && !reduce;
  const t = useTranslations('footer.trust');

  return (
    <div className='border-border/60 bg-border/60 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border md:grid-cols-4'>
      {trustBadges.map((badge, i) => {
        const content = (
          <TrustBadgeContent
            badge={badge}
            title={t(`${badge.key}Title`, trustBadgeParams[badge.key])}
            subtitle={t(`${badge.key}Subtitle`, trustBadgeParams[badge.key])}
          />
        );

        return animate ? (
          <motion.div
            key={badge.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={itemClassName}
          >
            {content}
          </motion.div>
        ) : (
          <div key={badge.key} className={itemClassName}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
