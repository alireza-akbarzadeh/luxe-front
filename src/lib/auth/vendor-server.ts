import { BASE_URL } from '@/lib/api/api-client';
import { getAccessToken, type UserPayload } from '@/lib/auth/auth-server';

import type { VendorStoreSummary } from '../api/vendor-stores';

interface VendorStoresApiResponse {
  data?: VendorStoreSummary[];
}

/** Fetch vendor stores for the current session (server components / layouts). */
export async function getServerVendorStores(): Promise<VendorStoreSummary[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const response = await fetch(`${BASE_URL}/vendor/stores`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) return [];

    const json = (await response.json()) as VendorStoresApiResponse;
    return json.data ?? [];
  } catch {
    return [];
  }
}

export function isVendorPanelAdmin(user: UserPayload): boolean {
  return user.role === 'admin' || user.role === 'moderator';
}
