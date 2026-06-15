// hooks/useStoreShare.ts
'use client';

import { copyToClipboard } from '@/lib/utils';

export function useSharing(slug: string, name: string) {
  const share = async () => {
    const url = `${window.location.origin}/store/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name} on our store!`,
          url
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          await copyToClipboard(url, 'Link');
        }
      }
    } else {
      await copyToClipboard(url, 'Link');
    }
  };

  return { share };
}
