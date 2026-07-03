'use client';

import { usePathname } from 'next/navigation';

import { useShoppingAssistantStore } from '../store/shopping-assistant.store';
import { ShoppingAssistantFab, ShoppingAssistantSheet } from './shopping-assistant-sheet';

const HIDDEN_PATH_PREFIXES = ['/checkout'];

/** Site-wide shopping assistant FAB + sheet; hidden on checkout. */
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
