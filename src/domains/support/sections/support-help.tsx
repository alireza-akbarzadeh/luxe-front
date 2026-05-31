'use client';

import {
  IconCreditCard,
  IconHeadphones,
  IconHelp,
  IconPackage,
  IconRotateClockwise2,
  IconRuler,
  IconShieldCheck,
  IconTruck
} from '@tabler/icons-react';

import { ContactChannels } from '@/domains/support/components/contact-channels';
import { InfoCard } from '@/domains/support/components/info-card';
import { SectionHeading, SectionShell } from '@/domains/support/components/section-shell';
import { SupportPageHero } from '@/domains/support/components/support-page-hero';

const topics = [
  {
    icon: IconPackage,
    title: 'Order Tracking',
    description: 'Track your order status, delivery updates and estimated arrival.',
    href: '/help/order-tracking'
  },
  {
    icon: IconTruck,
    title: 'Shipping & Delivery',
    description: 'Delivery options, timing, customs, duties and signature requirements.',
    href: '/help/shipping'
  },
  {
    icon: IconRotateClockwise2,
    title: 'Returns & Refunds',
    description: '30-day free returns, exchanges and refund processing times.',
    href: '/help/returns'
  },
  {
    icon: IconRuler,
    title: 'Size Guide',
    description: 'International size conversions for apparel, footwear and accessories.',
    href: '/help/size-guide'
  },
  {
    icon: IconHelp,
    title: 'FAQ',
    description: 'The most common questions about orders, accounts and payments.',
    href: '/help/faq'
  },
  {
    icon: IconCreditCard,
    title: 'Payments & Billing',
    description: 'Accepted methods, installments, invoices and currency questions.',
    href: '/help/faq#payments'
  },
  {
    icon: IconShieldCheck,
    title: 'Authenticity',
    description: 'Every brand is verified. Learn how we guarantee authenticity.',
    href: '/help/faq#authenticity'
  },
  {
    icon: IconHeadphones,
    title: 'Contact Concierge',
    description: 'Talk to a real human via chat, email, phone or WhatsApp.',
    href: '/contact'
  }
] as const;

export default function SupportHelp() {
  return (
    <section className='pb-24'>
      <SupportPageHero
        eyebrow='Help & Support'
        title='How can we help today?'
        description='Browse topics below or talk to our concierge team. We typically reply in under 5 minutes.'
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Help' }]}
      />
      <SectionShell className='mt-16'>
        <SectionHeading
          eyebrow='Popular topics'
          title='Quick answers, sorted by category'
          description='Find the right article for your question. Still stuck? Contact us anytime.'
        />
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {topics.map((t, i) => (
            <InfoCard
              key={t.title}
              icon={t.icon}
              title={t.title}
              description={t.description}
              href={t.href}
              index={i}
            />
          ))}
        </div>
      </SectionShell>
      <SectionShell className='mt-24'>
        <SectionHeading
          eyebrow='Get in touch'
          title='Talk to a human, 24/7'
          description='Pick the channel that works for you. Our concierge team is online around the clock.'
        />
        <ContactChannels />
      </SectionShell>
    </section>
  );
}
