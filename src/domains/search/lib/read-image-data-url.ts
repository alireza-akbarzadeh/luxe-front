const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

/** Reads a user-selected image file as a base64 data URL (max 5 MB). */
export function readImageDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!ALLOWED_TYPES.has(file.type)) {
      reject(new Error('unsupported_type'));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      reject(new Error('too_large'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string' || !result.startsWith('data:')) {
        reject(new Error('read_failed'));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error('read_failed'));
    reader.readAsDataURL(file);
  });
}
