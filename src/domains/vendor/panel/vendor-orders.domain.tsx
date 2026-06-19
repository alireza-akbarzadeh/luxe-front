import { VendorPanelStub } from '@/domains/vendor/panel/components/vendor-panel-stub';

export function VendorOrdersDomain() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Orders</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Track and fulfill orders placed on your store.
        </p>
      </div>

      <VendorPanelStub
        title='Order fulfillment'
        description='Store-filtered order lists and shipment actions will appear here.'
        bullets={[
          'View paid and pending orders for your catalog only',
          'Print packing slips and update shipment status',
          'Coordinate returns through marketplace workflows'
        ]}
      />
    </div>
  );
}
