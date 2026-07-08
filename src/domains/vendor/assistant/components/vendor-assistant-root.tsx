'use client';

import { VendorAssistantFab } from '@/domains/vendor/assistant/components/vendor-assistant-fab';
import { VendorAssistantSheet } from '@/domains/vendor/assistant/components/vendor-assistant-sheet';
import { useVendorAssistantStore } from '@/domains/vendor/assistant/store/vendor-assistant.store';
import type { VendorAssistantVariant } from '@/domains/vendor/assistant/types/vendor-assistant.types';

interface VendorAssistantRootProps {
  variant: VendorAssistantVariant;
}

/** Vendor landing + panel AI assistant FAB and sheet. */
export function VendorAssistantRoot({ variant }: VendorAssistantRootProps) {
  const isOpen = useVendorAssistantStore((state) => state.isOpen);
  const setOpen = useVendorAssistantStore((state) => state.setOpen);

  return (
    <>
      <VendorAssistantFab onClick={() => setOpen(true)} />
      <VendorAssistantSheet open={isOpen} onOpenChange={setOpen} variant={variant} />
    </>
  );
}
