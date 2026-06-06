export const formatCurrency = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

export const fmtChartDigit = (n: number) =>
  `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)}`;
