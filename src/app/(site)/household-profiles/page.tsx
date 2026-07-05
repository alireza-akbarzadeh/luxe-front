import type { Metadata } from 'next';

import { HouseholdProfilesDomain } from '@/domains/household-profiles/household-profiles.domain';

export const metadata: Metadata = {
  title: 'Household Profiles — Luxe',
  description: 'Save household member preferences and get personalized product picks for everyone.'
};

export default function HouseholdProfilesPage() {
  return <HouseholdProfilesDomain />;
}
