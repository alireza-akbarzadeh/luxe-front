import type { MediaFile } from '@/domains/product-dashboard/product-schema';
import { postUploadsPresign } from '@/services/-uploads-presign-post';

/**
 * Uploads new product image files via R2 presigned PUT and returns public URLs
 * in display order (thumbnail first when flagged).
 */
export async function uploadProductImages(images: MediaFile[]): Promise<string[]> {
  const sorted = [...images].sort(
    (a, b) => Number(b.isThumbnail) - Number(a.isThumbnail)
  );

  const urls: string[] = [];

  for (const image of sorted) {
    if (image.file instanceof File) {
      const presign = await postUploadsPresign({
        content_type: image.file.type || 'image/jpeg',
        filename: image.file.name,
        purpose: 'product'
      });

      const uploadUrl = presign.data?.upload_url;
      const publicUrl = presign.data?.public_url;

      if (!uploadUrl || !publicUrl) {
        throw new Error('Image upload is not configured on the server.');
      }

      const response = await fetch(uploadUrl, {
        method: presign.data?.method ?? 'PUT',
        headers: { 'Content-Type': image.file.type || 'image/jpeg' },
        body: image.file
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${image.file.name}`);
      }

      urls.push(publicUrl);
      continue;
    }

    if (image.previewUrl.startsWith('http')) {
      urls.push(image.previewUrl);
    }
  }

  return urls;
}
