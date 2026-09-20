/**
 * Centralized formatting utility module.
 * Provides consistent number, date, time, and currency formatting across the application.
 */

/**
 * Formats a number with comma separators (en-US locale).
 * @param {number|null|undefined} n - Number to format.
 * @returns {string} Formatted number string or '—'.
 */
export function num(n) {
  if (n == null) return '—'
  return Number(n).toLocaleString('en-US')
}

/**
 * Formats a date string (YYYY-MM-DD or ISO) into a human readable format (e.g. '08 Jul 2013').
 * @param {string} dateStr - Date string.
 * @returns {string} Formatted date label.
 */
export function fmtDate(dateStr) {
  if (!dateStr) return '—'
  const cleanStr = String(dateStr).split('T')[0]
  const d = new Date(cleanStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Formats time from ISO string to HH:MM format.
 * @param {string} isoStr - ISO date string.
 * @returns {string} HH:MM formatted time.
 */
export function fmtTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Formats currency amount in Indian Rupees (₹).
 * @param {number|null|undefined} amount - Amount in INR.
 * @returns {string} Formatted currency string.
 */
export function currency(amount) {
  if (amount == null) return '₹0'
  return `₹${num(Math.round(amount))}`
}
