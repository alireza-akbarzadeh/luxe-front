'use client';
import type { Icon as TablerIcon } from '@tabler/icons-react';
import { IconArrowRight } from '@tabler/icons-react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface InfoCardProps {
  icon: TablerIcon;
  title: string;
  description: string;
  href?: string;
  cta?: string;
  index?: number;
  className?: string;
}
export function InfoCard({
  icon: Icon,
  title,
  description,
  href,
  cta = 'Learn more',
  index = 0,
  className
}: InfoCardProps) {
  const reduce = useReducedMotion();
  const Body = (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        'group border-border/60 bg-card/50 hover:border-accent/40 hover:bg-card relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 backdrop-blur transition-all',
        className
      )}
    >
      <div
        aria-hidden
        className='bg-accent/10 pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100'
      />
      <div className='bg-accent/10 text-accent relative flex size-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110'>
        <Icon className='size-6' />
      </div>
      <h3 className='relative mt-5 text-lg font-semibold tracking-tight'>{title}</h3>
      <p className='text-muted-foreground relative mt-2 flex-1 text-sm leading-relaxed'>
        {description}
      </p>
      {href && (
        <div className='text-accent relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium'>
          {cta}
          <IconArrowRight className='size-4 transition-transform group-hover:translate-x-1' />
        </div>
      )}
    </motion.div>
  );
  if (href) {
    return (
      <Link href={href} className='block h-full'>
        {Body}
      </Link>
    );
  }
  return Body;
}
