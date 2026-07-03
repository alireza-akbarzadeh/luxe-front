'use client';

import { useTranslations } from 'next-intl';

import { UserProfileContent } from '@/components/navbar/user/user-profile-content';
import { UserProfileHeader } from '@/components/navbar/user/user-profile-header';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useProfileDrawerStore } from '@/stores/profile-drawer-store';

/** Single account drawer instance — sits above the mobile bottom tab bar. */
export function ProfileDrawerSheet() {
  const t = useTranslations('nav.userProfile');
  const isOpen = useProfileDrawerStore((state) => state.isOpen);
  const setOpen = useProfileDrawerStore((state) => state.setOpen);

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent variant='ios' radius='full' showHandle className='max-h-[min(88dvh,720px)]'>
        <DrawerTitle className='sr-only'>{t('accountMenu')}</DrawerTitle>
        <UserProfileHeader />
        <div className='overflow-y-auto overscroll-contain pb-[max(env(safe-area-inset-bottom),0.75rem)]'>
          <UserProfileContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
