'use client';
import { SectionHeading, SectionShell } from '@/domains/support/components/section-shell';
import { SupportPageHero } from '@/domains/support/components/support-page-hero';
import { SupportStatuses } from '~/src/domains/support/components/support-statuses';
import { ShippingOptions } from '~/src/domains/support/support.data';

export function SupportShipping() {
  return (
    <section className='pb-24'>
      <SupportPageHero
        eyebrow='Shipping & Delivery'
        title='Fast, tracked, beautifully packaged'
        description='Free standard shipping over $150, premium express worldwide, and full duties-paid clearance to 90+ countries.'
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Help', href: '/help' },
          { name: 'Shipping' }
        ]}
      />
      <SectionShell className='mt-16'>
        <SectionHeading eyebrow='Delivery options' title='Choose how fast you need it' />
        <SupportStatuses options={ShippingOptions} />
      </SectionShell>
      <SectionShell size='md' className='mt-20'>
        <SectionHeading
          eyebrow='Transit times'
          title='Estimated delivery by region'
          description='Times exclude the 1–2 day vendor preparation window.'
        />
      </SectionShell>
      <SectionShell size='md' className='mt-20'>
        <div className='grid gap-5 md:grid-cols-2'>
          <div className='border-border/60 bg-card/40 rounded-3xl border p-7 backdrop-blur'>
            <h3 className='text-lg font-semibold tracking-tight'>Customs & duties</h3>
            <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
              For most international destinations, duties and taxes are calculated and paid at
              checkout — no surprises at the door. A few countries are duties-unpaid; we&apos;ll
              flag this clearly before payment.
            </p>
          </div>
          <div className='border-border/60 bg-card/40 rounded-3xl border p-7 backdrop-blur'>
            <h3 className='text-lg font-semibold tracking-tight'>Packaging</h3>
            <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
              Every order ships in FSC-certified recyclable packaging with brand-original boxes
              preserved. Gift wrapping is available at checkout for a small fee.
            </p>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
