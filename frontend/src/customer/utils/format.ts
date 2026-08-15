// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------
// Small pure functions for turning raw numbers/dates into display strings.
// Used across the menu and orders sections.
// ---------------------------------------------------------------------------

/** Format a rupee amount, e.g. 1850 → "LKR 1,850". */
export function formatPrice(amount: number): string {
  return `LKR ${amount.toLocaleString()}`;
}

/** Format an ISO date string for display, e.g. "2026-08-15" → "15 Aug 2026". */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
