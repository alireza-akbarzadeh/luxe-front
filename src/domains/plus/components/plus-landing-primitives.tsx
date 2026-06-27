'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { useClientMounted } from '@/hooks/use-client-mounted';
import { cn } from '@/lib/utils';

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** Scroll-triggered fade-in with reduced-motion support. */
export function FadeInView({ children, className, delay = 0 }: FadeInViewProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useClientMounted();

  if (!mounted) {
    return <Box className={className}>{children}</Box>;
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'center',
  className
}: SectionTitleProps) {
  return (
    <Box className={cn('mb-10 md:mb-14', align === 'center' && 'text-center', className)}>
      {eyebrow ? (
        <Badge
          variant='outline'
          className='border-gold/30 bg-gold/5 text-gold-strong mb-4 rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.16em] uppercase'
        >
          {eyebrow}
        </Badge>
      ) : null}
      <h2 className='font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl lg:text-[2.75rem]'>
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed md:text-lg',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      ) : null}
    </Box>
  );
}

export function LandingContainer({
  children,
  className,
  id
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </section>
  );
}
