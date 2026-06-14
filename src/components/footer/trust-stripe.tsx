'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useSyncExternalStore } from 'react';

import { trustBadges } from '~/src/components/footer/footer.data';

const itemClassName =
  'group bg-card hover:bg-muted/50 flex items-center gap-4 p-5 transition-colors';

function TrustBadgeContent({ badge }: { badge: (typeof trustBadges)[number] }) {
  return (
    <>
      <div className='bg-accent/10 text-accent flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110'>
        <badge.icon className='size-5' />
      </div>
      <div className='min-w-0'>
        <div className='truncate text-sm font-semibold'>{badge.title}</div>
        <div className='text-muted-foreground truncate text-xs'>{badge.subtitle}</div>
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

  return (
    <div className='border-border/60 bg-border/60 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border md:grid-cols-4'>
      {trustBadges.map((badge, i) =>
        animate ? (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={itemClassName}
          >
            <TrustBadgeContent badge={badge} />
          </motion.div>
        ) : (
          <div key={badge.title} className={itemClassName}>
            <TrustBadgeContent badge={badge} />
          </div>
        )
      )}
    </div>
  );
}
