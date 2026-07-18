/** Column metadata for template guides and header hints. */
export type ExcelImportColumn = {
  key: string;
  required?: boolean;
  description?: string;
  example?: string;
};

/** One data row from a parsed workbook (string cells + Excel row number). */
export type ExcelPreviewRow = {
  __row: number;
  values: Record<string, string>;
};

/** Client-side preview of an uploaded .xlsx file. */
export type ExcelWorkbookPreview = {
  sheetName: string;
  headers: string[];
  rows: ExcelPreviewRow[];
};

/** Per-row outcome returned by the import API. */
export type ExcelImportResultRow = {
  row?: number;
  name?: string;
  status?: string;
  error?: string;
};

/** Aggregate import summary after submit. */
export type ExcelImportResult = {
  created?: number;
  failed?: number;
  skipped?: number;
  rows?: ExcelImportResultRow[];
};
