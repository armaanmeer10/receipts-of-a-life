import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * Animated SVG red string layer component for connecting conspiracy nodes.
 */
export default function StringLayer({
  connections,
  cardDefs,
  activeFilter,
  selectedId,
  selectedYear,
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {connections.map(([a, b], i) => {
        const da = cardDefs.find((d) => d.id === a)
        const db = cardDefs.find((d) => d.id === b)
        if (!da || !db) return null

        const isYearMatch =
          selectedYear === 'ALL' ||
          da.year === Number(selectedYear) ||
          db.year === Number(selectedYear)

        const isActive =
          isYearMatch &&
          (activeFilter === 'all' ||
            da.category === activeFilter ||
            db.category === activeFilter)

        const isHighlighted = selectedId === a || selectedId === b
        const mx = (da.cx + db.cx) / 2
        const my = (da.cy + db.cy) / 2 - 7

        return (
          <motion.path
            key={`${a}–${b}`}
            d={`M ${da.cx} ${da.cy} Q ${mx} ${my} ${db.cx} ${db.cy}`}
            fill="none"
            stroke={isHighlighted ? '#e53935' : '#9c0d46'}
            strokeWidth={isHighlighted ? 0.75 : 0.45}
            strokeDasharray={isHighlighted ? '1.8 1.2' : '1.4 2.2'}
            strokeLinecap="round"
            strokeOpacity={isActive ? (isHighlighted ? 1 : 0.65) : 0.1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.4 + i * 0.1,
              ease: 'easeInOut',
            }}
          />
        )
      })}
    </svg>
  )
}

StringLayer.propTypes = {
  connections: PropTypes.arrayOf(PropTypes.array).isRequired,
  cardDefs: PropTypes.array.isRequired,
  activeFilter: PropTypes.string.isRequired,
  selectedId: PropTypes.string,
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
}
