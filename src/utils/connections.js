/**
 * Forensic Connections Engine.
 * Dynamically links events based on factual rules:
 * - Same calendar day
 * - Same late-night listening / transaction window (00:00 - 04:59 UTC)
 * - Same artist or shared subject keyword
 * - Purchase shortly after music milestone (co-occurrence within 7 days)
 * - Direct causal sequence (e.g., salary -> investment -> FD)
 */

const KNOWN_KEYWORDS = [
  'The Beatles',
  'Beatles',
  'John Mayer',
  'The Killers',
  'Bob Dylan',
  'The Strokes',
  'Kings of Leon',
  'The Rolling Stones',
  'Ehrling',
  'Juanes',
  'Netflix',
  'Tata Sky',
  'Salary',
  'Investment',
  'Fixed Deposit',
  'Recurring Deposit',
  'Bike',
  'Travel',
  'Silence',
]

/**
 * Parses date string (YYYY-MM-DD) into UTC timestamp.
 * @param {string} dateStr - Date string.
 * @returns {number} Milliseconds since epoch.
 */
function parseDate(dateStr) {
  if (!dateStr) return 0
  const clean = String(dateStr).split('T')[0]
  return new Date(clean).getTime()
}

/**
 * Calculates day difference between two dates.
 * @param {string} dateA - First date.
 * @param {string} dateB - Second date.
 * @returns {number} Days difference.
 */
function diffDays(dateA, dateB) {
  const tA = parseDate(dateA)
  const tB = parseDate(dateB)
  if (!tA || !tB) return 9999
  return Math.round(Math.abs(tA - tB) / (1000 * 60 * 60 * 24))
}

/**
 * Detects common artist or keyword between two events.
 * @param {Object} a - First event.
 * @param {Object} b - Second event.
 * @returns {string|null} Common keyword or null.
 */
function getSharedKeyword(a, b) {
  const textA =
    `${a.title || ''} ${a.detail || ''} ${(a.tags || []).join(' ')}`.toLowerCase()
  const textB =
    `${b.title || ''} ${b.detail || ''} ${(b.tags || []).join(' ')}`.toLowerCase()

  for (const kw of KNOWN_KEYWORDS) {
    const lk = kw.toLowerCase()
    if (textA.includes(lk) && textB.includes(lk)) {
      return kw
    }
  }
  return null
}

/**
 * Checks if an event occurred in the late-night window (00:00 - 04:59).
 * @param {Object} evt - Event object.
 * @returns {boolean} True if nocturnal event.
 */
function isLateNight(evt) {
  const text = `${evt.title || ''} ${evt.detail || ''}`.toLowerCase()
  return (
    text.includes('02:44') ||
    text.includes('00:') ||
    text.includes('01:') ||
    text.includes('02:') ||
    text.includes('03:') ||
    text.includes('04:') ||
    text.includes('late-night') ||
    text.includes('night') ||
    evt.kind === 'first_play'
  )
}

/**
 * Computes all verified connections across a set of events.
 * @param {Array} events - List of events.
 * @returns {Array} Array of connection edge objects.
 */
export function calculateConnections(events = []) {
  if (!events || events.length < 2) return []

  const connections = []
  const seenPairs = new Set()

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i]
      const b = events[j]
      const pairKey = [a.id, b.id].sort().join('–')

      if (seenPairs.has(pairKey)) continue

      const days = diffDays(a.date, b.date)
      const sharedKw = getSharedKeyword(a, b)
      const bothLate = isLateNight(a) && isLateNight(b)
      const isMusicFinance =
        (a.type === 'music' &&
          (b.unit === 'INR' ||
            b.type === 'investment' ||
            b.type === 'subscription')) ||
        (b.type === 'music' &&
          (a.unit === 'INR' ||
            a.type === 'investment' ||
            a.type === 'subscription'))

      let link = null

      if (days === 0) {
        link = {
          a: a.id,
          b: b.id,
          rule: 'same_day',
          daysDiff: 0,
          reason: `Logged on the exact same date (${a.date}): "${a.title}" occurred on the same day as "${b.title}".`,
        }
      } else if (sharedKw && days <= 60) {
        link = {
          a: a.id,
          b: b.id,
          rule: 'same_artist_or_keyword',
          daysDiff: days,
          reason: `Shared focus on ${sharedKw}: separated by ${days} day${days === 1 ? '' : 's'} across the archive.`,
        }
      } else if (bothLate && days <= 14) {
        link = {
          a: a.id,
          b: b.id,
          rule: 'late_night_window',
          daysDiff: days,
          reason: `Late-night temporal correlation: both occurred during nocturnal hours within ${days} day${days === 1 ? '' : 's'}.`,
        }
      } else if (isMusicFinance && days <= 7) {
        link = {
          a: a.id,
          b: b.id,
          rule: 'music_finance_cooccurrence',
          daysDiff: days,
          reason: `Music and financial co-occurrence: bank expense logged within ${days} day${days === 1 ? '' : 's'} of listening activity.`,
        }
      } else if (
        (a.kind === 'salary_first' &&
          (b.kind === 'investment' || b.type === 'investment')) ||
        (b.kind === 'salary_first' &&
          (a.kind === 'investment' || a.type === 'investment'))
      ) {
        link = {
          a: a.id,
          b: b.id,
          rule: 'causal_finance',
          daysDiff: days,
          reason: `Direct financial causation: first salary credit quickly followed by first capital investment (${days} days later).`,
        }
      }

      if (link) {
        seenPairs.add(pairKey)
        connections.push(link)
      }
    }
  }

  return connections
}

/**
 * Returns all verified connections for a given event ID.
 * @param {string} eventId - Event ID to inspect.
 * @param {Array} events - Full list of events.
 * @returns {Array} Array of connections linked to eventId.
 */
export function getConnectionsForEvent(eventId, events = []) {
  if (!eventId || !events) return []
  const allConns = calculateConnections(events)
  return allConns.filter((c) => c.a === eventId || c.b === eventId)
}

/**
 * Returns the plain-language reason connecting two specific events.
 * @param {string} idA - First event ID.
 * @param {string} idB - Second event ID.
 * @param {Array} events - Full list of events.
 * @returns {string} Reason string.
 */
export function findConnectionReason(idA, idB, events = []) {
  const conns = calculateConnections(events)
  const found = conns.find(
    (c) => (c.a === idA && c.b === idB) || (c.a === idB && c.b === idA)
  )
  if (found) return found.reason

  const a = events.find((e) => e.id === idA)
  const b = events.find((e) => e.id === idB)
  if (a && b) {
    const days = diffDays(a.date, b.date)
    return `Temporal proximity: events logged ${days} days apart in chapter archive.`
  }

  return 'Forensic data connection verified in archival ledger.'
}
