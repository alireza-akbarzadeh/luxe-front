import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import type { DtoUserResponse } from '@/services/-auth-login-post.schemas';
import { BASE_URL } from './api/api-client';
import type { DtoRefreshResponseData } from '@/services/-auth-refresh-post.schemas';
import { APP_CONFIG } from '@/lib/config';

export interface UserPayload extends DtoUserResponse {
  exp: number;
  iat: number;
}

/**
 * Check if a JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<UserPayload>(token);
    // Add 30-second buffer to account for clock skew
    return decoded.exp * 1000 < Date.now() + 30000;
  } catch {
    return true;
  }
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: 'include'
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as DtoRefreshResponseData;
    const newAccessToken = data?.access_token;

    if (newAccessToken) {
      const cookieStore = await cookies();
      cookieStore.set('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge:APP_CONFIG.MAX_AGE
      });

      return newAccessToken;
    }

    return null;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    return null;
  }
}

/**
 * Get the current authenticated user with automatic token refresh
 * Returns null if no valid session exists
 *
 * @param options.forceRefresh - Force a token refresh even if the current token is valid
 */
export async function getServerUser(options?: {
  forceRefresh?: boolean;
}): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  // No tokens at all
  if (!accessToken && !refreshToken) {
    return null;
  }

  // Access token exists and is valid (not expired)
  if (accessToken && !isTokenExpired(accessToken) && !options?.forceRefresh) {
    try {
      return jwtDecode<UserPayload>(accessToken);
    } catch {
      return null;
    }
  }

  // Access token expired or forced refresh, try to refresh
  if (refreshToken) {
    const newAccessToken = await refreshAccessToken(refreshToken);

    if (newAccessToken) {
      try {
        return jwtDecode<UserPayload>(newAccessToken);
      } catch {
        return null;
      }
    }
  }

  // Refresh failed or no refresh token
  return null;
}

/**
 * Get the current access token, refreshing if necessary
 * Returns null if no valid session exists
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  if (refreshToken) {
    return await refreshAccessToken(refreshToken);
  }

  return null;
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  return user !== null;
}

/**
 * Require authentication - throws an error if not authenticated
 * Use this in Server Actions or API routes that require authentication
 */
export async function requireAuth(): Promise<UserPayload> {
  const user = await getServerUser();

  if (!user) {
    throw new Error('Unauthorized - Please log in');
  }

  return user;
}

/**
 * Get user ID from the current session
 */
export async function getUserId(): Promise<number | null> {
  const user = await getServerUser();
  return user?.id || null;
}
