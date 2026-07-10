'use client';

import { Flex } from '@/components/ui/flex';
import { PlannedFeaturePanel } from '@/domains/admin/components/planned-feature-panel';

export function SuppliersAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Suppliers</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Vendor directory and purchase orders are not modeled in the API yet.
        </p>
      </div>

      <PlannedFeaturePanel
        title='Planned — supplier directory (phase 1)'
        description='Stores and brands cover customer-facing vendors; suppliers are for wholesale and PO workflows.'
        bullets={[
          'Supplier entity: contact, terms, lead time, default currency',
          'Link products to supplier SKUs for replenishment hints',
          'Phase 2: purchase orders, receiving, and inventory bulk receive integration',
          'Optional tie-in with inventory low-stock alerts'
        ]}
        links={[
          { label: 'Inventory', href: '/dashboard/inventory' },
          { label: 'Vendors', href: '/dashboard/vendors' },
          { label: 'Pending applications', href: '/dashboard/vendors?status=pending' }
        ]}
      />
    </Flex>
  );
}
