'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import { useAnimatedCounter } from '../hooks/use-animated-counter';
import { HOME_PLATFORM_STATS } from '../lib/home-mock-data';
import { fullBleedClass, sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';
import { HomeFadeIn } from './ui/home-fade-in';

function formatStatic(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : value.toLocaleString();
}

function AnimatedStat({
  value,
  suffix,
  label,
  decimals = 0
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const display = useAnimatedCounter({
    end: value,
    decimals,
    enabled: inView && !reduceMotion
  });
  const formatted = reduceMotion ? formatStatic(value, decimals) : display;

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
  return (
    <section className={`${fullBleedClass} py-16 sm:py-20 lg:py-28`}>
      <div className={sectionContainerClass}>
        <div className='border-border/50 from-gold/5 via-card/50 to-secondary/30 rounded-[2rem] border bg-gradient-to-b px-6 py-14 sm:px-10 sm:py-16'>
          <HomeFadeIn>
            <SectionHeader
              eyebrow='By the numbers'
              title='A marketplace built for scale and trust'
              description='Real growth metrics that reflect our commitment to quality commerce.'
              className='mb-10 sm:mb-12'
            />
          </HomeFadeIn>

          <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-3'>
            {HOME_PLATFORM_STATS.map((stat, index) => (
              <HomeFadeIn key={stat.label} delay={index * 0.04}>
                <AnimatedStat
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  decimals={'decimals' in stat ? stat.decimals : 0}
                />
              </HomeFadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
