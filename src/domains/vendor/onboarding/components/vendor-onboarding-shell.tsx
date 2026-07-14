import { VendorOnboardingShellHeader } from '@/domains/vendor/onboarding/components/vendor-onboarding-shell-header';
import { VendorOnboardingSidebar } from '@/domains/vendor/onboarding/components/vendor-onboarding-sidebar';

interface VendorOnboardingShellProps {
  children: React.ReactNode;
}

/** Split layout for seller onboarding — form column + benefits sidebar. */
export function VendorOnboardingShell({ children }: VendorOnboardingShellProps) {
  return (
    <div className='flex min-h-screen flex-col xl:flex-row'>
      <div className='flex flex-1 flex-col'>
        <VendorOnboardingShellHeader />
        <main className='flex-1'>{children}</main>
      </div>
      <VendorOnboardingSidebar />
    </div>
  );
}
