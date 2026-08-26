// ---------------------------------------------------------------------------
// Order status helpers
// ---------------------------------------------------------------------------
// The backend reports order status as a plain string ("Pending",
// "Preparing", "Ready", "Delivered", "Cancelled", ...). These helpers
// centralize the status vocabulary and the small parsing hack used when
// the status is embedded inside the order description.
// ---------------------------------------------------------------------------

/** The ordered pipeline an order moves through, shown as a progress bar. */
export const ORDER_STATUS_STEPS: string[] = ['Pending', 'Quoted', 'Preparing', 'Ready', 'Delivered'];

/** A cancelled order has stopped moving through the pipeline. */
export function isCancelled(status: string): boolean {
  return status.toLowerCase() === 'cancelled';
}

/** Completed / delivered orders are treated as finished. */
export function isCompleted(status: string): boolean {
  const s = status.toLowerCase();
  return s === 'completed' || s === 'delivered';
}

/** An order that is no longer biddable (expired or cancelled). */
export function isExpired(status: string): boolean {
  return status.toLowerCase() === 'expired';
}

/**
 * Backend orders embed their status in `description` as "STATUS: <value>"
 * (see `mapBackendOrder` in services/customerApi.ts). Extract it when
 * present, otherwise fall back to the order's own status field.
 */
export function extractStatusFromDescription(description: string, fallback: string): string {
  const marker = 'STATUS:';
  const idx = description.indexOf(marker);
  if (idx !== -1) return description.slice(idx + marker.length).trim();
  return fallback;
}
