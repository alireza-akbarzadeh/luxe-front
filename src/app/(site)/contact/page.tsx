'use client';
import { IconMail, IconMapPin, IconPhone } from '@tabler/icons-react';

import { ContactChannels } from '@/domains/support/components/contact-channels';
import { SectionHeading, SectionShell } from '@/domains/support/components/section-shell';
import { SupportPageHero } from '@/domains/support/components/support-page-hero';
import { SupportContactForm } from '@/domains/support/sections/support-contact-form';

export default function ContactPage() {
  return (
    <main className='pb-24'>
      <SupportPageHero
        eyebrow='Contact'
        title='Talk to a real human'
        description='Our concierge team is online 24/7. Send a message, or use one of the direct channels below.'
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Contact' }]}
      />
      <SectionShell className='mt-16'>
        <ContactChannels />
      </SectionShell>
      <SectionShell size='md' className='mt-20'>
        <SectionHeading
          eyebrow='Write to us'
          title='Send a message'
          description='Tell us a bit about what you need — order help, partnerships, press or anything else.'
        />
        <div className='grid gap-8 lg:grid-cols-5'>
          <div className='lg:col-span-3'>
            <SupportContactForm />
          </div>
          <aside className='space-y-5 lg:col-span-2'>
            <div className='border-border/60 bg-card/40 rounded-3xl border p-7 backdrop-blur'>
              <h3 className='text-base font-semibold tracking-tight'>Headquarters</h3>
              <ul className='mt-5 space-y-4 text-sm'>
                <li className='text-muted-foreground flex items-start gap-3'>
                  <IconMapPin className='text-accent mt-0.5 size-4 shrink-0' />
                  <span>500 Madison Avenue, New York, NY 10022</span>
                </li>
                <li className='text-muted-foreground flex items-center gap-3'>
                  <IconPhone className='text-accent size-4 shrink-0' />
                  <a href='tel:+18001234567' className='hover:text-foreground'>
                    +1 (800) 123-4567
                  </a>
                </li>
                <li className='text-muted-foreground flex items-center gap-3'>
                  <IconMail className='text-accent size-4 shrink-0' />
                  <a href='mailto:concierge@luxe.com' className='hover:text-foreground'>
                    concierge@luxe.com
                  </a>
                </li>
              </ul>
            </div>
            <div className='border-border/60 from-card via-card to-muted/40 rounded-3xl border bg-linear-to-br p-7'>
              <h3 className='text-base font-semibold tracking-tight'>Hours</h3>
              <dl className='text-muted-foreground mt-4 space-y-2 text-sm'>
                <div className='flex items-center justify-between'>
                  <dt>Concierge chat</dt>
                  <dd className='text-foreground'>24/7</dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt>Phone support</dt>
                  <dd className='text-foreground'>Mon–Sun · 8am–11pm ET</dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt>Email replies</dt>
                  <dd className='text-foreground'>Within 4 hours</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </SectionShell>
    </main>
  );
}
