import { getAdminOrdersExport } from '@/services/-admin-orders-export-get';
import type { GetAdminOrdersExportParams } from '@/services/-admin-orders-export-get.schemas';

/** Downloads a CSV export from the admin orders export endpoint. */
export async function downloadOrdersCsv(params?: GetAdminOrdersExportParams) {
  const blob = await getAdminOrdersExport(params);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
