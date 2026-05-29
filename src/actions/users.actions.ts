'use server';

import { apiFetch } from '@/lib/api/api';
import { getServerUser } from '@/lib/auth-server';

export async function getClientUser() {
  return await getServerUser();
}

export async function getProfile() {
  const res = await apiFetch('/me');

  return res.json();
}
