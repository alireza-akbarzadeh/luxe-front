'use client';

import { IconEyeOff } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Switch } from '@/components/ui/switch';
import { Typography } from '@/components/ui/typography';
import { usePrivateShoppingStore } from '@/stores/private-shopping-store';

/** Account toggle for private shopping mode (limits personalization rails). */
export function PrivateShoppingPanel() {
  const t = useTranslations('privateShopping');
  const enabled = usePrivateShoppingStore((s) => s.enabled);
  const setEnabled = usePrivateShoppingStore((s) => s.setEnabled);

  return (
    <div className='bg-card border-border rounded-2xl border p-6 sm:p-7'>
      <Flex direction='row' align='start' justify='between' spacing={4}>
        <Flex direction='row' align='start' spacing={3} className='min-w-0 flex-1'>
          <Flex align='center' justify='center' className='bg-muted size-10 shrink-0 rounded-lg'>
            <IconEyeOff className='text-muted-foreground size-5' />
          </Flex>
          <Flex direction='column' spacing={1} className='min-w-0'>
            <Typography.H3 className='text-lg font-semibold tracking-tight'>
              {t('title')}
            </Typography.H3>
            <Typography.Muted className='text-sm'>{t('description')}</Typography.Muted>
          </Flex>
        </Flex>
        <Switch checked={enabled} onCheckedChange={setEnabled} aria-label={t('toggleLabel')} />
      </Flex>
      {enabled ? (
        <Typography.Muted className='text-accent mt-4 text-sm' role='status'>
          {t('activeHint')}
        </Typography.Muted>
      ) : null}
    </div>
  );
}
