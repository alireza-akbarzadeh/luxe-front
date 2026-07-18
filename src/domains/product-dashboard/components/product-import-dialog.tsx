'use client';

import { IconDownload, IconFileSpreadsheet, IconUpload } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { downloadBlobExport } from '@/lib/download-blob-export';
import { cn } from '@/lib/utils';
import { usePostAdminImportProducts } from '@/services/-admin-import-products-post';
import type { DtoImportRowResult } from '@/services/-admin-import-products-post.schemas';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<DtoImportRowResult[]>([]);
  const [summary, setSummary] = useState<{ created?: number; failed?: number; skipped?: number }>(
    {}
  );
  const [isDownloading, setIsDownloading] = useState(false);

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
      preferDialog
      title='Import products from Excel'
      description='Download the template, fill the Products sheet, then upload the .xlsx. Column order must match exactly.'
      size='xl'
      className='gap-3 p-5 sm:max-w-4xl'
      contentClassName='py-0'
    >
      <Flex direction='column' spacing={3}>
        <Flex direction='row' wrap='wrap' spacing={2}>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => void handleDownloadTemplate()}
            disabled={isDownloading}
          >
            <IconDownload className='size-4' />
            {isDownloading ? 'Downloading…' : 'Download template'}
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => inputRef.current?.click()}
          >
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

        <div className='border-border overflow-hidden rounded-lg border'>
          <Flex
            direction='row'
            justify='between'
            align='center'
            className='bg-muted/40 border-b px-3 py-2'
          >
            <Typography.Text className='text-sm font-medium'>Template columns</Typography.Text>
            <Typography.Muted className='text-xs'>Gold headers are required</Typography.Muted>
          </Flex>
          <div className='max-h-52 overflow-y-auto overscroll-contain'>
            <table className='w-full text-start text-sm'>
              <thead className='bg-muted/30 text-muted-foreground sticky top-0 z-10 text-xs uppercase backdrop-blur-sm'>
                <tr>
                  <th className='px-3 py-2 font-medium'>Column</th>
                  <th className='px-3 py-2 font-medium'>Need</th>
                  <th className='px-3 py-2 font-medium'>Notes</th>
                  <th className='px-3 py-2 font-medium'>Example</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {PRODUCT_IMPORT_COLUMNS.map((column) => (
                  <tr key={column.key} className='align-top'>
                    <td className='px-3 py-2 font-mono text-xs'>{column.key}</td>
                    <td className='px-3 py-2'>
                      <Badge variant={column.required ? 'default' : 'outline'}>
                        {column.required ? 'required' : 'optional'}
                      </Badge>
                    </td>
                    <td className='text-muted-foreground px-3 py-2 text-xs'>
                      {column.description}
                    </td>
                    <td className='text-muted-foreground px-3 py-2 font-mono text-xs'>
                      {column.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={cn(
            'rounded-lg border border-dashed px-4 py-3 text-center',
            file ? 'border-primary/40 bg-primary/5' : 'border-border'
          )}
        >
          <Flex direction='row' align='center' justify='center' gap={3}>
            <IconFileSpreadsheet className='text-muted-foreground size-6 shrink-0' />
            {file ? (
              <Flex direction='column' spacing={0} className='min-w-0 text-start'>
                <Typography.Text className='truncate text-sm font-medium'>
                  {file.name}
                </Typography.Text>
                <Typography.Muted className='text-xs'>
                  {(file.size / 1024).toFixed(1)} KB · ready to import
                </Typography.Muted>
              </Flex>
            ) : (
              <Typography.Muted className='text-start text-xs'>
                Select a .xlsx built from the template. Keep the Products header order; use existing
                category / brand / store IDs.
              </Typography.Muted>
            )}
          </Flex>
        </div>

        {(summary.created !== undefined || rows.length > 0) && (
          <Flex direction='column' spacing={2}>
            <Flex direction='row' spacing={2} wrap='wrap'>
              <Badge variant='secondary'>Created: {summary.created ?? 0}</Badge>
              <Badge variant='outline'>Failed: {summary.failed ?? 0}</Badge>
              <Badge variant='outline'>Skipped: {summary.skipped ?? 0}</Badge>
            </Flex>
            {rows.length > 0 && (
              <div className='max-h-36 overflow-y-auto rounded-lg border'>
                <div className='divide-y p-2'>
                  {rows.map((row) => (
                    <Flex
                      key={`${row.row}-${row.name}-${row.status}`}
                      direction='row'
                      align='center'
                      justify='between'
                      className='gap-3 py-2 text-sm'
                    >
                      <Flex direction='column' spacing={1} className='min-w-0'>
                        <span>
                          Row {row.row}: {row.name ?? '—'}
                        </span>
                        {row.error ? (
                          <span className='text-destructive text-xs'>{row.error}</span>
                        ) : null}
                      </Flex>
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
              </div>
            )}
          </Flex>
        )}

        <Flex direction='row' justify='end' spacing={2} className='pt-3'>
          <Button type='button' variant='outline' onClick={() => handleOpenChange(false)}>
            Close
          </Button>
          <Button type='button' onClick={handleImport} disabled={!file || importMutation.isPending}>
            {importMutation.isPending ? 'Importing…' : 'Import products'}
          </Button>
        </Flex>
      </Flex>
    </AppDialog>
  );
}
