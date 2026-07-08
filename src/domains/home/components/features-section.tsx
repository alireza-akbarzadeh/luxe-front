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

        <Grid cols={1} className='gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5'>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <Flex
                key={feature.id}
                direction='column'
                className={cn(
                  'group luxe-fade luxury-glass luxury-card h-full p-6 sm:p-8',
                  index === 1 && 'luxe-delay-1',
                  index === 2 && 'luxe-delay-2',
                  index === 3 && 'luxe-delay-3'
                )}
              >
                <Flex
                  align='center'
                  justify='center'
                  className='bg-gold/10 text-gold group-hover:bg-gold group-hover:text-gold-foreground mb-5 size-12 rounded-xl transition-colors duration-300'
                >
                  <Icon className='size-6' stroke={1.5} />
                </Flex>
                <Typography.H3 family='display' className='text-lg font-semibold'>
                  {feature.title}
                </Typography.H3>
                <Typography.Muted className='mt-2 text-sm leading-relaxed'>
                  {feature.description}
                </Typography.Muted>
              </Flex>
            );
          })}
        </Grid>
      </div>
    </section>
  );
}
