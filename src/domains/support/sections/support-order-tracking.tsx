import { IconMail, IconMapPin } from '@tabler/icons-react';

import { SectionHeading, SectionShell } from '@/domains/support/components/section-shell';
import { SupportPageHero } from '@/domains/support/components/support-page-hero';
import { SupportStatuses } from '~/src/domains/support/components/support-statuses';
import { OrderTrackingStatuses } from '~/src/domains/support/support.data';

export default function SupportOrderTracking() {
  return (
    <section className='pb-24'>
      <SupportPageHero
        eyebrow='Order Tracking'
        title='Where is my order?'
        description='Every Luxe order is tracked end-to-end. Here is what each status means and how to find your tracking link.'
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Help', href: '/help' },
          { name: 'Order Tracking' }
        ]}
      />
      <SectionShell size='md' className='mt-16'>
        <div className='border-border/60 bg-card/40 overflow-hidden rounded-3xl border p-8 backdrop-blur md:p-10'>
          <h2 className='text-2xl font-semibold tracking-tight md:text-3xl'>
            How to find your tracking link
          </h2>
          <ol className='text-muted-foreground mt-6 space-y-5 text-sm leading-relaxed'>
            <li className='flex gap-4'>
              <span className='bg-accent/10 text-accent flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
                1
              </span>
              <span>
                Open the <strong className='text-foreground'>order confirmation email</strong> we
                sent right after checkout.
              </span>
            </li>
            <li className='flex gap-4'>
              <span className='bg-accent/10 text-accent flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
                2
              </span>
              <span>
                Once your order ships, we send a second email with a{' '}
                <strong className='text-foreground'>tracking number</strong> and a live link to the
                carrier.
              </span>
            </li>
            <li className='flex gap-4'>
              <span className='bg-accent/10 text-accent flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
                3
              </span>
              <span>
                Signed-in members can also see live status under{' '}
                <strong className='text-foreground'>Account → Orders</strong>.
              </span>
            </li>
          </ol>
        </div>
      </SectionShell>
      <SectionShell className='mt-20'>
        <SectionHeading
          eyebrow='Order journey'
          title='What each status means'
          description='An overview of every step from checkout to your door.'
        />
        <SupportStatuses options={OrderTrackingStatuses} />
      </SectionShell>
      <SectionShell size='md' className='mt-20'>
        <div className='border-border/60 from-card via-card to-muted/40 rounded-3xl border bg-linear-to-br p-8 md:p-10'>
          <h3 className='text-xl font-semibold tracking-tight md:text-2xl'>
            Package delayed or missing?
          </h3>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
            Most carriers update tracking once every 24 hours. If your package hasn&apos;t moved in
            more than 3 business days, our concierge team will investigate and re-ship if needed —
            at no extra cost.
          </p>
          <div className='mt-6 flex flex-wrap gap-3'>
            <a
              href='mailto:concierge@luxe.com'
              className='bg-foreground text-background inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90'
            >
              <IconMail className='size-4' /> Contact concierge
            </a>
            <a
              href='/help'
              className='border-border/60 bg-background hover:bg-muted/60 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition'
            >
              <IconMapPin className='size-4' /> Back to Help Center
            </a>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
