import { format, parseISO } from 'date-fns';

import type { DtoTransactionResponse } from '~/src/services/-wallet-get.schemas';

import { formatOrderAmount } from './order-utils';

export const WALLET_STATUS_STYLES: Record<string, string> = {
  completed:
    'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
  pending:
    'border-amber-500/25 bg-amber-500/10 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300',
  failed:
    'border-red-500/20 bg-red-500/10 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300',
  cancelled: 'border-border bg-muted/60 text-muted-foreground'
};

export function formatWalletAmount(value?: number | string): string {
  return formatOrderAmount(value);
}

/** Parses API numbers that may arrive as strings from JSON/decimals. */
export function parseWalletNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

/** Prefer API balance, then latest completed transaction balance_after. */
export function resolveWalletBalance(
  apiBalance: unknown,
  transactions: DtoTransactionResponse[]
): number {
  const parsedApiBalance = parseWalletNumber(apiBalance);
  if (parsedApiBalance != null && parsedApiBalance > 0) {
    return parsedApiBalance;
  }

  const latestCompleted = transactions
    .filter((tx) => tx.status === 'completed')
    .map((tx) => ({
      balanceAfter: parseWalletNumber(tx.balance_after),
      createdAt: tx.created_at ? new Date(tx.created_at).getTime() : 0
    }))
    .filter((tx) => tx.balanceAfter != null)
    .sort((a, b) => b.createdAt - a.createdAt)[0];

  if (latestCompleted?.balanceAfter != null && latestCompleted.balanceAfter > 0) {
    return latestCompleted.balanceAfter;
  }

  return parsedApiBalance ?? 0;
}

/** Compact axis labels with thousand separators. */
export function formatWalletChartAxis(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 1 })}M`;
  }
  if (abs >= 1_000) {
    return `$${(value / 1_000).toLocaleString('en-US', { maximumFractionDigits: 1 })}k`;
  }
  return formatWalletAmount(value);
}

export function formatWalletStatus(status?: string): string {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getWalletStatusStyle(status?: string): string {
  if (!status) {
    return 'border-border bg-muted/60 text-muted-foreground';
  }
  return WALLET_STATUS_STYLES[status.toLowerCase()] ?? WALLET_STATUS_STYLES['pending']!;
}

export function formatTransactionType(type?: string): string {
  if (!type) return 'Transaction';
  const labels: Record<string, string> = {
    deposit: 'Deposit',
    payment: 'Order payment',
    refund: 'Refund',
    adjustment: 'Adjustment'
  };
  return labels[type.toLowerCase()] ?? type.charAt(0).toUpperCase() + type.slice(1);
}

export function formatTransactionDate(value?: string): string {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM d, yyyy · h:mm a');
  } catch {
    return new Date(value).toLocaleString();
  }
}

export function formatShortChartDate(value?: string): string {
  if (!value) return '';
  try {
    return format(parseISO(value), 'MMM d');
  } catch {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
}

export function getTransactionAmountDisplay(tx: DtoTransactionResponse): {
  prefix: '+' | '-';
  value: number;
  className: string;
} {
  const amount = parseWalletNumber(tx.amount) ?? 0;
  const isCredit = amount >= 0;
  return {
    prefix: isCredit ? '+' : '-',
    value: Math.abs(amount),
    className: isCredit
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-red-600 dark:text-red-400'
  };
}

export type WalletBalancePoint = {
  date: string;
  balance: number;
  label: string;
};

export type WalletActivityPoint = {
  date: string;
  inflow: number;
  outflow: number;
  label: string;
};

/** Builds ascending balance history for the area chart from completed transactions. */
export function buildWalletBalanceSeries(
  transactions: DtoTransactionResponse[]
): WalletBalancePoint[] {
  const completed = transactions
    .filter((tx) => tx.status === 'completed' && parseWalletNumber(tx.balance_after) != null)
    .slice()
    .sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return aTime - bTime;
    });

  if (completed.length === 0) {
    return [{ date: 'Start', balance: 0, label: 'Start' }];
  }

  return completed.map((tx) => ({
    date: formatShortChartDate(tx.created_at),
    balance: parseWalletNumber(tx.balance_after) ?? 0,
    label: formatShortChartDate(tx.created_at)
  }));
}

/** Groups completed transactions by day for inflow/outflow bars. */
export function buildWalletActivitySeries(
  transactions: DtoTransactionResponse[]
): WalletActivityPoint[] {
  const buckets = new Map<string, WalletActivityPoint>();

  for (const tx of transactions) {
    if (tx.status !== 'completed') continue;
    const amount = parseWalletNumber(tx.amount) ?? 0;
    const key = tx.created_at?.slice(0, 10) ?? 'unknown';
    const existing = buckets.get(key) ?? {
      date: formatShortChartDate(tx.created_at),
      inflow: 0,
      outflow: 0,
      label: formatShortChartDate(tx.created_at)
    };

    if (amount >= 0) {
      existing.inflow += amount;
    } else {
      existing.outflow += Math.abs(amount);
    }

    buckets.set(key, existing);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, point]) => point)
    .slice(-14);
}

export function summarizeWalletActivity(transactions: DtoTransactionResponse[]) {
  let totalIn = 0;
  let totalOut = 0;
  let pendingCount = 0;

  for (const tx of transactions) {
    if (tx.status === 'pending') {
      pendingCount += 1;
    }
    if (tx.status !== 'completed') continue;
    const amount = parseWalletNumber(tx.amount) ?? 0;
    if (amount >= 0) totalIn += amount;
    else totalOut += Math.abs(amount);
  }

  return { totalIn, totalOut, pendingCount };
}

export function formatSignedWalletAmount(amount: number): string {
  const prefix = amount >= 0 ? '+' : '-';
  return `${prefix}${formatWalletAmount(Math.abs(amount))}`;
}
