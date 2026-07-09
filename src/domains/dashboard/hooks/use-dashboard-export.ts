'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { downloadBlobExport } from '@/lib/download-blob-export';
import { getAdminDashboardExport } from '@/services/-admin-dashboard-export-get';
import type { GetAdminDashboardExportParams } from '@/services/-admin-dashboard-export-get.schemas';

/** Downloads the dashboard CSV export for the selected period. */
export function useDashboardExport() {
  return useMutation({
    mutationFn: async (params: GetAdminDashboardExportParams) => {
      return getAdminDashboardExport(params, { responseType: 'blob' });
    },
    onSuccess: (blob, params) => {
      downloadBlobExport(blob, `dashboard_${params.period ?? '30d'}.csv`);
      toast.success('Dashboard report exported');
    },
    onError: () => {
      toast.error('Failed to export dashboard report');
    }
  });
}
