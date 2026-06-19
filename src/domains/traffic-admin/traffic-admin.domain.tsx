'use client';

import { Flex } from '@/components/ui/flex';
import { PlannedFeaturePanel } from '@/domains/admin/components/planned-feature-panel';

export function TrafficAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Traffic report</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Site analytics and funnel metrics require a new events pipeline or third-party embed.
        </p>
      </div>

      <PlannedFeaturePanel
        title='Planned — analytics integration'
        description='Revenue reporting is available today; traffic and conversion metrics are a separate track.'
        bullets={[
          'Option A: Umami / PostHog embed in admin with read-only dashboard',
          'Option B: first-party `GET /admin/reports/traffic` aggregating page views and sessions',
          'Funnel: visits → product views → add to cart → checkout started → paid order',
          'UTM and referrer breakdown for marketing campaigns'
        ]}
        links={[
          { label: 'Revenue report (available)', href: '/dashboard/reports/revenue' },
          { label: 'Live sales feed', href: '/dashboard/live' }
        ]}
      />
    </Flex>
  );
}
