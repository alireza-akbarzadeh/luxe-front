'use client';

import { useEffect, useState } from 'react';

import { getAcknowledgedBuildId } from '@/lib/app-update';
import { APP_VERSION } from '@/lib/app-version';

export type RemoteAppVersion = {
  version: string;
  buildId: string;
  builtAt?: string;
};

export type AppVersionCheck = {
  currentVersion: string;
  currentBuildId: string;
  acknowledgedBuildId: string;
  remote: RemoteAppVersion | null;
  hasUpdate: boolean;
  isLoading: boolean;
};

/**
 * Compares the acknowledged session build against public/version.json (latest deploy).
 */
export function useRemoteAppVersion(): AppVersionCheck {
  const [remote, setRemote] = useState<RemoteAppVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [acknowledgedBuildId] = useState(() => getAcknowledgedBuildId());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(`/version.json?${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) {
          return;
        }
        const manifest = (await response.json()) as RemoteAppVersion;
        if (!cancelled && manifest.version && manifest.buildId) {
          setRemote(manifest);
        }
      } catch {
        // Offline or blocked — keep current build only.
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasUpdate = remote != null && remote.buildId !== acknowledgedBuildId;

  return {
    currentVersion: APP_VERSION,
    currentBuildId: acknowledgedBuildId,
    acknowledgedBuildId,
    remote,
    hasUpdate,
    isLoading
  };
}
