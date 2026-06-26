'use client';

import { createContext, useContext } from 'react';

interface VendorOnboardingContextValue {
  isAuthenticated: boolean;
  userEmail?: string;
}

const VendorOnboardingContext = createContext<VendorOnboardingContextValue | null>(null);

export function VendorOnboardingProvider({
  isAuthenticated,
  userEmail,
  children
}: VendorOnboardingContextValue & { children: React.ReactNode }) {
  return (
    <VendorOnboardingContext value={{ isAuthenticated, userEmail }}>
      {children}
    </VendorOnboardingContext>
  );
}

export function useVendorOnboardingContext() {
  const ctx = useContext(VendorOnboardingContext);
  if (!ctx) {
    throw new Error('useVendorOnboardingContext must be used within VendorOnboardingProvider');
  }
  return ctx;
}
