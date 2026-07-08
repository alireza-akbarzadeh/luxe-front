'use client';

import { useTranslations } from 'next-intl';

import { ContainerScroll } from '@/components/scroll/container-scroll-animation';
import { AppImage } from '@/components/ui/app-image';

import { HOME_EXPERIENCE_SCROLL_IMAGE } from '../lib/home-mock-data';

/** Scroll-flatten showcase — mirrors vendor dashboard moment for the storefront. */
export function HomeExperienceScrollSection() {
  const t = useTranslations('home.experienceScroll');

  return (
    <section className='relative overflow-x-clip pb-4 md:pb-8'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,var(--gold)_0%,transparent_70%)] opacity-[0.08] dark:opacity-[0.14]'
      />
      <ContainerScroll
        titleComponent={
          <>
            <h2 className='font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
              {t('titleLine1')}
            </h2>
            <span className='text-gold mt-1 block text-4xl leading-none font-bold sm:text-5xl md:text-6xl'>
              {t('titleLine2')}
            </span>
            <p className='text-muted-foreground mx-auto mt-5 max-w-xl text-base leading-relaxed md:text-lg'>
              {t('description')}
            </p>
          </>
        }
      >
        <AppImage
          src={HOME_EXPERIENCE_SCROLL_IMAGE}
          alt={t('imageAlt')}
          height={720}
          width={1400}
          className='mx-auto h-full rounded-2xl object-cover object-center'
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
}
