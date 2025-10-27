export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(n);
}
