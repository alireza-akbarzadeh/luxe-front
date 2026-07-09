import { redirect } from 'next/navigation';

/** Legacy menu path — campaigns live under promotions. */
export default function LegacyCampaignsPage() {
  redirect('/dashboard/promotions/campaigns');
}
