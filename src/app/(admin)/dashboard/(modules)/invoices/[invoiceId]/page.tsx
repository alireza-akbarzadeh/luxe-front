import { InvoiceDetailDomain } from '@/domains/invoices-admin/containers/invoice-detail';

interface InvoiceDetailPageProps {
  params: Promise<{ invoiceId: string }>;
}

export default async function InvoiceDetailPage(props: InvoiceDetailPageProps) {
  const { invoiceId } = await props.params;
  return <InvoiceDetailDomain invoiceId={invoiceId} />;
}
