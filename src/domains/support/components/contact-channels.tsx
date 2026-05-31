'use client';

import {
  IconBrandWhatsapp,
  IconHeadphones,
  IconMail,
  IconMessageCircle
} from '@tabler/icons-react';

import { InfoCard } from './info-card';
const channels = [
  {
    icon: IconMessageCircle,
    title: 'Live Chat',
    description: 'Chat with a real concierge. Average response under 30 seconds.',
    href: '#chat',
    cta: 'Start a chat'
  },
  {
    icon: IconMail,
    title: 'Email',
    description: 'Reach our care team at concierge@luxe.com — replies within 4 hours.',
    href: 'mailto:concierge@luxe.com',
    cta: 'Send an email'
  },
  {
    icon: IconHeadphones,
    title: 'Phone',
    description: 'Call +1 (800) 123-4567 — available 24/7 for VIP members.',
    href: 'tel:+18001234567',
    cta: 'Call us'
  },
  {
    icon: IconBrandWhatsapp,
    title: 'WhatsApp',
    description: 'Message us on WhatsApp for quick order or styling questions.',
    href: 'https://wa.me/18001234567',
    cta: 'Open WhatsApp'
  }
] as const;
export function ContactChannels() {
  return (
    <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
      {channels.map((c, i) => (
        <InfoCard
          key={c.title}
          icon={c.icon}
          title={c.title}
          description={c.description}
          href={c.href}
          cta={c.cta}
          index={i}
        />
      ))}
    </div>
  );
}
