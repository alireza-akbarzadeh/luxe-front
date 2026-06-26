'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnimatedCounter } from '@/domains/vendor/landing/hooks/use-animated-counter';
import { cn } from '@/lib/utils';

function formatStatic(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : value.toLocaleString();
}

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'none';
}

/** Fade/slide children into view on scroll with reduced-motion support. */
export function FadeInView({ children, className, delay = 0, direction = 'up' }: FadeInViewProps) {
  const reduceMotion = useReducedMotion();
  const offset = direction === 'up' ? 28 : direction === 'down' ? -28 : 0;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
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
    <div className={cn('mb-12 md:mb-16', align === 'center' && 'text-center', className)}>
      {eyebrow ? (
        <Badge
          variant='outline'
          className='border-border/60 bg-card/50 mb-4 rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase backdrop-blur'
        >
          {eyebrow}
        </Badge>
      ) : null}
      <h2 className='text-3xl font-semibold tracking-tight text-balance md:text-4xl lg:text-5xl'>
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
    </div>
  );
}

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
  className?: string;
}

export function AnimatedStat({
  value,
  suffix = '',
  label,
  decimals = 0,
  className
}: AnimatedStatProps) {
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
    <div ref={ref} className={cn('text-center', className)}>
      <p className='text-3xl font-semibold tracking-tight tabular-nums md:text-4xl lg:text-5xl'>
        {formatted}
        {suffix}
      </p>
      <p className='text-muted-foreground mt-2 text-sm'>{label}</p>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets?: readonly string[];
  className?: string;
}

export function FeatureCard({ icon, title, description, bullets, className }: FeatureCardProps) {
  return (
    <Card
      className={cn(
        'border-border/50 bg-card/40 group hover:border-border h-full rounded-2xl backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5',
        className
      )}
    >
      <CardHeader className='pb-2'>
        <div className='bg-gold/10 text-gold group-hover:bg-gold/15 mb-4 flex size-11 items-center justify-center rounded-xl transition-colors'>
          {icon}
        </div>
        <CardTitle className='text-lg'>{title}</CardTitle>
        <CardDescription className='text-sm leading-relaxed'>{description}</CardDescription>
      </CardHeader>
      {bullets && bullets.length > 0 ? (
        <CardContent className='pt-0'>
          <ul className='text-muted-foreground flex flex-wrap gap-2 text-xs'>
            {bullets.map((item) => (
              <li
                key={item}
                className='border-border/60 bg-muted/40 rounded-full border px-2.5 py-1'
              >
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      ) : null}
    </Card>
  );
}

interface PricingCardProps {
  name: string;
  description: string;
  commission: string;
  monthlyFee: string;
  features: readonly string[];
  cta: string;
  highlighted?: boolean;
  href: string;
}

export function PricingCard({
  name,
  description,
  commission,
  monthlyFee,
  features,
  cta,
  highlighted = false,
  href
}: PricingCardProps) {
  const t = useTranslations('vendor.landing.pricing');

  return (
    <Card
      className={cn(
        'relative flex h-full flex-col rounded-3xl border p-1',
        highlighted
          ? 'border-gold/40 from-gold/10 via-card/80 to-card/40 shadow-gold/10 bg-gradient-to-b shadow-xl'
          : 'border-border/50 bg-card/40'
      )}
    >
      {highlighted ? (
        <Badge className='bg-gold text-gold-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3'>
          {t('recommended')}
        </Badge>
      ) : null}
      <CardHeader className='p-6 pb-4'>
        <CardTitle className='text-xl'>{name}</CardTitle>
        <CardDescription className='text-sm'>{description}</CardDescription>
        <div className='mt-6 flex items-end gap-2'>
          <span className='text-4xl font-semibold tracking-tight'>{commission}</span>
          <span className='text-muted-foreground mb-1 text-sm'>{t('commissionLabel')}</span>
        </div>
        <p className='text-muted-foreground mt-1 text-sm'>
          {monthlyFee === 'Custom' ? t('customMonthlyFee') : t('perMonth', { fee: monthlyFee })}
        </p>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col p-6 pt-0'>
        <ul className='text-muted-foreground mb-8 flex-1 space-y-2.5 text-sm'>
          {features.map((feature) => (
            <li key={feature} className='flex items-start gap-2'>
              <span className='bg-gold mt-1.5 size-1.5 shrink-0 rounded-full' aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          asChild
          variant={highlighted ? 'default' : 'outline'}
          className='w-full rounded-full'
          size='lg'
        >
          <Link href={href}>{cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

interface TestimonialCardProps {
  name: string;
  business: string;
  avatar: string;
  quote: string;
  metrics: readonly { label: string; value: string }[];
}

export function TestimonialCard({ name, business, avatar, quote, metrics }: TestimonialCardProps) {
  return (
    <Card className='border-border/50 bg-card/50 h-full rounded-3xl backdrop-blur'>
      <CardContent className='flex h-full flex-col p-7'>
        <div className='mb-6 flex gap-3'>
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className='border-border/50 bg-muted/30 flex-1 rounded-2xl border px-3 py-2 text-center'
            >
              <p className='text-gold text-sm font-semibold'>{metric.value}</p>
              <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>
                {metric.label}
              </p>
            </div>
          ))}
        </div>
        <blockquote className='text-foreground flex-1 text-base leading-relaxed'>
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className='mt-6 flex items-center gap-3'>
          <div
            className='bg-gold/15 text-gold flex size-11 items-center justify-center rounded-full text-sm font-semibold'
            aria-hidden
          >
            {avatar}
          </div>
          <div>
            <p className='text-sm font-medium'>{name}</p>
            <p className='text-muted-foreground text-xs'>{business}</p>
          </div>
        </div>
      </CardContent>
    </Card>
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
