'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getAdminDashboardExport } from '@/services/-admin-dashboard-export-get';
import type { GetAdminDashboardExportParams } from '@/services/-admin-dashboard-export-get.schemas';

/** Downloads the dashboard CSV export for the selected period. */
export function useDashboardExport() {
  return useMutation({
    mutationFn: async (params: GetAdminDashboardExportParams) => {
      const blob = await getAdminDashboardExport(params, { responseType: 'blob' });
      return blob;
    },
    onSuccess: (blob, params) => {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `dashboard_${params.period ?? '30d'}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Dashboard report exported');
    },
    onError: () => {
      toast.error('Failed to export dashboard report');
    }
  });
}
