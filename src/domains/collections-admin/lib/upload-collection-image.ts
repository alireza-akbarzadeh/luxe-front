import { postUploadsPresign } from '@/services/-uploads-presign-post';

/** Uploads a collection hero image via R2 presigned PUT and returns the public URL. */
export async function uploadCollectionImage(file: File): Promise<string> {
  const presign = await postUploadsPresign({
    content_type: file.type || 'image/jpeg',
    filename: file.name,
    purpose: 'media'
  });

  const uploadUrl = presign.data?.upload_url;
  const publicUrl = presign.data?.public_url;

  if (!uploadUrl || !publicUrl) {
    throw new Error('Image upload is not configured on the server.');
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
