import { customInstance } from '@/lib/api/api-client';
import type { UtilsResponse } from '@/services/-wallet-deposit-post.schemas';

/** Receipt returned after confirming a Stripe wallet deposit session. */
export type WalletDepositReceipt = {
  amount?: number;
  balance_after?: number;
  currency?: string;
  paid_at?: string;
  status?: string;
  stripe_session_id?: string;
  transaction_id?: number;
};

export type ConfirmWalletDepositResponse = {
  balance?: number;
  currency?: string;
  receipt?: WalletDepositReceipt;
};

export type PostWalletDepositConfirmStripe200 = UtilsResponse & {
  data?: ConfirmWalletDepositResponse;
};

/** Confirms wallet deposit after Stripe redirect (idempotent; also works if webhook already ran). */
export async function postWalletDepositConfirmStripe(sessionId: string) {
  return customInstance<PostWalletDepositConfirmStripe200>({
    url: '/wallet/deposit/confirm-stripe',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: { session_id: sessionId }
  });
}
