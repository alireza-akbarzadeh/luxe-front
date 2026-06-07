// ─── FormData builder (fully typed) ──────────────────────────────────────────

import type { MediaFile, ProductFormValues } from '@/domains/product-dashboard/prodcut-schema';

export function buildFormData(values: ProductFormValues): FormData {
  const fd = new FormData();
  const { images, attributes, tags, channels, publishedAt, ...scalars } = values;

  // Scalar fields
  (Object.keys(scalars) as (keyof typeof scalars)[]).forEach((key) => {
    const val = scalars[key];
    if (val === null || val === undefined) return;
    fd.append(key, String(val));
  });

  // Arrays serialized as JSON
  fd.append('attributes', JSON.stringify(attributes));
  fd.append('tags', JSON.stringify(tags));
  fd.append('channels', JSON.stringify(channels));

  // Date
  if (publishedAt instanceof Date) {
    fd.append('publishedAt', publishedAt.toISOString());
  }

  // Images — typed as MediaFile[]
  images.forEach((img: MediaFile, i: number) => {
    if (img.file instanceof File) {
      fd.append(`images[${i}][file]`, img.file, img.file.name);
    }
    fd.append(`images[${i}][alt]`, img.alt);
    fd.append(`images[${i}][isThumbnail]`, String(img.isThumbnail));
    fd.append(`images[${i}][id]`, img.id);
  });

  return fd;
}
