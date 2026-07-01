import {
  IconDiamond,
  IconHeadphones,
  IconShield,
  IconTruck
} from '@tabler/icons-react';

import { cn } from '@/lib/utils';

import { getHomeContent } from '../lib/get-home-content';
import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeaderStatic } from './section-header-static';

const iconMap = {
  truck: IconTruck,
  gem: IconDiamond,
  shield: IconShield,
  headphones: IconHeadphones
} as const;

export async function FeaturesSection() {
  const { features, t } = await getHomeContent();

  return (
    <section id='features' className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <SectionHeaderStatic
          eyebrow={t('features.eyebrow')}
          title={t('features.title')}
          description={t('features.description')}
        />

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5'>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={feature.id}
                className={cn(
                  'luxe-fade group',
                  index === 1 && 'luxe-delay-1',
                  index === 2 && 'luxe-delay-2',
                  index === 3 && 'luxe-delay-3'
                )}
              >
                <div className='bg-card border-border/60 hover:border-border h-full rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-8'>
                  <div className='bg-secondary text-accent group-hover:bg-accent group-hover:text-accent-foreground mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300'>
                    <Icon className='h-6 w-6' stroke={1.5} />
                  </div>
                  <h3 className='font-display text-lg font-semibold'>{feature.title}</h3>
                  <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
