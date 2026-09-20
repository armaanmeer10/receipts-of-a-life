import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * Neo-brutalist animated badge/sticker component.
 */
export default function Sticker({
  label,
  value,
  bg,
  textClass = 'text-ink',
  className = '',
  rotate = 0,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{ scale: 1, rotate, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14, delay }}
      className={`absolute z-30 border-[3px] border-ink px-3 py-1.5 shadow-brut-sm ${bg} ${textClass} ${className} text-left`}
    >
      <div className="text-[12px] font-bold tracking-widest">{label}</div>
      <div className="font-display text-sm font-bold leading-tight">
        {value}
      </div>
    </motion.div>
  )
}

Sticker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  bg: PropTypes.string.isRequired,
  textClass: PropTypes.string,
  className: PropTypes.string,
  rotate: PropTypes.number,
  delay: PropTypes.number,
}
