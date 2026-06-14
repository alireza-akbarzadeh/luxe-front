import { describe, expect, it } from 'vitest';

import { formatPrice } from '@/domains/home/lib/home-utils';

describe('formatPrice', () => {
  it('formats whole-dollar amounts', () => {
    expect(formatPrice(129)).toBe('$129');
    expect(formatPrice(1299)).toBe('$1,299');
  });

  it('returns $0 for undefined or NaN', () => {
    expect(formatPrice(undefined)).toBe('$0');
    expect(formatPrice(Number.NaN)).toBe('$0');
  });

  it('rounds fractional cents to whole dollars', () => {
    expect(formatPrice(99.99)).toBe('$100');
  });
});
