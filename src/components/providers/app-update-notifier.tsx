'use client';

import { useSerwist } from '@serwist/turbopack/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { APP_BUILD_ID } from '@/lib/app-version';

const POLL_MS = 5 * 60 * 1000;
const LOADED_BUILD_STORAGE_KEY = 'luxe:loaded-build-id';

type VersionManifest = {
  buildId?: string;
};

/**
 * Notifies when a new PWA deploy is available (service worker update or version.json drift).
 */
export function AppUpdateNotifier() {
  const t = useTranslations('common');
  const { serwist } = useSerwist();
  const notifiedRef = useRef(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(LOADED_BUILD_STORAGE_KEY, APP_BUILD_ID);
    } catch {
      // Private browsing — polling still works for this session.
    }
  }, []);

  useEffect(() => {
    const notifyUpdate = () => {
      if (notifiedRef.current) {
        return;
      }
      notifiedRef.current = true;

      toast.info(t('updateAvailable.title'), {
        description: t('updateAvailable.description'),
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: t('updateAvailable.reload'),
          onClick: () => window.location.reload()
        }
      });
    };

    const checkRemoteVersion = async () => {
      try {
        const response = await fetch(`/version.json?${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        const manifest = (await response.json()) as VersionManifest;
        const loadedBuildId = sessionStorage.getItem(LOADED_BUILD_STORAGE_KEY) ?? APP_BUILD_ID;

        if (manifest.buildId && manifest.buildId !== loadedBuildId) {
          notifyUpdate();
        }
      } catch {
        // Offline or blocked — skip until next poll.
      }
    };

    void checkRemoteVersion();
    const intervalId = window.setInterval(() => void checkRemoteVersion(), POLL_MS);

    return () => window.clearInterval(intervalId);
  }, [t]);

  useEffect(() => {
    if (!serwist) {
      return;
    }

    const notifyUpdate = () => {
      if (notifiedRef.current) {
        return;
      }
      notifiedRef.current = true;

      toast.info(t('updateAvailable.title'), {
        description: t('updateAvailable.description'),
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: t('updateAvailable.reload'),
          onClick: () => window.location.reload()
        }
      });
    };

    const onControlling = (event: { isUpdate?: boolean }) => {
      if (event.isUpdate) {
        notifyUpdate();
      }
    };

    serwist.addEventListener('controlling', onControlling);
    return () => serwist.removeEventListener('controlling', onControlling);
  }, [serwist, t]);

  return null;
}
