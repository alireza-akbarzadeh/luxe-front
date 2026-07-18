'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { ExcelImportDialog, type ExcelImportResult } from '@/components/excel-import';
import { downloadBlobExport } from '@/lib/download-blob-export';
import { usePostAdminImportProducts } from '@/services/-admin-import-products-post';
import { getAdminImportTemplateEntity } from '@/services/-admin-import-template-{entity}-get';
import { getGetProductsQueryKey } from '@/services/-products-get';

import { PRODUCT_IMPORT_COLUMNS } from '../lib/product-import-columns';

interface ProductImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function downloadProductImportTemplate() {
  const blob = await getAdminImportTemplateEntity('products', {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    skipToast: true
  });

  if (!(blob instanceof Blob)) {
    throw new Error('Unexpected template response');
  }

  // Failed API responses with responseType:blob come back as JSON blobs.
  if (blob.type.includes('json') || blob.size < 64) {
    const text = await blob.text();
    let message = 'Could not download template';
    try {
      const parsed = JSON.parse(text) as { message?: string; error?: string };
      message = parsed.message || parsed.error || message;
    } catch {
      // keep default
    }
    throw new Error(message);
  }

  downloadBlobExport(blob, 'luxe-products-import-template.xlsx');
}

export function ProductImportDialog({ open, onOpenChange }: ProductImportDialogProps) {
  const queryClient = useQueryClient();
  const [result, setResult] = useState<ExcelImportResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const importMutation = usePostAdminImportProducts({
    mutation: {
      onSuccess: (response) => {
        const data = response.data;
        setResult({
          created: data?.created,
          failed: data?.failed,
          skipped: data?.skipped,
          rows: data?.rows
        });
        void queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
        toast.success('Import finished', {
          description: `${data?.created ?? 0} created, ${data?.failed ?? 0} failed`
        });
      },
      onError: () => {
        toast.error('Import failed', {
          description: 'Could not import products from the spreadsheet.'
        });
      }
    }
  });

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await downloadProductImportTemplate();
      toast.success('Template downloaded', {
        description: 'Use the Products sheet header exactly as provided.'
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not download template');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ExcelImportDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Import products from Excel'
      description='Download the template, fill the Products sheet, review the preview grid, then import.'
      preferredSheetName='Products'
      columns={PRODUCT_IMPORT_COLUMNS}
      columnGuideNote='Gold headers are required · column order must match'
      emptyHint='Select a .xlsx built from the template. Keep the Products header order; use existing category / brand / store IDs.'
      submitLabel='Import products'
      isSubmitting={importMutation.isPending}
      onSubmit={(file) => importMutation.mutate({ data: { file } })}
      onDownloadTemplate={handleDownloadTemplate}
      isDownloadingTemplate={isDownloading}
      result={result}
      onResetResult={() => setResult(null)}
    />
  );
}
