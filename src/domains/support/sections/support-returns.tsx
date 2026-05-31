'use client';
import { SectionHeading, SectionShell } from '@/domains/support/components/section-shell';
import { SupportPageHero } from '@/domains/support/components/support-page-hero';
import { SupportStatuses } from '~/src/domains/support/components/support-statuses';
import { Perks } from '~/src/domains/support/support.data';

const steps = [
  {
    title: 'Start your return',
    body: 'Go to Account → Orders, pick the item, and choose Return or Exchange. Tell us the reason and preferred resolution.'
  },
  {
    title: 'Pack it up',
    body: 'Reuse the original Luxe box if possible. Include all original packaging, dust bags and authenticity cards.'
  },
  {
    title: 'Hand it to the carrier',
    body: 'We email a prepaid label and schedule a free pickup. You can also drop it at any partner location.'
  },
  {
    title: 'Get refunded',
    body: 'Once the vendor confirms condition, we refund to the original payment method within 5 business days.'
  }
] as const;

const ineligible = [
  'Final-sale and clearance items (clearly marked)',
  'Custom or made-to-order pieces',
  'Pierced jewelry, lingerie and swimwear (hygiene reasons)',
  'Beauty products with broken seals',
  'Items returned damaged, used or without original packaging'
] as const;

export function SupportReturns() {
  return (
    <section className='pb-24'>
      <SupportPageHero
        eyebrow='Returns & Refunds'
        title='Easy returns, on us'
        description='Try it at home. If it doesn’t feel right, send it back within 30 days — free pickup, full refund.'
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Help', href: '/help' },
          { name: 'Returns' }
        ]}
      />
      <SectionShell className='mt-16'>
        <SupportStatuses options={Perks} />
      </SectionShell>
      <SectionShell size='md' className='mt-20'>
        <SectionHeading eyebrow='How it works' title='Return in 4 simple steps' />
        <ol className='space-y-4'>
          {steps.map((s, i) => (
            <li
              key={s.title}
              className='border-border/60 bg-card/40 flex gap-5 rounded-3xl border p-6 backdrop-blur'
            >
              <span className='bg-accent/10 text-accent flex size-10 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold'>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className='text-base font-semibold tracking-tight'>{s.title}</h3>
                <p className='text-muted-foreground mt-1.5 text-sm leading-relaxed'>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </SectionShell>
      <SectionShell size='md' className='mt-20'>
        <div className='border-border/60 bg-card/40 rounded-3xl border p-8 backdrop-blur md:p-10'>
          <h3 className='text-xl font-semibold tracking-tight md:text-2xl'>
            Items we can&apos;t accept back
          </h3>
          <ul className='text-muted-foreground mt-5 space-y-3 text-sm leading-relaxed'>
            {ineligible.map((item) => (
              <li key={item} className='flex gap-3'>
                <span className='bg-accent mt-2 size-1.5 shrink-0 rounded-full' />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>
    </section>
  );
}
