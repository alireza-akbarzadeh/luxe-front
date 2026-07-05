'use client';

import { useSerwist } from '@serwist/turbopack/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import {
  acknowledgeRemoteBuild,
  applyAppUpdate,
  getAcknowledgedBuildId,
  LOADED_BUILD_STORAGE_KEY
} from '@/lib/app-update';
import { APP_BUILD_ID } from '@/lib/app-version';

const POLL_MS = 5 * 60 * 1000;

type VersionManifest = {
  buildId?: string;
  version?: string;
};

/**
 * Notifies when a new PWA deploy is available (service worker update or version.json drift).
 */
export function AppUpdateNotifier() {
  const t = useTranslations('common');
  const { serwist } = useSerwist();
  const notifiedRef = useRef(false);
  const remoteBuildIdRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(LOADED_BUILD_STORAGE_KEY)) {
        sessionStorage.setItem(LOADED_BUILD_STORAGE_KEY, APP_BUILD_ID);
      }
    } catch {
      // Private browsing — polling still works for this session.
    }
  }, []);

  useEffect(() => {
    const showUpdateToast = (remoteBuildId: string) => {
      if (notifiedRef.current) {
        return;
      }
      if (remoteBuildId === getAcknowledgedBuildId()) {
        return;
      }

      notifiedRef.current = true;
      remoteBuildIdRef.current = remoteBuildId;

      toast.info(t('updateAvailable.title'), {
        id: 'app-update',
        description: t('updateAvailable.description'),
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: t('updateAvailable.reload'),
          onClick: () => applyAppUpdate(remoteBuildIdRef.current ?? remoteBuildId)
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
        if (manifest.buildId && manifest.buildId !== getAcknowledgedBuildId()) {
          showUpdateToast(manifest.buildId);
        } else {
          toast.dismiss('app-update');
          notifiedRef.current = false;
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

    const onControlling = (event: { isUpdate?: boolean }) => {
      if (!event.isUpdate) {
        return;
      }

      const remoteBuildId = remoteBuildIdRef.current;
      if (remoteBuildId) {
        acknowledgeRemoteBuild(remoteBuildId);
      }

      toast.info(t('updateAvailable.title'), {
        id: 'app-update',
        description: t('updateAvailable.description'),
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: t('updateAvailable.reload'),
          onClick: () => applyAppUpdate(remoteBuildId ?? undefined)
        }
      });
    };

    serwist.addEventListener('controlling', onControlling);
    return () => serwist.removeEventListener('controlling', onControlling);
  }, [serwist, t]);

  return null;
}
