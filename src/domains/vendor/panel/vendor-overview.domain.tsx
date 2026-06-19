import Link from 'next/link';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VendorPanelStub } from '@/domains/vendor/panel/components/vendor-panel-stub';
import { VENDOR_PANEL_NAV } from '@/domains/vendor/vendor-nav';

export function VendorOverviewDomain() {
  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Vendor overview</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Your seller workspace — catalog, orders, and storefront tools in one place.
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {VENDOR_PANEL_NAV.filter((item) => item.href !== '/vendor/panel').map((item) => (
          <Link key={item.href} href={item.href} className='group block'>
            <Card className='border-border/40 bg-card/40 h-full transition-colors group-hover:border-border'>
              <CardHeader className='pb-2'>
                <div className='bg-muted/60 text-foreground mb-2 flex size-9 items-center justify-center rounded-lg'>
                  <item.icon className='size-4' />
                </div>
                <CardTitle className='text-base'>{item.label}</CardTitle>
                <CardDescription className='text-xs'>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <VendorPanelStub
        title='Vendor onboarding'
        description='Marketplace operator tools are live; seller-scoped APIs and roles are coming next.'
        bullets={[
          'Platform admins can create and manage stores at /dashboard/stores today.',
          'Vendor RBAC will limit panel data to stores you own.',
          'Product and order views here will connect to store-scoped backend endpoints.'
        ]}
      />
    </div>
  );
}
