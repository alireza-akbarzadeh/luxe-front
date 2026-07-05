import { APP_BUILD_ID } from '@/lib/app-version';

export const LOADED_BUILD_STORAGE_KEY = 'luxe:loaded-build-id';

/** Build id the user has acknowledged (reload or fresh deploy load). */
export function getAcknowledgedBuildId(): string {
  if (typeof window === 'undefined') {
    return APP_BUILD_ID;
  }
  try {
    return sessionStorage.getItem(LOADED_BUILD_STORAGE_KEY) ?? APP_BUILD_ID;
  } catch {
    return APP_BUILD_ID;
  }
}

/** Mark a remote deploy as loaded so update prompts stop until the next publish. */
export function acknowledgeRemoteBuild(buildId: string): void {
  if (typeof window === 'undefined' || !buildId) {
    return;
  }
  try {
    sessionStorage.setItem(LOADED_BUILD_STORAGE_KEY, buildId);
  } catch {
    // Private browsing — prompt may reappear after reload.
  }
}

/** Acknowledge latest manifest and hard-reload (cache-busted) to pick up PWA assets. */
export function applyAppUpdate(remoteBuildId?: string): void {
  if (remoteBuildId) {
    acknowledgeRemoteBuild(remoteBuildId);
  }

  const url = new URL(window.location.href);
  url.searchParams.set('_v', String(Date.now()));
  window.location.replace(url.toString());
}
