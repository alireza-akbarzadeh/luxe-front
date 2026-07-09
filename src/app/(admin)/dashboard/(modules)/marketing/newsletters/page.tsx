import { redirect } from 'next/navigation';

export default function LegacyNewslettersPage() {
  redirect('/dashboard/marketing/subscribers');
}
