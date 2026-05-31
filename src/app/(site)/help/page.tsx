import type { Metadata } from 'next';

import SupportHelp from '~/src/domains/support/sections/support-help';

export const metadata: Metadata = {
  title: 'Help & Support — Luxe Marketplace',
  description:
    'Everything you need to manage orders, shipping, returns, sizing and more. Real humans, 24/7.'
};

export default function HelpPage() {
  return <SupportHelp />;
}
