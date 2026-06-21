'use server';

import { cookies } from 'next/headers';

import {
  guestPreferenceCookieName,
  guestPreferenceValue
} from '@/lib/auth/guest-preference';

/** Remember guest choice and send the shopper to the storefront home. */
export async function continueAsGuestAction(): Promise<{ redirectTo: string }> {
  const cookieStore = await cookies();
  cookieStore.set(guestPreferenceCookieName, guestPreferenceValue, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  });

  return { redirectTo: '/' };
}
