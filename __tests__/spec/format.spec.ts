import { describe, expect, it } from 'vitest';

import { fmtChartDigit, formatCurrency, truncate } from '@/lib/format';

describe('formatCurrency', () => {
  it('formats USD amounts with two decimal places', () => {
    expect(formatCurrency(1299.5)).toBe('$1,299.50');
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('fmtChartDigit', () => {
  it('formats chart values as whole-dollar strings', () => {
    expect(fmtChartDigit(12500)).toBe('$12,500');
    expect(fmtChartDigit(99.7)).toBe('$100');
  });
});

describe('truncate', () => {
  it('leaves short strings unchanged', () => {
    expect(truncate('Luxe', 10)).toBe('Luxe');
  });

  it('truncates long strings with an ellipsis', () => {
    expect(truncate('Silk evening gown with embroidery', 12)).toBe('Silk evening…');
  });
});
