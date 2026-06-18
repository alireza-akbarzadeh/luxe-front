import { InvoiceDetailSkeleton } from '@/domains/invoices-admin/sections/invoice-detail-skeleton';

export default function InvoiceDetailLoading() {
  return (
    <div className='mx-auto max-w-350 px-6 py-8'>
      <InvoiceDetailSkeleton />
    </div>
  );
}
