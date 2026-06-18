/** Shared price formatting for discount admin views. */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}
