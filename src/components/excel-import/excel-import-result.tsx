'use client';

import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';

import type { ExcelImportResult } from './excel-import.types';

type ExcelImportResultPanelProps = {
  result: ExcelImportResult;
};

/** Compact post-submit summary badges (per-row UI lives in the preview grid). */
export function ExcelImportResultPanel({ result }: ExcelImportResultPanelProps) {
  return (
    <Flex direction='row' spacing={2} wrap='wrap' align='center'>
      <Badge variant='default' className='bg-emerald-600 hover:bg-emerald-600'>
        Success: {result.created ?? 0}
      </Badge>
      <Badge variant='destructive'>Failed: {result.failed ?? 0}</Badge>
      <Badge variant='secondary'>Skipped: {result.skipped ?? 0}</Badge>
    </Flex>
  );
}
