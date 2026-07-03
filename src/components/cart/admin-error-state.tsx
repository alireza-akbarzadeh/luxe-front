'use client';

import { IconAlertCircle, IconArrowLeft, IconQuestionMark, IconRefresh } from '@tabler/icons-react';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type Props = {
  code?: string;
  badge?: string;
  title?: string;
  description?: string;
  primary?: { label: string; onClick?: () => void; href?: string };
  secondary?: { label: string; href: string };
  meta?: { label: string; value: string }[];
  tone?: 'neutral' | 'warn' | 'danger';
};

const toneRing: Record<NonNullable<Props['tone']>, string> = {
  neutral: 'bg-muted text-muted-foreground border-muted-foreground/10',
  warn: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
};

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 110, damping: 18 }
  }
};

const metaRowVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 140, damping: 20 }
  }
};

export function AdminErrorState({
  code = '404',
  badge,
  title,
  description,
  primary,
  secondary,
  meta,
  tone = 'warn'
}: Props) {
  const t = useTranslations('errors.admin.ui');

  const finalBadge = badge ?? t('defaultBadge');
  const finalTitle = title ?? t('defaultTitle');
  const finalDescription = description ?? t('defaultDescription');

  const finalPrimary = primary ?? {
    label: t('returnToDashboard'),
    href: '/dashboard'
  };

  const metaRows = meta ?? [
    {
      label: t('requestPath'),
      value: typeof window !== 'undefined' ? window.location.pathname : '/dashboard/unknown'
    },
    { label: t('activeNode'), value: 'cluster-edge-04' },
    { label: t('environment'), value: 'production' },
    {
      label: t('timestamp'),
      value: new Date().toISOString().replace('T', ' ').slice(0, 19)
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='app-container max-w-5xl py-8 md:py-12'
    >
      <motion.div
        variants={gridVariants}
        initial='hidden'
        animate='visible'
        className='grid gap-6 md:grid-cols-[1.4fr_1fr]'
      >
        <motion.div
          variants={cardVariants}
          className='border-border bg-card relative overflow-hidden rounded-2xl border p-8 shadow-xs md:p-10'
        >
          <motion.div
            aria-hidden
            className='text-foreground pointer-events-none absolute top-0 right-0 translate-x-4 -translate-y-4 opacity-[0.02] dark:opacity-[0.03]'
            animate={{ rotate: [0, 6, -4, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          >
            <IconQuestionMark size={280} />
          </motion.div>

          <motion.span
            variants={cardVariants}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase ${toneRing[tone]}`}
          >
            <motion.span
              className='h-1.5 w-1.5 rounded-full bg-current'
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            {finalBadge}
          </motion.span>

          <div className='mt-8 flex items-baseline gap-4'>
            <motion.span
              className='text-foreground font-mono text-7xl font-black tracking-tighter select-none md:text-8xl'
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 14, delay: 0.15 }}
            >
              {code.split('').map((digit, index) => (
                <motion.span
                  key={`${digit}-${index}`}
                  className='inline-block'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 16,
                    delay: 0.2 + index * 0.07
                  }}
                >
                  {digit}
                </motion.span>
              ))}
            </motion.span>
            <motion.div variants={cardVariants} className='flex flex-col'>
              <span className='text-muted-foreground text-[10px] font-semibold tracking-widest uppercase'>
                {t('httpStatus')}
              </span>
              <span className='text-foreground/60 text-xs font-medium'>
                {t('entityNotDiscovered')}
              </span>
            </motion.div>
          </div>

          <motion.h1
            variants={cardVariants}
            className='text-foreground mt-6 text-2xl font-bold tracking-tight md:text-3xl'
          >
            {finalTitle}
          </motion.h1>
          <motion.p
            variants={cardVariants}
            className='text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed'
          >
            {finalDescription}
          </motion.p>

          <motion.div variants={cardVariants} className='mt-8 flex flex-wrap gap-3'>
            {finalPrimary.href ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={finalPrimary.href}
                  className='bg-foreground text-background inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90'
                >
                  <IconArrowLeft className='size-4' />
                  {finalPrimary.label}
                </Link>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={finalPrimary.onClick}
                className='bg-foreground text-background inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90'
              >
                <IconArrowLeft className='size-4' />
                {finalPrimary.label}
              </motion.button>
            )}

            {secondary ? (
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={secondary.href}
                className='border-border bg-background text-foreground hover:bg-muted inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-semibold transition'
              >
                {secondary.label}
              </motion.a>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.reload()}
                className='border-border bg-background text-foreground hover:bg-muted/60 inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition'
              >
                <IconRefresh className='size-3.5' />
                {t('retryRequest')}
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className='border-border bg-muted/30 flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-xs'
        >
          <div>
            <div className='flex items-center gap-2'>
              <motion.div
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <IconAlertCircle className='text-muted-foreground size-4' />
              </motion.div>
              <h3 className='text-muted-foreground text-xs font-bold tracking-widest uppercase'>
                {t('systemDiagnostics')}
              </h3>
            </div>

            <motion.dl
              variants={gridVariants}
              initial='hidden'
              animate='visible'
              className='divide-border border-border mt-5 divide-y border-y text-sm'
            >
              {metaRows.map((m) => (
                <motion.div
                  key={m.label}
                  variants={metaRowVariants}
                  className='flex items-center justify-between py-3'
                >
                  <dt className='text-muted-foreground text-xs font-medium'>{m.label}</dt>
                  <dd
                    className='text-foreground max-w-45 truncate font-mono text-xs select-all'
                    title={m.value}
                  >
                    {m.value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>

          <motion.div
            variants={cardVariants}
            className='border-border/50 mt-8 flex items-center justify-between border-t pt-4'
          >
            <a
              href='#runbooks'
              className='text-muted-foreground hover:text-foreground text-xs font-semibold underline-offset-4 transition-colors hover:underline'
            >
              {t('consultRunbook')}
            </a>
            <motion.span
              className='bg-muted text-muted-foreground border-border/40 rounded border px-1.5 py-0.5 font-mono text-[10px]'
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              SYS_{code}
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
