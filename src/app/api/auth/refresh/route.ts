import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '@/actions/auth.actions';

export async function POST(_req: NextRequest) {
  const newToken = await refreshAccessToken();
  if (newToken) {
    return NextResponse.json({ access_token: newToken });
  }
  return NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
}
