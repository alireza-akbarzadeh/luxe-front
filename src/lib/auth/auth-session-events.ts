/** Client-side auth session change notifications (login, refresh, logout). */
export const AUTH_SESSION_CHANGED_EVENT = 'luxe:auth-session-changed';

export function notifyAuthSessionChanged(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_CHANGED_EVENT));
}
