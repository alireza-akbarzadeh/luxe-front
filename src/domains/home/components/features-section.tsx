import { IconDiamond, IconHeadphones, IconShield, IconTruck } from '@tabler/icons-react';

import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
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

/** Horizontal “why shop with us” row — icon + copy, light band. */
export async function FeaturesSection() {
  const { features, t } = await getHomeContent();

  return (
    <section id='features' className='bg-muted/40 py-8 sm:py-10 lg:py-12'>
      <div className={sectionContainerClass}>
        <SectionHeaderStatic
          eyebrow={t('features.eyebrow')}
          title={t('features.title')}
          description={t('features.description')}
          className='mb-6 sm:mb-8'
        />

        <Grid cols={1} className='gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4'>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <Flex
                key={feature.id}
                direction='row'
                align='center'
                gap={3}
                className={cn(
                  'group border-border/50 bg-card h-full rounded-xl border px-3.5 py-3.5 sm:px-4',
                  index === 1 && 'luxe-delay-1',
                  index === 2 && 'luxe-delay-2',
                  index === 3 && 'luxe-delay-3'
                )}
              >
                <Flex
                  align='center'
                  justify='center'
                  className='bg-gold/10 text-gold group-hover:bg-gold group-hover:text-gold-foreground size-10 shrink-0 rounded-lg transition-colors duration-300'
                >
                  <Icon className='size-5' stroke={1.5} />
                </Flex>
                <div className='min-w-0'>
                  <Typography.H3 family='display' className='text-sm font-semibold sm:text-base'>
                    {feature.title}
                  </Typography.H3>
                  <Typography.Muted className='mt-0.5 line-clamp-2 text-[11px] leading-snug sm:text-xs'>
                    {feature.description}
                  </Typography.Muted>
                </div>
              </Flex>
            );
          })}
        </Grid>
      </div>
    </section>
  );
}
