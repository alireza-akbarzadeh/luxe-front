// ---------- Helper: export to CSV ----------
export function exportToCSV<TData>(rows: TData[], columns: { id: string; header: string }[]) {
  if (!rows.length) return;

  // Map each row to a flat object using column ids
  const data = rows.map((row) => {
    const record: Record<string, unknown> = {};
    columns.forEach((col) => {
      // @ts-expect-error - row is generic
      const value = row[col.id];
      record[col.header] = value !== undefined && value !== null ? String(value) : '';
    });
    return record;
  });

  const headers = columns.map((col) => col.header);
  const csvRows = [
    headers.join(','),
    ...data.map((row) => headers.map((header) => JSON.stringify(row[header] ?? '')).join(','))
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `export-${new Date().toISOString()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
