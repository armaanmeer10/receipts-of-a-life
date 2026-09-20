/**
 * Formats a number with US locale comma separators or returns string representation.
 * @param {number|null|undefined} n - The number to format.
 * @returns {string} Formatted number string.
 */
export function num(n) {
  if (n == null) return '0'
  return typeof n === 'number' ? n.toLocaleString('en-US') : String(n)
}

/**
 * Formats an ISO date string into DD MMM YYYY format.
 * @param {string} isoStr - ISO date string.
 * @returns {string} Uppercase formatted date string.
 */
export function fmtDate(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return isoStr
  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase()
}

/**
 * Formats an ISO date string into 24-hour HH:MM format.
 * @param {string} isoStr - ISO date string.
 * @returns {string} 24-hour time string.
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

/** Singleton AudioContext — reused across all beep calls to avoid creation cost. */
let _audioCtx = null

/**
 * Synthesizes a short 880Hz audio beep tone using the Web Audio API for thermal printer sound effects.
 * Reuses a singleton AudioContext instance for performance.
 */
export function playBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    if (!_audioCtx || _audioCtx.state === 'closed') {
      _audioCtx = new Ctx()
    }
    if (_audioCtx.state === 'suspended') {
      _audioCtx.resume()
    }
    const osc = _audioCtx.createOscillator()
    const gain = _audioCtx.createGain()
    osc.type = 'square'
    osc.frequency.value = 880
    gain.gain.value = 0.05
    osc.connect(gain)
    gain.connect(_audioCtx.destination)
    osc.start()
    osc.stop(_audioCtx.currentTime + 0.1)
  } catch {
    /* audio blocked by browser policy */
  }
}
