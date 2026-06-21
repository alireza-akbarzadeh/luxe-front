import { describe, expect, it } from 'vitest';

import {
  guestPreferenceValue,
  isGuestPreference
} from '@/lib/auth/guest-preference';

describe('guest-preference', () => {
  it('recognizes the continue-as-guest cookie value', () => {
    expect(isGuestPreference(guestPreferenceValue)).toBe(true);
    expect(isGuestPreference(undefined)).toBe(false);
    expect(isGuestPreference('other')).toBe(false);
  });
});
