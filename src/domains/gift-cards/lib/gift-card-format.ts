/** Shared display helpers for gift card UI. */
export function formatGiftCardDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function isActiveGiftCard(status?: string, balance?: number): boolean {
  return status === 'active' && (balance ?? 0) > 0;
}
