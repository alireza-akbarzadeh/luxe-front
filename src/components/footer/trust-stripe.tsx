import { useReducedMotion } from 'framer-motion';
import { motion } from 'framer-motion';

import { trustBadges } from '~/src/components/footer/footer.data';

export function TrustStrip() {
  const reduce = useReducedMotion();
  return (
    <div className='border-border/60 bg-border/60 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border md:grid-cols-4'>
      {trustBadges.map((b, i) => (
        <motion.div
          key={b.title}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className='group bg-card hover:bg-muted/50 flex items-center gap-4 p-5 transition-colors'
        >
          <div className='bg-accent/10 text-accent flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110'>
            <b.icon className='size-5' />
          </div>
          <div className='min-w-0'>
            <div className='truncate text-sm font-semibold'>{b.title}</div>
            <div className='text-muted-foreground truncate text-xs'>{b.subtitle}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
