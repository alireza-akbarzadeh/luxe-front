import type { Metadata } from 'next';

import { ReplenishmentRemindersDomain } from '@/domains/replenishment-reminders/replenishment-reminders.domain';

export const metadata: Metadata = {
  title: 'Replenishment Reminders — Luxe',
  description: 'AI reminders for when to reorder items from your purchase history.'
};

export default function ReplenishmentRemindersPage() {
  return <ReplenishmentRemindersDomain />;
}
