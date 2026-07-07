import { describe, expect, it, vi } from 'vitest';

import { loginAction } from '@/actions/auth.actions';

describe('loginAction', () => {
  it('returns a friendly error when the auth endpoint returns an empty body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected end of JSON input'))
      })
    );

    const result = await loginAction(new FormData());

    expect(result).toEqual({
      error: 'The authentication server returned an empty or invalid response.'
    });
  });
});
