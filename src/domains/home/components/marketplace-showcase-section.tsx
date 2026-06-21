'use client';

import { IconStar } from '@tabler/icons-react';

import { useHomeContent } from '../hooks/use-home-content';
import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';
import { HomeFadeIn } from './ui/home-fade-in';

export function MarketplaceShowcaseSection() {
  const { marketplaceBenefits, marketplaceTiles, marketingCopy, t } = useHomeContent();

  return (
    <section id='marketplace' className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <HomeFadeIn>
          <SectionHeader
            eyebrow={t('marketplace.eyebrow')}
            title={t('marketplace.title')}
            description={t('marketplace.description')}
          />
        </HomeFadeIn>

        <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
          <HomeFadeIn delay={0.05}>
            <div className='border-border/50 from-gold/8 via-card/80 to-card/40 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 shadow-lg sm:p-10'>
              <div
                aria-hidden
                className='pointer-events-none absolute inset-0 opacity-[0.04]'
                style={{
                  backgroundImage:
                    'linear-gradient(to right, var(--gold) 1px, transparent 1px), linear-gradient(to bottom, var(--gold) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              />
              <div className='relative space-y-6'>
                <div>
                  <p className='text-muted-foreground text-xs font-medium tracking-widest uppercase'>
                    {t('marketplace.liveLabel')}
                  </p>
                  <p className='font-display mt-2 text-4xl font-semibold tracking-tight'>
                    {t('marketplace.productCount', marketingCopy.marketplace)}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {t('marketplace.productSubtext', marketingCopy.marketplace)}
                  </p>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  {marketplaceTiles.map((label) => (
                    <div
                      key={label}
                      className='border-border/40 bg-background/60 rounded-2xl border px-4 py-3 text-sm font-medium backdrop-blur'
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div className='border-border/40 bg-background/70 flex items-center gap-3 rounded-2xl border p-4 backdrop-blur'>
                  <div className='bg-gold/15 text-gold flex size-10 items-center justify-center rounded-xl'>
                    <IconStar className='size-5 fill-current' />
                  </div>
                  <div>
                    <p className='text-sm font-semibold'>{t('marketplace.ratingTitle', marketingCopy.marketplace)}</p>
                    <p className='text-muted-foreground text-xs'>{t('marketplace.ratingSubtext')}</p>
                  </div>
                </div>
              </div>
            </div>
          </HomeFadeIn>

          <div className='grid gap-4 sm:grid-cols-2'>
            {marketplaceBenefits.map((benefit, index) => (
              <HomeFadeIn key={benefit.title} delay={0.08 + index * 0.05}>
                <article className='border-border/50 bg-card/50 hover:border-border h-full rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'>
                  <h3 className='font-display text-lg font-semibold'>{benefit.title}</h3>
                  <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                    {benefit.description}
                  </p>
                </article>
              </HomeFadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
