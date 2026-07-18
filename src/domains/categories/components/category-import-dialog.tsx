'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { ExcelImportDialog, type ExcelImportResult } from '@/components/excel-import';
import { downloadBlobExport } from '@/lib/download-blob-export';
import { usePostAdminImportCategories } from '@/services/-admin-import-categories-post';
import { getAdminImportTemplateEntity } from '@/services/-admin-import-template-{entity}-get';
import { getGetCategoriesQueryKey } from '@/services/-categories-get';

import { CATEGORY_IMPORT_COLUMNS } from '../lib/category-import-columns';

interface CategoryImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function downloadCategoryImportTemplate() {
  const blob = await getAdminImportTemplateEntity('categories', {
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    skipToast: true
  });

  if (!(blob instanceof Blob)) {
    throw new Error('Unexpected template response');
  }

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

  downloadBlobExport(blob, 'luxe-categories-import-template.xlsx');
}

export function CategoryImportDialog({ open, onOpenChange }: CategoryImportDialogProps) {
  const queryClient = useQueryClient();
  const [result, setResult] = useState<ExcelImportResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const importMutation = usePostAdminImportCategories({
    mutation: {
      onSuccess: (response) => {
        const data = response.data;
        setResult({
          created: data?.created,
          failed: data?.failed,
          skipped: data?.skipped,
          rows: data?.rows
        });
        void queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
        toast.success('Import finished', {
          description: `${data?.created ?? 0} created, ${data?.failed ?? 0} failed`
        });
      },
      onError: () => {
        toast.error('Import failed', {
          description: 'Could not import categories from the spreadsheet.'
        });
      }
    }
  });

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await downloadCategoryImportTemplate();
      toast.success('Template downloaded');
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
      title='Import categories from Excel'
      description='Download the template, fill the sheet, review the preview grid, then import.'
      preferredSheetName='Categories'
      columns={CATEGORY_IMPORT_COLUMNS}
      emptyHint='Select a .xlsx with columns: name, slug, description, parent_id, is_active.'
      submitLabel='Import categories'
      isSubmitting={importMutation.isPending}
      onSubmit={(file) => importMutation.mutate({ data: { file } })}
      onDownloadTemplate={handleDownloadTemplate}
      isDownloadingTemplate={isDownloading}
      result={result}
      onResetResult={() => setResult(null)}
    />
  );
}
