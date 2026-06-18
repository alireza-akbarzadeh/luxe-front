/** Downloads an invoice PDF from the admin endpoint. */
export async function downloadInvoicePdf(invoiceId: number, filename?: string) {
  const { getAdminInvoicesIdPdf } = await import('@/services/-admin-invoices-{id}-pdf-get');
  const blob = await getAdminInvoicesIdPdf(invoiceId);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename ?? `invoice-${invoiceId}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}
