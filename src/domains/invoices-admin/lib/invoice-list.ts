import type {
  DtoAdminInvoiceListItem,
  GetAdminInvoices200
} from '@/services/-admin-invoices.schemas';

export function getInvoicesFromListResponse(
  data: GetAdminInvoices200 | undefined
): DtoAdminInvoiceListItem[] {
  return data?.data?.invoices ?? [];
}

export function getInvoicesTotalFromListResponse(
  data: GetAdminInvoices200 | undefined
): number | undefined {
  return data?.data?.total;
}
