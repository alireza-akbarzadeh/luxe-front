// hooks/useStoreShare.ts
'use client';

import { toast } from 'sonner';

export function useSharing(slug: string, name: string) {
  const share = async () => {
    const url = `${window.location.origin}/stores/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name} on our store!`,
          url
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          // Fallback to clipboard
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard');
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  return { share };
}
