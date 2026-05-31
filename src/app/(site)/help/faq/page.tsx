import type { Metadata } from 'next';

import { SupportFaq } from '~/src/domains/support/sections/support-faq';

export const metadata: Metadata = {
  title: 'FAQ — Luxe Marketplace',
  description:
    'Answers to the most common questions about orders, payments, shipping, returns and authenticity.'
};

export default function FaqPage() {
  return <SupportFaq />;
}
