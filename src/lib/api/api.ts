'use server';

import { cookies } from 'next/headers';
import { BASE_URL } from './api-client';
import { HttpStatus } from '../status';
import { refreshAccessToken } from '@/actions/auth.actions';

export async function apiFetch(input: string, init?: RequestInit) {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get('access_token')?.value;

  const makeRequest = async (token?: string) => {
    return fetch(`${BASE_URL}${input}`, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: token ? `Bearer ${token}` : ''
      }
    });
  };

  let response = await makeRequest(accessToken);

  // token expired
  if (response.status === HttpStatus.Unauthorized) {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      throw new Error('UNAUTHORIZED');
    }

    response = await makeRequest(newAccessToken);
  }

  return response;
}
