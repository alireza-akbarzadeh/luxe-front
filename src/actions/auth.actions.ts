'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { BASE_URL } from '@/lib/api/api-client';
import { getCallbackUrl } from '@/lib/utils';
import type { DtoRegisterResponse } from '@/services/-auth-register-post.schemas';
import { clearAuthCookies, setAuthCookies } from '~/src/lib/auth/auth-helpers';
import { refreshSessionFromCookies } from '~/src/lib/auth/auth-refresh';

export interface AuthSessionItem {
  id: number;
  user_agent: string;
  ip_address: string;
  last_used_at: string;
  created_at: string;
  is_current: boolean;
}

function isNextRedirectError(error: unknown): error is { digest: string } {
  return (
    error !== null &&
    typeof error === 'object' &&
    'digest' in error &&
    typeof (error as { digest: string }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  );
}

async function getClientRequestHeaders(): Promise<Record<string, string>> {
  const headersList = await headers();

  return {
    'Content-Type': 'application/json',
    ...(headersList.get('user-agent') ? { 'User-Agent': headersList.get('user-agent')! } : {}),
    ...(headersList.get('x-forwarded-for')
      ? { 'X-Forwarded-For': headersList.get('x-forwarded-for')! }
      : {}),
    ...(headersList.get('x-real-ip') ? { 'X-Real-IP': headersList.get('x-real-ip')! } : {})
  };
}

async function getAuthorizedHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  return {
    ...(await getClientRequestHeaders()),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
  };
}

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

async function resolvePostAuthRedirect(
  formData?: FormData,
  defaultRedirect = '/account'
): Promise<string> {
  const fromForm = formData?.get('callbackUrl');
  if (typeof fromForm === 'string' && fromForm.startsWith('/')) {
    return getCallbackUrl(fromForm);
  }

  const fromReferer = await getCallbackUrlFromReferer();
  if (fromReferer) {
    return getCallbackUrl(fromReferer);
  }

  return defaultRedirect;
}

async function handleAuthResponse<
  T extends {
    success?: boolean;
    message?: string;
    data?: { access_token?: string; refresh_token?: string };
  }
>(
  response: Response,
  json: T,
  rememberMe = false,
  formData?: FormData,
  defaultRedirect = '/account'
): Promise<{ error: string } | void> {
  if (!response.ok || !json.success) {
    return { error: json.message || 'Authentication failed' };
  }

  const { access_token, refresh_token } = json.data ?? {};

  if (!access_token || !refresh_token) {
    return { error: 'Invalid response from authentication server' };
  }

  await setAuthCookies(access_token, refresh_token, rememberMe);

  const callbackUrl = await resolvePostAuthRedirect(formData, defaultRedirect);
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
      headers: await getClientRequestHeaders(),
      body: JSON.stringify({ email, password })
    });

    const json = (await res.json()) as DtoRegisterResponse;
    const error = await handleAuthResponse(res, json, rememberMe, formData);
    if (error) return error;
  } catch (error) {
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
      headers: await getClientRequestHeaders(),
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone
      })
    });

    const json = (await res.json()) as DtoRegisterResponse;
    const error = await handleAuthResponse(res, json);
    if (error) return error;
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }
    console.error('Registration error:', error);
    return { error: 'An unexpected error occurred during registration' };
  }
}

export async function forgotPasswordAction(
  email: string
): Promise<{ success: boolean; error?: string }> {
  if (!email) {
    return { success: false, error: 'Email is required' };
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: await getClientRequestHeaders(),
      body: JSON.stringify({ email })
    });

    const json = (await res.json()) as { success?: boolean; message?: string };

    if (!res.ok || !json.success) {
      return { success: false, error: json.message ?? 'Unable to send reset email' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Unable to send reset email' };
  }
}

export async function resetPasswordAction(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!token || !newPassword) {
    return { success: false, error: 'Token and new password are required' };
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: await getClientRequestHeaders(),
      body: JSON.stringify({ token, new_password: newPassword })
    });

    const json = (await res.json()) as { success?: boolean; message?: string };

    if (!res.ok || !json.success) {
      return { success: false, error: json.message ?? 'Unable to reset password' };
    }

    await clearAuthCookies();
    return { success: true };
  } catch {
    return { success: false, error: 'Unable to reset password' };
  }
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!currentPassword || !newPassword) {
    return { success: false, error: 'Current and new passwords are required' };
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: await getAuthorizedHeaders(),
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    });

    const json = (await res.json()) as { success?: boolean; message?: string };

    if (!res.ok || !json.success) {
      return { success: false, error: json.message ?? 'Unable to change password' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Unable to change password' };
  }
}

export async function verifyEmailAction(
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (!token) {
    return { success: false, error: 'Verification token is required' };
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: await getClientRequestHeaders(),
      cache: 'no-store'
    });

    const json = (await res.json()) as { success?: boolean; message?: string };

    if (!res.ok || !json.success) {
      return { success: false, error: json.message ?? 'Email verification failed' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Email verification failed' };
  }
}

export async function sendVerificationEmailAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/send-verification`, {
      method: 'POST',
      headers: await getAuthorizedHeaders()
    });

    const json = (await res.json()) as { success?: boolean; message?: string };

    if (!res.ok || !json.success) {
      return { success: false, error: json.message ?? 'Unable to send verification email' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Unable to send verification email' };
  }
}

export async function revokeServerSession(): Promise<void> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (refreshToken) {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: await getAuthorizedHeaders(),
        body: JSON.stringify({ refresh_token: refreshToken })
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }
  }

  await clearAuthCookies();
}

export async function logoutAction() {
  try {
    await revokeServerSession();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    redirect('/login');
  }
}

export async function getAuthSessionsAction(): Promise<AuthSessionItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/auth/sessions`, {
      method: 'GET',
      headers: await getAuthorizedHeaders(),
      cache: 'no-store'
    });

    if (!res.ok) return [];

    const json = (await res.json()) as {
      success?: boolean;
      data?: { sessions?: AuthSessionItem[] };
    };

    return json.data?.sessions ?? [];
  } catch {
    return [];
  }
}

export async function revokeAuthSessionAction(sessionId: number): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: await getAuthorizedHeaders()
    });

    return { success: res.ok };
  } catch {
    return { success: false };
  }
}

export async function revokeOtherSessionsAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    const res = await fetch(`${BASE_URL}/auth/sessions`, {
      method: 'DELETE',
      headers: await getAuthorizedHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken ?? '' })
    });

    return { success: res.ok };
  } catch {
    return { success: false };
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    return await refreshSessionFromCookies();
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!accessToken && !refreshToken) {
    return false;
  }

  if (!accessToken && refreshToken) {
    const newAccessToken = await refreshAccessToken();
    return newAccessToken !== null;
  }

  return true;
}
