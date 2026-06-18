'use client';

import {
  IconDownload,
  IconFileSpreadsheet,
  IconUpload
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { usePostAdminImportProducts } from '@/services/-admin-import-products-post';
import type { DtoImportRowResult } from '@/services/-admin-import-products-post.schemas';
import { getAdminImportTemplateEntity } from '@/services/-admin-import-template-{entity}-get';
import { getGetProductsQueryKey } from '@/services/-products-get';

interface ProductImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductImportDialog({ open, onOpenChange }: ProductImportDialogProps) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<DtoImportRowResult[]>([]);
  const [summary, setSummary] = useState<{ created?: number; failed?: number; skipped?: number }>(
    {}
  );

  const importMutation = usePostAdminImportProducts({
    mutation: {
      onSuccess: (response) => {
        const data = response.data;
        setRows(data?.rows ?? []);
        setSummary({
          created: data?.created,
          failed: data?.failed,
          skipped: data?.skipped
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

  const reset = () => {
    setFile(null);
    setRows([]);
    setSummary({});
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await getAdminImportTemplateEntity('products', { responseType: 'blob' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'products-import-template.xlsx';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Could not download template');
    }
  };

  const handleImport = () => {
    if (!file) {
      toast.error('Choose an Excel file first');
      return;
    }

    importMutation.mutate({ data: { file } });
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={handleOpenChange}
      title='Import products from Excel'
      description='Upload a .xlsx file using the template columns: name, sku, price, stock, and optional catalog fields.'
      size='lg'
    >
      <Flex direction='column' spacing={4}>
        <Flex direction='row' wrap='wrap' spacing={2}>
          <Button type='button' variant='outline' onClick={handleDownloadTemplate}>
            <IconDownload className='size-4' />
            Download template
          </Button>
          <Button type='button' variant='outline' onClick={() => inputRef.current?.click()}>
            <IconUpload className='size-4' />
            Choose file
          </Button>
          <input
            ref={inputRef}
            type='file'
            accept='.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            className='sr-only'
            onChange={(event) => {
              const next = event.target.files?.[0] ?? null;
              setFile(next);
              setRows([]);
              setSummary({});
            }}
          />
        </Flex>

        <div
          className={cn(
            'rounded-lg border border-dashed p-6 text-center',
            file ? 'border-primary/40 bg-primary/5' : 'border-border'
          )}
        >
          <IconFileSpreadsheet className='text-muted-foreground mx-auto mb-2 size-8' />
          {file ? (
            <Flex direction='column' spacing={1} align='center'>
              <p className='text-sm font-medium'>{file.name}</p>
              <p className='text-muted-foreground text-xs'>
                {(file.size / 1024).toFixed(1)} KB · Excel workbook
              </p>
            </Flex>
          ) : (
            <p className='text-muted-foreground text-sm'>
              Select a .xlsx file or download the template to get started.
            </p>
          )}
        </div>

        {(summary.created !== undefined || rows.length > 0) && (
          <Flex direction='column' spacing={2}>
            <Flex direction='row' spacing={2} wrap='wrap'>
              <Badge variant='secondary'>Created: {summary.created ?? 0}</Badge>
              <Badge variant='outline'>Failed: {summary.failed ?? 0}</Badge>
              <Badge variant='outline'>Skipped: {summary.skipped ?? 0}</Badge>
            </Flex>
            {rows.length > 0 && (
              <ScrollArea className='max-h-56 rounded-lg border'>
                <div className='divide-y p-2'>
                  {rows.map((row) => (
                    <Flex
                      key={`${row.row}-${row.name}`}
                      direction='row'
                      align='center'
                      justify='between'
                      className='py-2 text-sm'
                    >
                      <span>
                        Row {row.row}: {row.name ?? '—'}
                      </span>
                      <Badge
                        variant={
                          row.status === 'created'
                            ? 'default'
                            : row.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {row.status}
                      </Badge>
                    </Flex>
                  ))}
                </div>
              </ScrollArea>
            )}
          </Flex>
        )}

        <Flex direction='row' justify='end' spacing={2}>
          <Button type='button' variant='outline' onClick={() => handleOpenChange(false)}>
            Close
          </Button>
          <Button
            type='button'
            onClick={handleImport}
            disabled={!file || importMutation.isPending}
          >
            {importMutation.isPending ? 'Importing…' : 'Import products'}
          </Button>
        </Flex>
      </Flex>
    </AppDialog>
  );
}
