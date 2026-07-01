import { IconMail } from '@tabler/icons-react';

import { getHomeContent } from '../lib/get-home-content';
import { sectionContainerClass } from '../lib/home-utils';
import { NewsletterForm } from './ui/newsletter-form';

export async function NewsletterSection() {
  const { t } = await getHomeContent();

  return (
    <section className='pb-20 sm:pb-24 lg:pb-32'>
      <div className={sectionContainerClass}>
        <div className='luxe-rise border-border/60 from-card to-secondary/40 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 sm:rounded-3xl sm:p-12 lg:p-16'>
          <div className='bg-accent/8 pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl' />
          <div className='bg-accent/5 pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full blur-3xl' />

          <div className='relative mx-auto max-w-2xl text-center'>
            <div className='bg-accent/10 text-accent mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full'>
              <IconMail className='h-5 w-5' />
            </div>
            <span className='text-accent text-xs font-semibold tracking-[0.2em] uppercase'>
              {t('newsletter.eyebrow')}
            </span>
            <h2 className='font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
              {t('newsletter.title')}
            </h2>
            <p className='text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base'>
              {t('newsletter.description')}
            </p>

            <div className='mt-8'>
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
          </div>
        </div>
      </div>
    </section>
  );
}
