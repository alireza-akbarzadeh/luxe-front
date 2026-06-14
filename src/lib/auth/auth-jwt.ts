import { jwtDecode } from 'jwt-decode';

const TOKEN_EXPIRY_BUFFER_MS = 30_000;

export function isAccessTokenExpired(token: string, bufferMs = TOKEN_EXPIRY_BUFFER_MS): boolean {
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    return (decoded.exp ?? 0) * 1000 < Date.now() + bufferMs;
  } catch {
    return true;
  }
}
