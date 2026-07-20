export const TRANSACTIONS_TAB_VALUES = ['payments', 'wallet'] as const;
export type TransactionsTab = (typeof TRANSACTIONS_TAB_VALUES)[number];

export const PAYMENT_STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' }
] as const;

export type PaymentStatusFilter = (typeof PAYMENT_STATUS_TABS)[number]['value'];

export const WALLET_TYPE_TABS = [
  { value: 'all', label: 'All types' },
  { value: 'deposit', label: 'Deposits' },
  { value: 'payment', label: 'Payments' },
  { value: 'refund', label: 'Refunds' },
  { value: 'adjustment', label: 'Adjustments' },
  { value: 'membership', label: 'Membership' }
] as const;

export type WalletTypeFilter = (typeof WALLET_TYPE_TABS)[number]['value'];
