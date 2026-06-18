import { redirect } from 'next/navigation';

export default function CollectionAdminRedirectPage() {
  redirect('/dashboard/collections');
}
