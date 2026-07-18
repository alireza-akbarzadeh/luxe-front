import * as XLSX from 'xlsx';

import type {
  ExcelPreviewRow,
  ExcelWorkbookPreview
} from '@/components/excel-import/excel-import.types';

const DEFAULT_MAX_PREVIEW_ROWS = 500;

function cellToString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

function pickSheetName(workbook: XLSX.WorkBook, preferredSheetName?: string): string {
  if (preferredSheetName) {
    const match = workbook.SheetNames.find(
      (name) => name.toLowerCase() === preferredSheetName.toLowerCase()
    );
    if (match) return match;
  }
  const first = workbook.SheetNames[0];
  if (!first) {
    throw new Error('Workbook has no sheets');
  }
  return first;
}

/**
 * Parse an .xlsx File in the browser into headers + data rows for review UIs.
 * Prefers `preferredSheetName` when present (case-insensitive), else the first sheet.
 */
export async function parseExcelWorkbook(
  file: File,
  options?: {
    preferredSheetName?: string;
    maxRows?: number;
  }
): Promise<ExcelWorkbookPreview> {
  const maxRows = options?.maxRows ?? DEFAULT_MAX_PREVIEW_ROWS;
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheetName = pickSheetName(workbook, options?.preferredSheetName);
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  const matrix = XLSX.utils.sheet_to_json<(string | number | boolean | Date | null)[]>(sheet, {
    header: 1,
    defval: '',
    raw: false,
    blankrows: false
  });

  if (matrix.length === 0) {
    throw new Error('Sheet is empty');
  }

  const headerCells = matrix[0] ?? [];
  const headers = headerCells.map((cell, index) => {
    const label = cellToString(cell);
    return label || `column_${index + 1}`;
  });

  if (headers.every((header) => header.startsWith('column_'))) {
    throw new Error('Missing header row');
  }

  const dataMatrix = matrix.slice(1, 1 + maxRows);
  const rows: ExcelPreviewRow[] = [];

  for (let i = 0; i < dataMatrix.length; i++) {
    const cells = dataMatrix[i] ?? [];
    const values: Record<string, string> = {};
    let hasValue = false;

    for (let col = 0; col < headers.length; col++) {
      const key = headers[col]!;
      const text = cellToString(cells[col]);
      values[key] = text;
      if (text) hasValue = true;
    }

    if (!hasValue) continue;

    rows.push({
      __row: i + 2, // Excel row number (1-based header)
      values
    });
  }

  if (rows.length === 0) {
    throw new Error('No data rows found (expected header + at least one row)');
  }

  return { sheetName, headers, rows };
}
