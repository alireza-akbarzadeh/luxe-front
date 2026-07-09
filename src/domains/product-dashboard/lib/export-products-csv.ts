import type { DtoProductWithLike } from '@/services/-products-get.schemas';

/** Builds a CSV blob from the current product rows and triggers download. */
export function downloadProductsCsv(products: DtoProductWithLike[], filename = 'products.csv') {
  const headers = ['id', 'name', 'sku', 'price', 'stock', 'category', 'created_at'];
  const rows = products.map((product) =>
    [
      product.id,
      escapeCsv(product.name),
      escapeCsv(product.sku),
      product.price ?? 0,
      product.stock ?? 0,
      escapeCsv(product.category?.name),
      product.created_at ?? ''
    ].join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

function escapeCsv(value: string | undefined | null) {
  const text = value ?? '';
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}
