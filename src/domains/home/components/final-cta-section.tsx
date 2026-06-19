'use client';

import { IconArrowRight, IconBuildingStore, IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { sectionContainerClass } from '../lib/home-utils';
import { HomeFadeIn } from './ui/home-fade-in';

export function FinalCtaSection() {
  return (
    <section className='pb-8 sm:pb-12'>
      <div className={sectionContainerClass}>
        <HomeFadeIn>
          <div className='border-border/50 from-gold/12 via-card/80 to-accent/5 relative overflow-hidden rounded-[2rem] border bg-gradient-to-br px-6 py-14 text-center sm:px-12 sm:py-16'>
            <div
              aria-hidden
              className='bg-gold/20 pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl'
            />
            <div className='relative mx-auto max-w-2xl'>
              <h2 className='font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl'>
                Ready to experience premium shopping?
              </h2>
              <p className='text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg'>
                Explore curated collections today — or launch your brand on the marketplace trusted
                by modern shoppers.
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
                  Start shopping
                  <IconArrowRight className='size-4 transition-transform group-hover:translate-x-0.5' />
                </Link>
                <Button variant='outline' size='lg' className='h-12 gap-2 rounded-full px-8 sm:h-14' asChild>
                  <Link href='/vendor'>
                    <IconBuildingStore className='size-4' aria-hidden />
                    Sell on LUXE
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </HomeFadeIn>
      </div>
    </section>
  );
}
