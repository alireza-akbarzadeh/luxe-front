import { redirect } from 'next/navigation';

export default function LegacyAuditSettingsPage() {
  redirect('/dashboard/audit-logs');
}
