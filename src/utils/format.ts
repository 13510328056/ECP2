import type { StockStatus } from '@/types/product'

/**
 * Formats a number as Ghana Cedi price string.
 * @example formatPrice(1500.5) // returns "₵1,500.50"
 */
export function formatPrice(amount: number): string {
  return `₵${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Formats an ISO date string into a human-readable date.
 * @example formatDate('2025-06-15T10:30:00Z') // returns "Jun 15, 2025"
 */
export function formatDate(date: string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Generates a unique order number in the format GH + 10 digits.
 * @example generateOrderNumber() // returns "GH202505301234567890"
 */
export function generateOrderNumber(): string {
  const now = new Date()
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')
  const randomPart = Math.floor(Math.random() * 1_000_000_000)
    .toString()
    .padStart(9, '0')
  return `GH${datePart}${randomPart}`
}

/**
 * Returns localized stock status text and an associated color.
 */
export function getStockStatusText(
  status: StockStatus
): { text: string; textZh: string; color: string } {
  const map: Record<StockStatus, { text: string; textZh: string; color: string }> = {
    in_stock: { text: 'In Stock', textZh: '有货', color: '#22c55e' },
    low_stock: { text: 'Low Stock', textZh: '库存紧张', color: '#f59e0b' },
    out_of_stock: { text: 'Out of Stock', textZh: '缺货', color: '#ef4444' },
  }
  return map[status]
}

/**
 * Safe navigation back — goes to fallback if no browser history exists.
 */
export function safeBack(router: any, fallback: string = '/') {
  // history.length is unreliable; check if we came from within the app
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(fallback)
  }
}
