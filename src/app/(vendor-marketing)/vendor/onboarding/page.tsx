import { redirect } from 'next/navigation';

/** Alias for seller onboarding — same flow as /vendor/apply. */
export default function VendorOnboardingPage() {
  redirect('/vendor/apply');
}
