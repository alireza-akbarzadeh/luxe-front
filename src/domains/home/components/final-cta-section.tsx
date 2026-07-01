import { IconArrowRight, IconBuildingStore, IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { getHomeContent } from '../lib/get-home-content';
import { sectionContainerClass } from '../lib/home-utils';

export async function FinalCtaSection() {
  const { t } = await getHomeContent();

  return (
    <section className='pb-8 sm:pb-12'>
      <div className={sectionContainerClass}>
        <div className='luxe-rise'>
          <div className='border-border/50 from-gold/12 via-card/80 to-accent/5 relative overflow-hidden rounded-4xl border bg-linear-to-br px-6 py-14 text-center sm:px-12 sm:py-16'>
            <div
              aria-hidden
              className='bg-gold/20 pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl'
            />

            <div className='relative mx-auto max-w-2xl'>
              <h2 className='font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl'>
                {t('finalCta.title')}
              </h2>
              <p className='text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg'>
                {t('finalCta.description')}
              </p>
              <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
                <Link
                  href='/shop'
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'group h-12 gap-2 rounded-full px-8 sm:h-14'
                  )}
                >
                  <IconShoppingBag className='size-4' aria-hidden />
                  {t('finalCta.startShopping')}
                  <IconArrowRight className='cn-rtl-flip size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
                </Link>
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
          </div>
        </div>
      </div>
    </section>
  );
}
