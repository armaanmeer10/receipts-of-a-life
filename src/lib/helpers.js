export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function fmtDate(iso) {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`
}

export function fmtTime(ts) {
  const clock = ts.replace('T', ' ').split(' ')[1] || '00:00'
  const [h, m] = clock.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ap}`
}

export const num = (n) => Number(n).toLocaleString('en-US')
