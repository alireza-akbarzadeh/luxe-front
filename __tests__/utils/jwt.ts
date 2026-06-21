/**
 * Builds unsigned JWT-shaped strings for unit tests (jwt-decode only reads the payload).
 */
export function createMockJwt(payload: Record<string, unknown>): string {
  const encode = (value: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(value))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.sig`;
}

/** JWT whose `exp` is `offsetMs` milliseconds from now. */
export function createJwtExpiringIn(offsetMs: number): string {
  return createMockJwt({ exp: Math.floor((Date.now() + offsetMs) / 1000) });
}
