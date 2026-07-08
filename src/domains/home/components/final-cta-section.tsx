import { IconArrowRight, IconBuildingStore, IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';

import { GradientCtaLink } from '@/components/buttons/gradient-cta-link';
import { LandingCtaShell } from '@/components/effects/landing-cta-shell';
import { Button } from '@/components/ui/button';

import { getHomeContent } from '../lib/get-home-content';
import { sectionContainerClass } from '../lib/home-utils';

export async function FinalCtaSection() {
  const { t } = await getHomeContent();

  return (
    <section className='pb-8 sm:pb-12'>
      <div className={sectionContainerClass}>
        <div className='luxe-rise'>
          <LandingCtaShell className='rounded-4xl px-6 py-14 sm:px-12 sm:py-16'>
            <div className='relative mx-auto max-w-2xl'>
              <h2 className='font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl'>
                {t('finalCta.title')}
              </h2>
              <p className='text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg'>
                {t('finalCta.description')}
              </p>
              <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
                <GradientCtaLink
                  href='/shop'
                  className='group inline-flex h-12 items-center gap-2 sm:h-14'
                >
                  <IconShoppingBag className='size-4' aria-hidden />
                  {t('finalCta.startShopping')}
                  <IconArrowRight className='cn-rtl-flip size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
                </GradientCtaLink>
                <Button
                  variant='outline'
                  size='lg'
                  className='h-12 gap-2 rounded-full px-8 sm:h-14'
                  asChild
                >
                  <Link href='/vendor'>
                    <IconBuildingStore className='size-4' aria-hidden />
                    {t('finalCta.sellOnLuxe')}
                  </Link>
                </Button>
              </div>
            </div>
          </LandingCtaShell>
        </div>
      </div>
    </section>
  );
}
