'use client';

import { VendorAssistantRoot } from '@/domains/vendor/assistant/components/vendor-assistant-root';

/** Client boundary for vendor marketing layout — mounts the landing assistant FAB. */
export function VendorAssistantLandingSlot() {
  return <VendorAssistantRoot variant='landing' />;
}
