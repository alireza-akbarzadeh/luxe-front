import { postUploadsPresign } from '@/services/-uploads-presign-post';

/**
 * Uploads a brand logo file via R2 presigned PUT and returns the public URL.
 */
export async function uploadBrandLogo(file: File): Promise<string> {
  const presign = await postUploadsPresign({
    content_type: file.type || 'image/jpeg',
    filename: file.name,
    purpose: 'brand'
  });

  const uploadUrl = presign.data?.upload_url;
  const publicUrl = presign.data?.public_url;

  if (!uploadUrl || !publicUrl) {
    throw new Error('Logo upload is not configured on the server.');
  }

  const response = await fetch(uploadUrl, {
    method: presign.data?.method ?? 'PUT',
    headers: { 'Content-Type': file.type || 'image/jpeg' },
    body: file
  });

  if (!response.ok) {
    throw new Error(`Failed to upload ${file.name}`);
  }

  return publicUrl;
}
