'use client';

import { usePathname } from 'next/navigation';

import { ShoppingAssistantFab } from '~/src/domains/shopping-assistant/components/shopping-assistant-fab';

import { useShoppingAssistantStore } from '../store/shopping-assistant.store';
import { ShoppingAssistantSheet } from './shopping-assistant-sheet';

const HIDDEN_PATH_PREFIXES = ['/checkout', '/cart', '/product/'];

/** Site-wide shopping assistant FAB + sheet; hidden where sticky bottom bars already exist. */
export function ShoppingAssistantRoot() {
  const pathname = usePathname();
  const isOpen = useShoppingAssistantStore((state) => state.isOpen);
  const setOpen = useShoppingAssistantStore((state) => state.setOpen);

  const hideFab = HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  return (
    <>
      {hideFab ? null : <ShoppingAssistantFab onClick={() => setOpen(true)} />}
      <ShoppingAssistantSheet open={isOpen} onOpenChange={setOpen} />
    </>
  );
}
