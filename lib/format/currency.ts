/**
 * Format currency for Malaysian Ringgit (MYR) and international currencies
 */
export function formatCurrency(amount: number, currency: string = 'MYR'): string {
  if (currency === 'MYR') {
    return `RM ${amount.toLocaleString('en-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // International currencies
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format datetime for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
