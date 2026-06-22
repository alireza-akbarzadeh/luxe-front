'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { usePwaInstall } from '@/lib/pwa/use-pwa-install';

import { IosInstallGuide } from './ios-install-guide';
import { PlatformCard } from './platform-card';

export function PwaInstallCard({ recommended }: { recommended: boolean }) {
  const t = useTranslations('platforms.cards.pwa');
  const {
    canInstall,
    isInstalled,
    needsManualInstall,
    promptInstall,
    installError
  } = usePwaInstall();
  const [iosGuideOpen, setIosGuideOpen] = useState(false);

  const onInstall = async () => {
    if (needsManualInstall) {
      setIosGuideOpen(true);
      return;
    }

    if (!canInstall) {
      toast.error(t('unsupported'));
      return;
    }

    try {
      await promptInstall();
    } catch {
      toast.error(t('installFailed'));
    }
  };

  return (
    <>
      <PlatformCard
        icon={<span className='text-lg'>PWA</span>}
        title={t('title')}
        description={t('description')}
        badge={
          isInstalled
            ? t('installed')
            : recommended
              ? t('recommended')
              : needsManualInstall
                ? t('iosManual')
                : undefined
        }
        recommended={recommended}
        actionLabel={isInstalled ? t('openWeb') : t('install')}
        href={isInstalled ? '/shop' : undefined}
        onAction={isInstalled ? undefined : () => void onInstall()}
        helperText={installError ?? (canInstall || needsManualInstall ? undefined : t('unsupported'))}
      />
      <IosInstallGuide
        open={iosGuideOpen}
        onOpenChange={setIosGuideOpen}
        title={t('iosGuide.title')}
        description={t('iosGuide.description')}
        steps={[t('iosGuide.step1'), t('iosGuide.step2'), t('iosGuide.step3')]}
      />
    </>
  );
}
