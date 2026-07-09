'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { downloadBlobExport } from '@/lib/download-blob-export';
import { getAdminProductsExport } from '@/services/-admin-products-export-get';
import type { GetAdminProductsExportParams } from '@/services/-admin-products-export-get.schemas';

/** Downloads a server-generated CSV for the current product filters (max 10k rows). */
export function useProductsExport() {
  return useMutation({
    mutationFn: async (params: GetAdminProductsExportParams) => {
      return getAdminProductsExport(params, { responseType: 'blob' });
    },
    onSuccess: (_blob, params) => {
      const stamp = new Date().toISOString().slice(0, 10);
      const suffix = params.status ? `_${params.status}` : '';
      downloadBlobExport(_blob, `products${suffix}_${stamp}.csv`);
      toast.success('Products export started');
    },
    onError: () => {
      toast.error('Failed to export products');
    }
  });
}
