'use client';

import { useSyncExternalStore } from 'react';

import { getPlatformInfo,type PlatformInfo } from './detect-platform';

const EMPTY_PLATFORM: PlatformInfo = {
  isIos: false,
  isAndroid: false,
  isSafari: false
};

/** Stable snapshot for useSyncExternalStore — UA is static for a session. */
let clientSnapshot: PlatformInfo = EMPTY_PLATFORM;

function subscribePlatform() {
  return () => {};
}

function getClientPlatform(): PlatformInfo {
  if (typeof navigator === 'undefined') return EMPTY_PLATFORM;

  const next = getPlatformInfo(navigator.userAgent);
  if (
    clientSnapshot.isIos === next.isIos &&
    clientSnapshot.isAndroid === next.isAndroid &&
    clientSnapshot.isSafari === next.isSafari
  ) {
    return clientSnapshot;
  }

  clientSnapshot = next;
  return clientSnapshot;
}

function getServerPlatform(): PlatformInfo {
  return EMPTY_PLATFORM;
}

/** Client platform flags from user agent (SSR-safe, no render loop). */
export function usePlatformInfo(): PlatformInfo {
  return useSyncExternalStore(subscribePlatform, getClientPlatform, getServerPlatform);
}
