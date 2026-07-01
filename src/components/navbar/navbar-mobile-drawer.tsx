'use client';

import { motion } from 'framer-motion';

import { MobileNav } from '@/components/navbar/mobile-nav';
import type { DtoNavItemResponse } from '@/services/-nav-menus-get.schemas';

const NAVBAR_HEIGHT = 64;

type NavbarMobileDrawerProps = Readonly<{
  navMenus: DtoNavItemResponse[] | undefined;
  onClose: () => void;
}>;

/** Mobile nav drawer — loaded only when the menu opens to keep the initial navbar bundle small. */
export function NavbarMobileDrawer({ navMenus, onClose }: NavbarMobileDrawerProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden'
        style={{ top: NAVBAR_HEIGHT }}
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
        className='bg-background fixed bottom-0 left-0 z-50 w-[min(88vw,360px)] lg:hidden'
        style={{ top: NAVBAR_HEIGHT }}
        role='dialog'
        aria-modal='true'
      >
        <MobileNav navMenus={navMenus} onNavigateAction={onClose} />
      </motion.div>
    </>
  );
}
