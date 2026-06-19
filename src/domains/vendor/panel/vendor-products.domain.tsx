import { VendorPanelStub } from '@/domains/vendor/panel/components/vendor-panel-stub';

export function VendorProductsDomain() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Products</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Manage listings, pricing, and inventory for your storefront.
        </p>
      </div>

      <VendorPanelStub
        title='Catalog management'
        description='Vendor-scoped product CRUD will mirror admin product tools with store-level permissions.'
        bullets={[
          'Create and edit products tied to your store',
          'Inventory sync with marketplace stock rules',
          'Workflow states for draft, active, and archived SKUs'
        ]}
      />
    </div>
  );
}
