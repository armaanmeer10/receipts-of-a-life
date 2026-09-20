import { useState, useEffect } from 'react'
import { COUNT_UP_DURATION_MS } from '../constants'

/**
 * Custom hook to animate a numerical value from 0 up to target.
 * @param {number|null} target - Target numerical value.
 * @param {number} [ms=900] - Duration of animation in milliseconds.
 * @returns {number} Current animated value.
 */
export function useCountUp(target, ms = COUNT_UP_DURATION_MS) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target == null) {
      return
    }

    let raf
    let start

    const tick = (t) => {
      if (!start) start = t
      const p = Math.min((t - start) / ms, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])

  return target == null ? 0 : value
}
