import { NextResponse } from 'next/server';

import { getAccessToken } from '@/lib/auth/auth-server';

/**
 * Returns a valid access token for client-side API calls.
 * Silently refreshes using the httpOnly refresh_token cookie when needed.
 */
export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ access_token: accessToken });
}
