'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * YouTube-style offline / back-online toasts for the PWA shell.
 */
export function ConnectivityNotifier() {
  const t = useTranslations('common');
  const offlineToastIdRef = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    const showOffline = () => {
      offlineToastIdRef.current = toast.warning(t('offline.title'), {
        description: t('offline.description'),
        duration: Number.POSITIVE_INFINITY
      });
    };

    const showOnline = () => {
      if (offlineToastIdRef.current !== undefined) {
        toast.dismiss(offlineToastIdRef.current);
        offlineToastIdRef.current = undefined;
      }
      toast.success(t('online.title'), { duration: 4000 });
    };

    if (!navigator.onLine) {
      showOffline();
    }

    window.addEventListener('offline', showOffline);
    window.addEventListener('online', showOnline);

    return () => {
      window.removeEventListener('offline', showOffline);
      window.removeEventListener('online', showOnline);
    };
  }, [t]);

  return null;
}
