import { memo } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useCountUp } from '../hooks/useCountUp'

/**
 * Animated Stat Tile card component.
 */
const Tile = memo(function Tile({
  label,
  icon,
  value,
  suffix = '',
  caption,
  bg,
  text = 'text-ink',
  rotate = 0,
  delay = 0,
}) {
  const shown = useCountUp(value)

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1, rotate }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay }}
      className={`border-[3px] border-ink p-4 shadow-brut ${bg} ${text}`}
    >
      <div className="flex items-start justify-between">
        <span className="border-2 border-ink bg-white px-1.5 py-0.5 text-[12px] font-bold tracking-widest text-ink">
          {label}
        </span>
        <span className="text-lg" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="mt-3 min-w-[4ch] font-display text-4xl font-bold leading-none tracking-tight tabular-nums md:text-5xl">
        {value != null ? shown.toLocaleString('en-US') : '—'}
        {value != null && suffix && (
          <span className="ml-1 text-2xl md:text-3xl">{suffix}</span>
        )}
      </div>
      <div className="mt-2 text-[12px] font-bold tracking-widest">
        {value != null ? caption : 'No records for this year'}
      </div>
    </motion.div>
  )
})

Tile.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  value: PropTypes.number,
  suffix: PropTypes.string,
  caption: PropTypes.string.isRequired,
  bg: PropTypes.string.isRequired,
  text: PropTypes.string,
  rotate: PropTypes.number,
  delay: PropTypes.number,
}

export default Tile
