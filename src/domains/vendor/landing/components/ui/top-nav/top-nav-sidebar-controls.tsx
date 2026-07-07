'use client';

import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMenu
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { cn } from '@/lib/utils';

import { iconButtonClass } from '../constants';

interface TopNavSidebarControlsProps {
  onOpenMobileNav: () => void;
}

export function TopNavSidebarControls({ onOpenMobileNav }: TopNavSidebarControlsProps) {
  const t = useTranslations('vendor.panel.topNav');
  const sidebarCollapsed = useVendorPanelStore((s) => s.sidebarCollapsed);
  const toggleSidebarCollapsed = useVendorPanelStore((s) => s.toggleSidebarCollapsed);

  return (
    <Flex direction='row' align='center' spacing={1} shrink>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn(iconButtonClass, 'md:hidden')}
        aria-label={t('openNavigation')}
        onClick={onOpenMobileNav}
      >
        <IconMenu className='size-5' />
      </Button>

      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn(iconButtonClass, 'hidden md:inline-flex')}
        aria-label={sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
        onClick={toggleSidebarCollapsed}
      >
        {sidebarCollapsed ? (
          <IconLayoutSidebarLeftExpand className='size-5' />
        ) : (
          <IconLayoutSidebarLeftCollapse className='size-5' />
        )}
      </Button>
    </Flex>
  );
}
