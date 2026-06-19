'use client';

import { Flex } from '@/components/ui/flex';
import { PlannedFeaturePanel } from '@/domains/admin/components/planned-feature-panel';

export function NewslettersAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Newsletters</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Email marketing and subscriber management — backend APIs are not built yet.
        </p>
      </div>

      <PlannedFeaturePanel
        title='Planned — subscriber & campaign MVP'
        description='Checkout already captures a newsletter opt-in flag on orders; a dedicated subscriber store and send pipeline are next.'
        bullets={[
          'Subscriber list with export (CSV) synced from signups and checkout opt-ins',
          'Simple campaign send via the existing job queue (no drag-and-drop builder initially)',
          'Account preference toggles on storefront and mobile once the API exists',
          'Unsubscribe and compliance hooks before production sends'
        ]}
        links={[{ label: 'View all users', href: '/dashboard/users' }]}
      />
    </Flex>
  );
}
