'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import type { ExcelWorkbookPreview } from '@/components/excel-import/excel-import.types';
import { parseExcelWorkbook } from '@/lib/excel/parse-workbook';

type UseExcelPreviewOptions = {
  preferredSheetName?: string;
  maxRows?: number;
};

/**
 * Client-side Excel preview state for import review UIs.
 * Parses the file when selected and exposes loading / error / clear helpers.
 */
export function useExcelPreview(options?: UseExcelPreviewOptions) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ExcelWorkbookPreview | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const clear = () => {
    setFile(null);
    setPreview(null);
    setParseError(null);
    setIsParsing(false);
  };

  const loadFile = async (next: File | null) => {
    if (!next) {
      clear();
      return;
    }

    setFile(next);
    setPreview(null);
    setParseError(null);
    setIsParsing(true);

    try {
      const parsed = await parseExcelWorkbook(next, {
        preferredSheetName: options?.preferredSheetName,
        maxRows: options?.maxRows
      });
      setPreview(parsed);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not read Excel file';
      setParseError(message);
      setPreview(null);
      toast.error('Invalid Excel file', { description: message });
    } finally {
      setIsParsing(false);
    }
  };

  return {
    file,
    preview,
    isParsing,
    parseError,
    loadFile,
    clear
  };
}
