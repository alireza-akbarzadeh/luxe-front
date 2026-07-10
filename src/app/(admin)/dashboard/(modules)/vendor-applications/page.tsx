import { redirect } from 'next/navigation';

export default function VendorApplicationsRedirectPage() {
  redirect('/dashboard/vendors?status=pending');
}
