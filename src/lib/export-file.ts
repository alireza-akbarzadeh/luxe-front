// utils/export-csv.ts
import { toast } from 'sonner';

export interface ExportOptions {
  filename?: string; // default: 'export.csv'
  headers?: string[]; // if not provided, uses Object.keys(data[0])
  showToast?: boolean; // default: true
  successMessage?: string; // default: 'Exported X rows'
  errorMessage?: string; // default: 'No data to export'
}

/**
 * Export an array of objects to a CSV file.
 * @param data - Array of objects to export
 * @param options - Export configuration
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  options: ExportOptions = {}
): void {
  if (!data.length) {
    const msg = options.errorMessage || 'No data to export';
    if (options.showToast !== false) toast.error(msg);
    return;
  }

  const headers = options.headers || Object.keys(data[0]!);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header] ?? '';
          const stringValue = String(value);
          // Escape quotes and wrap in quotes if needed
          if (
            stringValue.includes(',') ||
            stringValue.includes('"') ||
            stringValue.includes('\n')
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(',')
    )
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', options.filename || 'export.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  if (options.showToast !== false) {
    const msg = options.successMessage || `Exported ${data.length} rows`;
    toast.success(msg);
  }
}
