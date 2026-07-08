'use client';

import { useTranslations } from 'next-intl';

import { ContainerScroll } from '@/components/scroll/container-scroll-animation';
import { AppImage } from '@/components/ui/app-image';

export function VendorDashboardScrollSection() {
  const t = useTranslations('auth.vendor.dashboardScroll');

  return (
    <section className='relative overflow-x-clip pb-16 md:pb-24'>
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
          src='/assets/vendor.png'
          alt='hero'
          height={720}
          width={1400}
          className='mx-auto h-full rounded-2xl object-cover object-left-top'
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
}
