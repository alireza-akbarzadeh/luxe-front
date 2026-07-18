'use client';

import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import type { ExcelImportResultRow, ExcelWorkbookPreview } from './excel-import.types';

type ExcelPreviewGridProps = {
  preview: ExcelWorkbookPreview;
  requiredKeys?: string[];
  /** Import API outcomes keyed by Excel row number — paints success / error UI. */
  resultRows?: ExcelImportResultRow[];
  className?: string;
  maxHeightClassName?: string;
};

function rowStatusClass(status?: string): string {
  switch (status) {
    case 'created':
      return 'bg-emerald-500/10 hover:bg-emerald-500/15 data-[state=selected]:bg-emerald-500/10';
    case 'failed':
      return 'bg-destructive/10 hover:bg-destructive/15 data-[state=selected]:bg-destructive/10';
    case 'skipped':
      return 'bg-muted/60 hover:bg-muted/80';
    default:
      return '';
  }
}

function StatusBadge({ status, error }: { status?: string; error?: string }) {
  if (!status) return <span className='text-muted-foreground/50'>—</span>;

  const variant =
    status === 'created' ? 'default' : status === 'failed' ? 'destructive' : 'secondary';

  return (
    <Flex direction='column' spacing={1} className='min-w-0'>
      <Badge variant={variant} className='w-fit capitalize'>
        {status === 'created' ? 'success' : status}
      </Badge>
      {error ? (
        <span className='text-destructive max-w-48 text-xs whitespace-normal' title={error}>
          {error}
        </span>
      ) : null}
    </Flex>
  );
}

/** Read-only spreadsheet preview so users can review rows before / after import. */
export function ExcelPreviewGrid({
  preview,
  requiredKeys = [],
  resultRows,
  className,
  maxHeightClassName = 'max-h-[min(50dvh,28rem)]'
}: ExcelPreviewGridProps) {
  const required = new Set(requiredKeys.map((key) => key.toLowerCase()));
  const outcomeByRow = new Map(
    (resultRows ?? [])
      .filter((row): row is ExcelImportResultRow & { row: number } => typeof row.row === 'number')
      .map((row) => [row.row, row])
  );
  const hasResults = outcomeByRow.size > 0;

  return (
    <div className={cn('border-border overflow-hidden rounded-lg border', className)}>
      <Flex
        direction='row'
        justify='between'
        align='center'
        className='bg-muted/40 border-b px-3 py-2'
      >
        <Typography.Text className='text-sm font-medium'>
          {hasResults ? 'Import results' : 'Preview'} · {preview.rows.length} row
          {preview.rows.length === 1 ? '' : 's'}
        </Typography.Text>
        <Typography.Muted className='text-xs'>
          Sheet: {preview.sheetName} · scroll horizontally for all columns
        </Typography.Muted>
      </Flex>
      <div
        className={cn(
          // Single scrollport for both axes (disable nested Table overflow-x wrapper).
          'overflow-auto overscroll-contain [&_[data-slot=table-container]]:overflow-visible',
          maxHeightClassName
        )}
      >
        <Table className='w-max min-w-full'>
          <TableHeader className='bg-muted/40 text-muted-foreground sticky top-0 z-10 text-xs uppercase backdrop-blur-sm'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='bg-muted/40 sticky start-0 z-20 w-12 px-3'>#</TableHead>
              {hasResults ? (
                <TableHead className='bg-muted/40 sticky start-12 z-20 min-w-40 px-3'>
                  Result
                </TableHead>
              ) : null}
              {preview.headers.map((header) => (
                <TableHead
                  key={header}
                  className={cn(
                    'bg-muted/40 px-3',
                    required.has(header.toLowerCase()) && 'text-primary'
                  )}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {preview.rows.map((row) => {
              const outcome = outcomeByRow.get(row.__row);
              return (
                <TableRow
                  key={row.__row}
                  className={cn('align-top', rowStatusClass(outcome?.status))}
                >
                  <TableCell
                    className={cn(
                      'text-muted-foreground sticky start-0 z-10 w-12 px-3 font-mono text-xs',
                      outcome?.status === 'created' && 'bg-emerald-500/10',
                      outcome?.status === 'failed' && 'bg-destructive/10',
                      outcome?.status === 'skipped' && 'bg-muted/60',
                      !outcome && 'bg-background'
                    )}
                  >
                    {row.__row}
                  </TableCell>
                  {hasResults ? (
                    <TableCell
                      className={cn(
                        'sticky start-12 z-10 min-w-40 px-3',
                        outcome?.status === 'created' && 'bg-emerald-500/10',
                        outcome?.status === 'failed' && 'bg-destructive/10',
                        outcome?.status === 'skipped' && 'bg-muted/60',
                        !outcome && 'bg-background'
                      )}
                    >
                      <StatusBadge status={outcome?.status} error={outcome?.error} />
                    </TableCell>
                  ) : null}
                  {preview.headers.map((header) => (
                    <TableCell
                      key={`${row.__row}-${header}`}
                      className='max-w-56 truncate px-3 text-xs'
                      title={row.values[header] || undefined}
                    >
                      {row.values[header] || <span className='text-muted-foreground/50'>—</span>}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
