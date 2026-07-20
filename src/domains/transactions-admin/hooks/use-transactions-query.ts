import { parseAsStringEnum, useQueryState } from 'nuqs';

import type {
  PaymentStatusFilter,
  TransactionsTab,
  WalletTypeFilter
} from '@/domains/transactions-admin/transactions.schema';
import {
  PAYMENT_STATUS_TABS,
  TRANSACTIONS_TAB_VALUES,
  WALLET_TYPE_TABS
} from '@/domains/transactions-admin/transactions.schema';

const PAYMENT_STATUS_VALUES = PAYMENT_STATUS_TABS.map((tab) => tab.value);
const WALLET_TYPE_VALUES = WALLET_TYPE_TABS.map((tab) => tab.value);

/** URL-synced filters for the admin transactions hub. */
export function useTransactionsQueryState() {
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringEnum<TransactionsTab>([...TRANSACTIONS_TAB_VALUES]).withDefault('payments')
  );

  const [paymentStatus, setPaymentStatus] = useQueryState(
    'paymentStatus',
    parseAsStringEnum<PaymentStatusFilter>(PAYMENT_STATUS_VALUES).withDefault('all')
  );

  const [walletType, setWalletType] = useQueryState(
    'walletType',
    parseAsStringEnum<WalletTypeFilter>(WALLET_TYPE_VALUES).withDefault('all')
  );

  return { tab, setTab, paymentStatus, setPaymentStatus, walletType, setWalletType };
}
