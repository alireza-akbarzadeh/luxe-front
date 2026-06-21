'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import { formatLocaleDecimal, formatLocaleNumber } from '@/lib/i18n/format-number';

import { useAnimatedCounter } from '../hooks/use-animated-counter';
import { useHomeContent } from '../hooks/use-home-content';
import { fullBleedClass, sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';
import { HomeFadeIn } from './ui/home-fade-in';

function formatStatic(value: number, decimals: number, locale: ReturnType<typeof useHomeContent>['locale']) {
  if (decimals > 0) {
    return formatLocaleDecimal(value, locale, decimals);
  }
  return formatLocaleNumber(Math.round(value), locale);
}

function AnimatedStat({
  value,
  suffix,
  label,
  decimals = 0,
  locale
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
  locale: ReturnType<typeof useHomeContent>['locale'];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const display = useAnimatedCounter({
    end: value,
    decimals,
    enabled: inView && !reduceMotion,
    locale
  });
  const formatted = reduceMotion ? formatStatic(value, decimals, locale) : display;

  return (
    <div ref={ref} className='text-center'>
      <p className='font-display text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl'>
        {formatted}
        {suffix}
      </p>
      <p className='text-muted-foreground mt-2 text-sm'>{label}</p>
    </div>
  );
}

export function StatsSection() {
  const { platformStats, locale, t } = useHomeContent();

  return (
    <section className={`${fullBleedClass} py-16 sm:py-20 lg:py-28`}>
      <div className={sectionContainerClass}>
        <div className='border-border/50 from-gold/5 via-card/50 to-secondary/30 rounded-[2rem] border bg-gradient-to-b px-6 py-14 sm:px-10 sm:py-16'>
          <HomeFadeIn>
            <SectionHeader
              eyebrow={t('statsSection.eyebrow')}
              title={t('statsSection.title')}
              description={t('statsSection.description')}
              className='mb-10 sm:mb-12'
            />
          </HomeFadeIn>

          <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-3'>
            {platformStats.map((stat, index) => (
              <HomeFadeIn key={stat.label} delay={index * 0.04}>
                <AnimatedStat
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  decimals={stat.decimals}
                  locale={locale}
                />
              </HomeFadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
