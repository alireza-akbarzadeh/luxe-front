'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { DirectionalChevron } from '@/components/ui/directional-icon';
import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { ALTERNATING_FEATURES } from '@/domains/vendor/landing/data/vendor-landing.data';
import { cn } from '@/lib/utils';

export function VendorFeaturesSection() {
  const t = useTranslations('vendor.landing.features');

  return (
    <LandingContainer className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('subtitle')} />
      </FadeInView>

      <div className='space-y-20 md:space-y-28'>
        {ALTERNATING_FEATURES.map((feature, index) => {
          const reversed = index % 2 === 1;
          return (
            <FadeInView key={feature.id}>
              <article
                className={cn(
                  'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
                  reversed && 'lg:[&>*:first-child]:order-2'
                )}
              >
                <FeatureIllustration
                  icon={feature.icon}
                  title={feature.title}
                  variant={index % 3}
                />

                <div>
                  <h3 className='text-2xl font-semibold tracking-tight md:text-3xl'>
                    {feature.title}
                  </h3>
                  <p className='text-muted-foreground mt-3 text-base leading-relaxed'>
                    {feature.description}
                  </p>
                  <ul className='mt-6 grid gap-2 sm:grid-cols-2'>
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className='flex items-center gap-2 text-sm'>
                        <span className='bg-gold size-1.5 shrink-0 rounded-full' aria-hidden />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant='link' className='mt-6 h-auto px-0'>
                    <Link href='/vendor/apply' className='inline-flex items-center gap-1'>
                      {t('exploreFeature', { title: feature.title })}
                      <DirectionalChevron />
                    </Link>
                  </Button>
                </div>
              </article>
            </FadeInView>
          );
        })}
      </div>
    </LandingContainer>
  );
}

function FeatureIllustration({
  icon: Icon,
  title,
  variant
}: {
  icon: (typeof ALTERNATING_FEATURES)[number]['icon'];
  title: string;
  variant: number;
}) {
  return (
    <div
      className='border-border/50 from-muted/40 via-card/60 to-gold/5 relative aspect-[4/3] overflow-hidden rounded-3xl border bg-gradient-to-br shadow-lg'
      aria-hidden
    >
      <div className='absolute inset-0 flex flex-col p-6'>
        <div className='flex items-center gap-3'>
          <div className='bg-gold/15 text-gold flex size-10 items-center justify-center rounded-xl'>
            <Icon className='size-5' />
          </div>
          <div>
            <p className='text-xs font-medium'>{title}</p>
            <p className='text-muted-foreground text-[10px]'>Luxe vendor panel</p>
          </div>
        </div>

        <div className='mt-6 flex-1'>
          {variant === 0 && (
            <div className='grid grid-cols-3 gap-2'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='bg-muted/60 aspect-square rounded-lg' />
              ))}
            </div>
          )}
          {variant === 1 && (
            <div className='space-y-2'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='bg-muted/50 flex h-8 items-center rounded-lg px-3'>
                  <div
                    className='bg-gold/40 h-2 rounded-full'
                    style={{ width: `${70 - i * 12}%` }}
                  />
                </div>
              ))}
            </div>
          )}
          {variant === 2 && (
            <div className='flex h-full items-end gap-2 pb-2'>
              {[45, 70, 55, 90, 65, 100, 80].map((h, i) => (
                <div
                  key={i}
                  className='bg-gold/50 flex-1 rounded-t-md'
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
