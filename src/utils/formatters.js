import { format } from 'date-fns';

export function formatDate(value, pattern = 'dd MMM yyyy') {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : format(date, pattern);
}

export function formatCurrency(value, prefix = 'Rs.', suffix = 'L') {
  const amount = Number(value || 0);
  return `${prefix} ${amount.toFixed(2)}${suffix ? ` ${suffix}` : ''}`.trim();
}

export function formatPercent(value) {
  const number = Number(value || 0);
  return `${Math.round(number)}%`;
}

export function formatNumber(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? new Intl.NumberFormat('en-IN').format(number) : '0';
}
