import { IconMail } from '@tabler/icons-react';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

import { getHomeContent } from '../lib/get-home-content';
import { sectionContainerClass } from '../lib/home-utils';
import { NewsletterForm } from './ui/newsletter-form';

export async function NewsletterSection() {
  const { t } = await getHomeContent();

  return (
    <section className='pb-20 sm:pb-24 lg:pb-32'>
      <div className={sectionContainerClass}>
        <div className='luxe-rise luxury-glass relative overflow-hidden rounded-2xl p-8 sm:rounded-3xl sm:p-12 lg:p-16'>
          <div
            aria-hidden
            className='bg-gold/10 pointer-events-none absolute -end-24 -top-24 size-64 rounded-full blur-3xl'
          />
          <div
            aria-hidden
            className='bg-gold/5 pointer-events-none absolute -start-16 -bottom-16 size-48 rounded-full blur-3xl'
          />

          <Flex
            direction='column'
            align='center'
            className='relative mx-auto max-w-2xl text-center'
          >
            <Flex
              align='center'
              justify='center'
              className='bg-gold/10 text-gold mb-5 size-12 rounded-full'
            >
              <IconMail className='size-5' />
            </Flex>
            <Typography.Overline className='text-gold'>
              {t('newsletter.eyebrow')}
            </Typography.Overline>
            <Typography.H2
              family='display'
              className='mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl'
            >
              {t('newsletter.title')}
            </Typography.H2>
            <Typography.Muted className='mt-3 text-sm leading-relaxed sm:text-base'>
              {t('newsletter.description')}
            </Typography.Muted>

            <div className='mt-8 w-full'>
              <NewsletterForm
                labels={{
                  emailPlaceholder: t('newsletter.emailPlaceholder'),
                  emailAriaLabel: t('newsletter.emailAriaLabel'),
                  subscribe: t('newsletter.subscribe'),
                  success: t('newsletter.success'),
                  privacyNote: t('newsletter.privacyNote')
                }}
              />
            </div>
          </Flex>
        </div>
      </div>
    </section>
  );
}
