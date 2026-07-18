'use client';

import { IconDownload, IconFileSpreadsheet, IconUpload } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';

import { AppDialog, type AppDialogSize } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useExcelPreview } from '@/hooks/use-excel-preview';
import { cn } from '@/lib/utils';

import { ExcelColumnGuide } from './excel-column-guide';
import type { ExcelImportColumn, ExcelImportResult } from './excel-import.types';
import { ExcelImportResultPanel } from './excel-import-result';
import { ExcelPreviewGrid } from './excel-preview-grid';

const XLSX_ACCEPT = '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export type ExcelImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  size?: AppDialogSize;
  preferDialog?: boolean;
  className?: string;
  /** Expected columns for the template guide (optional). */
  columns?: ExcelImportColumn[];
  columnGuideNote?: string;
  /** Prefer this sheet name when parsing (e.g. "Products"). */
  preferredSheetName?: string;
  emptyHint?: string;
  submitLabel: string;
  submittingLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (file: File) => void;
  onDownloadTemplate?: () => void | Promise<void>;
  isDownloadingTemplate?: boolean;
  /** Set by the parent after a successful import mutation. */
  result?: ExcelImportResult | null;
  /** Clears parent result state when the dialog resets. */
  onResetResult?: () => void;
};

/**
 * Reusable Excel import flow: choose file → client preview grid → confirm submit.
 * Domain dialogs supply template download + API mutation; this shell owns parse/review UI.
 */
export function ExcelImportDialog({
  open,
  onOpenChange,
  title,
  description,
  size = 'full',
  preferDialog = true,
  className,
  columns,
  columnGuideNote,
  preferredSheetName,
  emptyHint = 'Select a .xlsx file built from the template to preview rows before importing.',
  submitLabel,
  submittingLabel = 'Importing…',
  isSubmitting = false,
  onSubmit,
  onDownloadTemplate,
  isDownloadingTemplate = false,
  result,
  onResetResult
}: ExcelImportDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { file, preview, isParsing, loadFile, clear } = useExcelPreview({
    preferredSheetName
  });

  const requiredKeys = (columns ?? []).filter((col) => col.required).map((col) => col.key);
  const canSubmit = Boolean(file && preview && preview.rows.length > 0 && !isParsing);
  const hasResult = Boolean(result);

  const reset = () => {
    clear();
    onResetResult?.();
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleChooseFile = async (next: File | null) => {
    onResetResult?.();
    await loadFile(next);
  };

  const handleSubmit = () => {
    if (!file || !preview) {
      toast.error('Choose an Excel file first');
      return;
    }
    onSubmit(file);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={handleOpenChange}
      preferDialog={preferDialog}
      title={title}
      description={description}
      size={size}
      className={cn('max-h-[min(92dvh,56rem)] gap-3 p-5 sm:max-w-[min(96vw,80rem)]', className)}
      contentClassName='py-0'
    >
      <Flex direction='column' spacing={3}>
        <Flex direction='row' wrap='wrap' spacing={2} align='center' justify='between'>
          <Flex direction='row' wrap='wrap' spacing={2}>
            {onDownloadTemplate ? (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => void onDownloadTemplate()}
                disabled={isDownloadingTemplate}
              >
                <IconDownload className='size-4' />
                {isDownloadingTemplate ? 'Downloading…' : 'Download template'}
              </Button>
            ) : null}
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => inputRef.current?.click()}
              disabled={isParsing || isSubmitting}
            >
              <IconUpload className='size-4' />
              {preview ? 'Change file' : 'Choose file'}
            </Button>
            <input
              ref={inputRef}
              type='file'
              accept={XLSX_ACCEPT}
              className='sr-only'
              onChange={(event) => {
                const next = event.target.files?.[0] ?? null;
                void handleChooseFile(next);
              }}
            />
          </Flex>
          {hasResult && result ? <ExcelImportResultPanel result={result} /> : null}
        </Flex>

        {!preview && columns && columns.length > 0 ? (
          <ExcelColumnGuide columns={columns} note={columnGuideNote} />
        ) : null}

        <div
          className={cn(
            'rounded-lg border border-dashed px-4 py-2.5',
            file ? 'border-primary/40 bg-primary/5' : 'border-border'
          )}
        >
          <Flex direction='row' align='center' gap={3}>
            <IconFileSpreadsheet className='text-muted-foreground size-5 shrink-0' />
            {file ? (
              <Flex direction='column' spacing={0} className='min-w-0 text-start'>
                <Typography.Text className='truncate text-sm font-medium'>
                  {file.name}
                </Typography.Text>
                <Typography.Muted className='text-xs'>
                  {(file.size / 1024).toFixed(1)} KB
                  {isParsing
                    ? ' · reading…'
                    : preview
                      ? ` · ${preview.rows.length} rows ready to review`
                      : ''}
                </Typography.Muted>
              </Flex>
            ) : (
              <Typography.Muted className='text-start text-xs'>{emptyHint}</Typography.Muted>
            )}
          </Flex>
        </div>

        {preview ? (
          <ExcelPreviewGrid
            preview={preview}
            requiredKeys={requiredKeys}
            resultRows={result?.rows}
          />
        ) : null}

        <Flex direction='row' justify='end' spacing={2} className='border-t pt-3'>
          <Button type='button' variant='outline' onClick={() => handleOpenChange(false)}>
            Close
          </Button>
          <Button type='button' onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? submittingLabel : hasResult ? 'Import again' : submitLabel}
          </Button>
        </Flex>
      </Flex>
    </AppDialog>
  );
}
