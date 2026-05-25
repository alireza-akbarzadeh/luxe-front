import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import type { DtoUserResponse } from '@/services/-auth-login-post.schemas';
import { isAccessTokenExpired, refreshSessionFromCookies } from './auth-refresh';

export interface UserPayload extends DtoUserResponse {
  exp: number;
  iat: number;
}

/**
 * Get the current authenticated user with automatic token refresh
 * Returns null if no valid session exists
 */
export async function getServerUser(options?: {
  forceRefresh?: boolean;
}): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (accessToken && !isAccessTokenExpired(accessToken) && !options?.forceRefresh) {
    try {
      return jwtDecode<UserPayload>(accessToken);
    } catch {
      return null;
    }
  }

  if (refreshToken) {
    const newAccessToken = await refreshSessionFromCookies();

    if (newAccessToken) {
      try {
        return jwtDecode<UserPayload>(newAccessToken);
      } catch {
        return null;
      }
    }
  }

  return null;
}

/**
 * Get the current access token, refreshing if necessary
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (accessToken && !isAccessTokenExpired(accessToken)) {
    return accessToken;
  }

  if (refreshToken) {
    return refreshSessionFromCookies();
  }

  return null;
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  return user !== null;
}

export async function requireAuth(): Promise<UserPayload> {
  const user = await getServerUser();

  if (!user) {
    throw new Error('Unauthorized - Please log in');
  }

  return user;
}

export async function getUserId(): Promise<number | null> {
  const user = await getServerUser();
  return user?.id || null;
}
