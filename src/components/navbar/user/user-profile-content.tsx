'use client';

import { useTranslations } from 'next-intl';

import { Separator } from '~/src/components/ui/separator';

import { AuthMenuItem } from './auth-menu-item';
import { MenuRow } from './menu-row';
import { ThemeMenuItem } from './theme-menu-item';
import { profileMenuItems } from './user-menu-data';

export function UserProfileContent() {
  const t = useTranslations('nav.userProfile.menu');

  return (
    <div className='p-2'>
      {profileMenuItems.map((item) => {
        const Icon = item.icon;

        return (
          <MenuRow
            href={item.href}
            key={item.key}
            icon={<Icon size={18} />}
            title={t(`${item.key}.title`)}
            subtitle={t(`${item.key}.subtitle`)}
          />
        );
      })}
      <Separator />
      <ThemeMenuItem />
      <AuthMenuItem />
    </div>
  );
}
