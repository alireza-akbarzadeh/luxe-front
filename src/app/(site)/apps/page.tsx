import type { Metadata } from 'next';

import { AppsDomain } from '@/domains/apps/apps.domain';

export const metadata: Metadata = {
  title: 'Get Luxe App — Web, iPhone, Android and PWA',
  description:
    'Choose how to use Luxe on your device: website, iPhone, Android, or installable PWA.'
};

export default function AppsPage() {
  return <AppsDomain />;
}
