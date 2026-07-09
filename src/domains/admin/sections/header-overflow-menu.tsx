'use client';

import { IconDotsVertical } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { AdminShellPanel } from '@/domains/admin/components/admin-shell-panel';
import { ADMIN_SHELL_DRAWER_MAX_WIDTH } from '@/domains/admin/lib/admin-shell-breakpoints';
import { HeaderOverflowMenuContent } from '@/domains/admin/sections/header-overflow-menu-content';
import { useAdminShellStore } from '@/domains/admin/stores/admin-shell-store';
import { useMediaDevices } from '@/hooks/useMediaDevices';

/** Mobile/tablet overflow — period, quick actions, theme when header is tight. */
export function HeaderOverflowMenu() {
  const t = useTranslations('adminShell.header');
  const { width } = useMediaDevices();
  const useDrawerShell = width == null || width <= ADMIN_SHELL_DRAWER_MAX_WIDTH;
  const isOpen = useAdminShellStore((state) => state.overflowMenuOpen);
  const setOverflowMenuOpen = useAdminShellStore((state) => state.setOverflowMenuOpen);

  return (
    <AdminShellPanel
      open={isOpen}
      onOpenChange={setOverflowMenuOpen}
      title={t('moreActions')}
      desktopSurface='dropdown'
      dropdownClassName='w-56 rounded-xl p-1'
      trigger={
        <Button
          size='icon'
          variant='ghost'
          className='h-9 w-9 shrink-0 rounded-xl md:hidden'
          aria-label={t('moreActions')}
        >
          <IconDotsVertical className='size-5' />
        </Button>
      }
    >
      <HeaderOverflowMenuContent
        variant={useDrawerShell ? 'drawer' : 'dropdown'}
        onClose={() => setOverflowMenuOpen(false)}
      />
    </AdminShellPanel>
  );
}
