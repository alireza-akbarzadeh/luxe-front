'use client';
import { IconChevronRight } from '@tabler/icons-react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { useClientMounted } from '@/hooks/use-client-mounted';
import { cn } from '@/lib/utils';
interface Crumb {
  name: string;
  href?: string;
}
interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  className?: string;
}
export function SupportPageHero({
  eyebrow = 'Help & Support',
  title,
  description,
  breadcrumbs,
  className
}: PageHeroProps) {
  const reduce = useReducedMotion();
  const mounted = useClientMounted();

  const motionInitial = reduce ? false : { opacity: 0, y: 8 };
  const titleInitial = reduce ? false : { opacity: 0, y: 12 };

  const eyebrowContent = (
    <div className='border-border/60 bg-background/60 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase backdrop-blur'>
      <span className='bg-accent h-1.5 w-1.5 animate-pulse rounded-full' />
      {eyebrow}
    </div>
  );

  const titleContent = (
    <h1 className='mt-6 text-4xl font-semibold tracking-tight md:text-6xl'>{title}</h1>
  );

  const descriptionContent = description ? (
    <p className='text-muted-foreground mx-auto mt-5 max-w-2xl text-base leading-relaxed md:text-lg'>
      {description}
    </p>
  ) : null;

  return (
    <section
      className={cn(
        'border-border/60 from-muted/40 via-background to-background relative overflow-hidden border-b bg-gradient-to-b',
        className
      )}
    >
      {/* Decorative orbs */}
      <div
        aria-hidden
        className='bg-accent/10 pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full blur-3xl'
      />
      <div
        aria-hidden
        className='via-accent/40 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent'
      />
      <div className='app-container relative py-20 text-center md:py-28'>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label='Breadcrumb' className='mb-6 flex justify-center'>
            <ol className='text-muted-foreground flex flex-wrap items-center justify-center gap-1.5 text-xs'>
              {breadcrumbs.map((c, i) => (
                <li key={c.name} className='inline-flex items-center gap-1.5'>
                  {c.href ? (
                    <Link href={c.href} className='hover:text-foreground transition-colors'>
                      {c.name}
                    </Link>
                  ) : (
                    <span className='text-foreground'>{c.name}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <IconChevronRight className='size-3 opacity-60' />}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {mounted ? (
          <motion.div
            initial={motionInitial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {eyebrowContent}
          </motion.div>
        ) : (
          eyebrowContent
        )}
        {mounted ? (
          <motion.div
            initial={titleInitial}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {titleContent}
          </motion.div>
        ) : (
          titleContent
        )}
        {descriptionContent &&
          (mounted ? (
            <motion.div
              initial={titleInitial}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {descriptionContent}
            </motion.div>
          ) : (
            descriptionContent
          ))}
      </div>
    </section>
  );
}
