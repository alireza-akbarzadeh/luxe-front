import type {
  DtoAdminWalletTxListItem,
  GetAdminWalletTransactions200
} from '@/services/-admin-wallet-transactions-get.schemas';

/** Extract wallet ledger rows from the admin list response. */
export function getWalletTxFromListResponse(
  data: GetAdminWalletTransactions200 | undefined
): DtoAdminWalletTxListItem[] {
  return data?.data?.transactions ?? [];
}

/** Extract total count for server pagination. */
export function getWalletTxTotalFromListResponse(
  data: GetAdminWalletTransactions200 | undefined
): number | undefined {
  const total = data?.data?.total;
  return typeof total === 'number' ? total : undefined;
}
