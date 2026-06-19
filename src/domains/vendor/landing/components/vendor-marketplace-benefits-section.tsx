import type { TablerIcon } from '@tabler/icons-react';
import {
  IconHeadset,
  IconRocket,
  IconTrendingUp,
  IconTruck,
  IconUsers,
  IconWallet
} from '@tabler/icons-react';

import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { MARKETPLACE_BENEFITS } from '@/domains/vendor/landing/data/vendor-landing.data';

const BENEFIT_ICONS: TablerIcon[] = [
  IconTrendingUp,
  IconUsers,
  IconWallet,
  IconRocket,
  IconHeadset,
  IconTruck
];

export function VendorMarketplaceBenefitsSection() {
  return (
    <LandingContainer className='py-20 md:py-28'>
      <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-20'>
        <FadeInView>
          <div className='border-border/50 from-gold/10 via-card/60 to-card/30 relative aspect-square max-w-lg overflow-hidden rounded-3xl border bg-gradient-to-br p-8 shadow-xl'>
            <div
              aria-hidden
              className='absolute inset-0 opacity-[0.04]'
              style={{
                backgroundImage:
                  'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                backgroundSize: '32px 32px'
              }}
            />
            <div className='relative flex h-full flex-col justify-between'>
              <div>
                <p className='text-muted-foreground text-xs font-medium tracking-widest uppercase'>
                  Marketplace growth
                </p>
                <p className='mt-2 text-3xl font-semibold tracking-tight'>+127%</p>
                <p className='text-muted-foreground text-sm'>Average seller revenue year one</p>
              </div>
              <div className='space-y-3'>
                {['Discovery', 'Conversion', 'Retention'].map((stage, i) => (
                  <div key={stage} className='flex items-center gap-3'>
                    <div className='bg-gold/20 h-2 flex-1 overflow-hidden rounded-full'>
                      <div
                        className='bg-gold h-full rounded-full'
                        style={{ width: `${85 - i * 15}%` }}
                      />
                    </div>
                    <span className='text-muted-foreground w-20 text-xs'>{stage}</span>
                  </div>
                ))}
              </div>
              <div className='border-border/50 bg-background/60 rounded-2xl border p-4 backdrop-blur'>
                <p className='text-xs font-medium'>Active campaigns</p>
                <p className='text-muted-foreground mt-1 text-sm'>3 promotions · 12 featured SKUs</p>
              </div>
            </div>
          </div>
        </FadeInView>

        <div>
          <FadeInView>
            <SectionTitle
              eyebrow='Marketplace benefits'
              title='Built for brands that want to scale without the chaos'
              description='Lower overhead, higher reach, and tools that keep your team focused on what matters.'
              align='left'
              className='mb-8'
            />
          </FadeInView>

          <ul className='grid gap-4 sm:grid-cols-2'>
            {MARKETPLACE_BENEFITS.map((benefit, index) => (
              <FadeInView key={benefit} delay={index * 0.03}>
                <BenefitListItem
                  benefit={benefit}
                  icon={BENEFIT_ICONS[index % BENEFIT_ICONS.length] ?? IconTrendingUp}
                />
              </FadeInView>
            ))}
          </ul>
        </div>
      </div>
    </LandingContainer>
  );
}

function BenefitListItem({ benefit, icon: Icon }: { benefit: string; icon: TablerIcon }) {
  return (
    <li className='border-border/40 bg-card/30 flex items-start gap-3 rounded-2xl border p-4'>
      <div className='bg-gold/10 text-gold flex size-9 shrink-0 items-center justify-center rounded-lg'>
        <Icon className='size-4' aria-hidden />
      </div>
      <span className='text-sm leading-relaxed'>{benefit}</span>
    </li>
  );
}
