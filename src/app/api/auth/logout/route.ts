import { NextRequest, NextResponse } from 'next/server';

import { revokeServerSession } from '@/actions/auth.actions';
import { clearAuthCookiesOnResponse } from '@/lib/auth/auth-cookies';

export async function POST(_req: NextRequest) {
  await revokeServerSession();

  return clearAuthCookiesOnResponse(NextResponse.json({ success: true }));
}
