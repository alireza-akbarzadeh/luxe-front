'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

type StateProps = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  primary: { label: string; onClick?: () => void; href?: string };
  secondary?: { label: string; href: string };
  accent?: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 18 }
  }
};

const codeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.82, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 90, damping: 14, delay: 0.05 }
  }
};

const recoveryLinks = [
  { label: 'New arrivals', href: '/shop?sortBy=newest&showOnlyNew=true' },
  { label: 'Best sellers', href: '/store?rating=4.5' },
  { label: 'Contact support', href: '/help' }
];

export function SiteErrorState({
  code,
  eyebrow,
  title,
  description,
  primary,
  secondary,
  accent = 'from-orange-200/40 via-rose-200/30 to-amber-100/40'
}: StateProps) {
  return (
    <section className='relative mx-auto w-full max-w-3xl overflow-hidden py-16'>
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 -top-10 -z-10 mx-auto h-64 w-[90%] rounded-[3rem] bg-linear-to-br ${accent} opacity-70 blur-3xl`}
        animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.75, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className='bg-primary/20 pointer-events-none absolute -top-8 -left-10 -z-10 h-40 w-40 rounded-full blur-3xl'
        animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className='bg-rose-300/30 pointer-events-none absolute -right-6 bottom-10 -z-10 h-32 w-32 rounded-full blur-2xl'
        animate={{ x: [0, -14, 0], y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='border-border/60 bg-card/80 rounded-3xl border p-8 shadow-sm backdrop-blur md:p-14'
      >
        <motion.p
          variants={itemVariants}
          className='text-muted-foreground text-xs font-semibold tracking-[0.25em] uppercase'
        >
          {eyebrow}
        </motion.p>

        <div className='mt-6 flex flex-col gap-3'>
          <motion.h1
            variants={codeVariants}
            className='text-foreground font-serif text-[clamp(3.5rem,12vw,7rem)] leading-none font-light tracking-tight'
          >
            {code.split('').map((digit, index) => (
              <motion.span
                key={`${digit}-${index}`}
                className='inline-block'
                initial={{ opacity: 0, y: 30, rotate: -8 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 16,
                  delay: 0.2 + index * 0.08
                }}
              >
                {digit}
              </motion.span>
            ))}
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className='text-foreground text-xl font-semibold tracking-tight md:text-2xl'
          >
            {title}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className='text-muted-foreground max-w-lg text-sm leading-relaxed md:text-base'
          >
            {description}
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className='mt-8 flex flex-wrap gap-3'>
          {primary.href ? (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={primary.href}
                className='bg-foreground text-background inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition hover:opacity-90'
              >
                {primary.label}
              </Link>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={primary.onClick}
              className='bg-foreground text-background inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition hover:opacity-90'
            >
              {primary.label}
            </motion.button>
          )}

          {secondary && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={secondary.href}
                className='border-border bg-background text-foreground hover:bg-muted inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-medium transition'
              >
                {secondary.label}
              </Link>
            </motion.div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className='mt-10 border-t pt-6'>
          <p className='text-muted-foreground mb-3 text-xs tracking-widest uppercase'>
            Quick recovery
          </p>

          <div className='grid gap-2 sm:grid-cols-3'>
            {recoveryLinks.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + index * 0.08, type: 'spring', stiffness: 140 }}
              >
                <Link
                  href={item.href}
                  className='group hover:bg-muted flex items-center justify-between rounded-xl px-3 py-2 text-sm transition'
                >
                  <span>{item.label}</span>
                  <motion.span
                    className='opacity-0 group-hover:opacity-100'
                    initial={false}
                    whileHover={{ x: 4 }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
