export const INVOICE_STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Issued', value: 'issued' },
  { label: 'Paid', value: 'paid' },
  { label: 'Void', value: 'void' },
  { label: 'Refunded', value: 'refunded' }
] as const;

export type InvoiceStatusFilter = (typeof INVOICE_STATUS_TABS)[number]['value'];

export const INVOICE_OUTSTANDING_STATUSES = ['draft', 'issued'] as const;

export const INVOICE_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Issued', value: 'issued' },
  { label: 'Paid', value: 'paid' },
  { label: 'Void', value: 'void' },
  { label: 'Refunded', value: 'refunded' }
] as const;
