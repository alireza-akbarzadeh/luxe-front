import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { VendorPanelStub } from '@/domains/vendor/panel/components/vendor-panel-stub';

export function VendorStoreDomain() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Store</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Branding, policies, and public storefront settings.
          </p>
        </div>
        <Button variant='outline' size='sm' asChild>
          <Link href='/dashboard/stores'>Admin store management</Link>
        </Button>
      </div>

      <VendorPanelStub
        title='Storefront profile'
        description='Edit your vendor page, logo, and policies from this section once seller APIs land.'
        bullets={[
          'Public store page at /store/[slug]',
          'Shipping and return policy copy',
          'Category associations and verification badge'
        ]}
      />
    </div>
  );
}
