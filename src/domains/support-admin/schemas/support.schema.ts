export const SUPPORT_STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Waiting customer', value: 'waiting_customer' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' }
] as const;

export type SupportStatusFilter = (typeof SUPPORT_STATUS_TABS)[number]['value'];

export const SUPPORT_CHANNEL_TABS = [
  { label: 'All channels', value: 'all' },
  { label: 'Email', value: 'email' },
  { label: 'Chat', value: 'chat' },
  { label: 'Web', value: 'web' }
] as const;

export type SupportChannelFilter = (typeof SUPPORT_CHANNEL_TABS)[number]['value'];

export const SUPPORT_STATUS_OPTIONS = [
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Waiting customer', value: 'waiting_customer' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' }
] as const;
