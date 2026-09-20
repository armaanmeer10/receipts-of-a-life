/**
 * Web Audio API helper for thermal printer sound effects.
 */
import { BEEP_FREQUENCY_HZ, BEEP_DURATION_SEC } from '../constants'

/** Singleton AudioContext — reused across all beep calls to avoid creation cost. */
let audioCtx = null

/**
 * Synthesizes a short 880Hz audio beep tone using the Web Audio API for thermal printer sound effects.
 */
export function playBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new Ctx()
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(BEEP_FREQUENCY_HZ, audioCtx.currentTime)

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + BEEP_DURATION_SEC
    )

    osc.connect(gain)
    gain.connect(audioCtx.destination)

    osc.start()
    osc.stop(audioCtx.currentTime + BEEP_DURATION_SEC)
  } catch {
    // Ignore audio context autoplay restriction errors gracefully
  }
}
