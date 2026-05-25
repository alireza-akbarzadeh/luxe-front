'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { setAuthCookies, clearAuthCookies } from '@/lib/auth-helpers';
import type { DtoRegisterResponse } from '@/services/-auth-register-post.schemas';
import type { DtoRefreshResponse } from '@/services/-auth-refresh-post.schemas';
import { BASE_URL } from '@/lib/api/api-client';

function isNextRedirectError(error: unknown): error is { digest: string } {
  return (
    error !== null &&
    typeof error === 'object' &&
    'digest' in error &&
    typeof (error as { digest: string }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  );
}

/**
 * Get callback URL from referer header
 */
async function getCallbackUrlFromReferer(): Promise<string | null> {
  const headersList = await headers();
  const referer = headersList.get('referer');
  if (!referer) return null;

  try {
    const url = new URL(referer);
    return url.searchParams.get('callbackUrl');
  } catch {
    return null;
  }
}

/**
 * Generic handler for authentication responses
 */
async function handleAuthResponse<
  T extends {
    success?: boolean;
    message?: string;
    data?: { access_token?: string; refresh_token?: string };
  }
>(response: Response, json: T, rememberMe = false): Promise<{ error: string } | void> {
  if (!response.ok || !json.success) {
    return { error: json.message || 'Authentication failed' };
  }

  const { access_token, refresh_token } = json.data ?? {};

  if (!access_token || !refresh_token) {
    return { error: 'Invalid response from authentication server' };
  }

  await setAuthCookies(access_token, refresh_token, rememberMe);

  const callbackUrl = (await getCallbackUrlFromReferer()) || '/account';
  redirect(callbackUrl);
}

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const rememberMe = formData.get('rememberMe') === 'true';

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const json = (await res.json()) as DtoRegisterResponse;
    const error = await handleAuthResponse(res, json, rememberMe);
    if (error) return error;
  } catch (error) {
    // Rethrow Next.js redirect errors so the framework can handle them
    if (isNextRedirectError(error)) {
      throw error;
    }
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred during login' };
  }
}

export async function registerAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = (formData.get('phone') as string) || undefined;

    if (!email || !password || !firstName || !lastName) {
      return { error: 'All required fields must be filled' };
    }

    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone
      }),
      credentials: 'include'
    });

    const json = (await res.json()) as DtoRegisterResponse;
    const error = await handleAuthResponse(res, json);
    if (error) return error;
  } catch (error) {
    // Rethrow Next.js redirect errors
    if (isNextRedirectError(error)) {
      throw error;
    }
    console.error('Registration error:', error);
    return { error: 'An unexpected error occurred during registration' };
  }
}

/**
 * Logout action
 */
export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (refreshToken) {
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
          credentials: 'include'
        });
      } catch (error) {
        // Ignore network errors – still clear local cookies
        console.error('Logout request failed:', error);
      }
    }

    await clearAuthCookies();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    redirect('/login');
  }
}

/**
 * Refresh access token
 * This is primarily used by the API client interceptor
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      console.log('No refresh token cookie');
      return null;
    }

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: 'include'
    });

    if (!res.ok) {
      console.log(`Refresh failed with status ${res.status}`);
      // Only clear if the backend rejects the refresh token
      if (res.status === 401 || res.status === 403) {
        console.log('Refresh token invalid, clearing cookies');
        await clearAuthCookies();
      }
      return null;
    }

    const json = (await res.json()) as DtoRefreshResponse;
    const accessToken = json.data?.access_token;

    if (!accessToken) {
      console.log('No access token in response');
      return null;
    }

    // Update access token cookie
    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60
    });

    console.log('Refresh successful, new access token set');
    return accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    // Network errors – do NOT clear cookies
    return null;
  }
}
/**
 * Validate current session
 */
export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!accessToken && !refreshToken) {
    return false;
  }

  // If only refresh token exists, try to get a new access token
  if (!accessToken && refreshToken) {
    const newAccessToken = await refreshAccessToken();
    return newAccessToken !== null;
  }

  return true;
}
