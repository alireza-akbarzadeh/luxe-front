import { getTranslations } from 'next-intl/server';

import { GradientCtaLink } from '@/components/buttons/gradient-cta-link';
import { AppImage } from '@/components/ui/app-image';
import { DirectionalArrow } from '@/components/ui/directional-icon';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';

import { HOME_PRODUCT_STORY_IMAGE } from '../lib/home-mock-data';
import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeaderStatic } from './section-header-static';

const PILLAR_KEYS = ['craftsmanship', 'materials', 'guarantee'] as const;

/** Editorial split — craftsmanship story with photography (server, below-fold CSS motion). */
export async function ProductStorySection() {
  const t = await getTranslations('home.productStory');

  return (
    <section id='product-story' className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <Grid cols={1} className='items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20'>
          <div className='luxe-fade group luxury-image-zoom relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl'>
            <AppImage
              src={HOME_PRODUCT_STORY_IMAGE}
              alt={t('imageAlt')}
              fill
              sizes='(max-width: 1024px) 100vw, 50vw'
              loading='lazy'
              className='object-cover'
            />
            <div
              aria-hidden
              className='from-background/80 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60'
            />
            <div
              aria-hidden
              className='border-gold/20 pointer-events-none absolute inset-0 rounded-2xl border sm:rounded-3xl'
            />
          </div>

          <Flex direction='column' gap={8} className='luxe-fade luxe-delay-1'>
            <SectionHeaderStatic
              align='left'
              eyebrow={t('eyebrow')}
              title={t('title')}
              description={t('description')}
              className='mb-0'
            />

            <Flex direction='column' gap={4}>
              {PILLAR_KEYS.map((key, index) => (
                <Flex
                  key={key}
                  direction='column'
                  gap={2}
                  className={`luxury-glass luxury-card p-5 sm:p-6 ${index === 1 ? 'luxe-delay-1' : index === 2 ? 'luxe-delay-2' : ''}`}
                >
                  <Typography.H3 family='display' className='text-lg font-semibold sm:text-xl'>
                    {t(`pillars.${key}.title`)}
                  </Typography.H3>
                  <Typography.Muted className='text-sm leading-relaxed sm:text-base'>
                    {t(`pillars.${key}.description`)}
                  </Typography.Muted>
                </Flex>
              ))}
            </Flex>

            <GradientCtaLink
              href='/shop'
              className='inline-flex h-12 w-fit items-center gap-2 px-8'
            >
              {t('cta')}
              <DirectionalArrow />
            </GradientCtaLink>
          </Flex>
        </Grid>
      </div>
    </section>
  );
}
