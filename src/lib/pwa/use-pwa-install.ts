'use client';

import { useEffect, useMemo, useState } from 'react';

import { getPlatformInfo } from '@/lib/pwa/detect-platform';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installError, setInstallError] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [userAgent, setUserAgent] = useState('');

  useEffect(() => {
    setUserAgent(navigator.userAgent);
    setIsInstalled(isStandaloneDisplay());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setInstallError(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const platform = useMemo(() => getPlatformInfo(userAgent), [userAgent]);
  const canInstall = Boolean(deferredPrompt) && !isInstalled;
  const needsManualInstall = platform.isIos && platform.isSafari && !isInstalled && !canInstall;

  const promptInstall = async () => {
    if (!deferredPrompt) {
      setInstallError('Install prompt is not available on this device.');
      return;
    }

    setInstallError(null);
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstalled(true);
      return;
    }

    setInstallError('Install was dismissed.');
  };

  return {
    canInstall,
    isInstalled,
    isIos: platform.isIos,
    isAndroid: platform.isAndroid,
    needsManualInstall,
    installError,
    promptInstall
  };
}
