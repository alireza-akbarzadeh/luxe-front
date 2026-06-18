import { parseAsStringEnum, useQueryState } from 'nuqs';

import type { InvoiceStatusFilter } from '@/domains/invoices-admin/invoices.schema';

const STATUS_VALUES = ['all', 'draft', 'issued', 'paid', 'void', 'refunded'] as const;

export function useInvoicesQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<InvoiceStatusFilter>([...STATUS_VALUES]).withDefault('all')
  );

  return { status, setStatus };
}
