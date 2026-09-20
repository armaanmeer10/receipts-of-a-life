import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { num } from '../utils/format'
import { DONUT_COLORS } from '../constants'

/**
 * Plain SVG Donut Chart component for financial purchase ledger breakdown.
 */
export default function DonutChart({ data, total }) {
  if (!data || data.length === 0 || total === 0) return null

  const radius = 65
  const strokeWidth = 24
  const circumference = 2 * Math.PI * radius

  const slices = data.map((item, idx) => {
    const percentage = item.amount / total
    const strokeDasharray = `${percentage * circumference} ${circumference}`
    const previousPercentageSum = data
      .slice(0, idx)
      .reduce((sum, d) => sum + d.amount / total, 0)
    const strokeDashoffset = -previousPercentageSum * circumference

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      color: DONUT_COLORS[idx % DONUT_COLORS.length],
    }
  })

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        className="-rotate-90 transform"
        aria-label="Purchase ledger category donut chart"
      >
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="transparent"
          stroke="#111"
          strokeWidth={strokeWidth + 6}
        />
        {slices.map((slice, idx) => (
          <motion.circle
            key={slice.name || idx}
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke={slice.color}
            strokeWidth={strokeWidth}
            strokeDasharray={slice.strokeDasharray}
            strokeDashoffset={slice.strokeDashoffset}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: slice.strokeDasharray }}
            transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
          />
        ))}
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-mono text-[12px] font-bold tracking-wider text-ink/75">
          TOTAL SPEND
        </span>
        <span className="font-display text-lg font-bold text-ink">
          ₹{num(Math.round(total))}
        </span>
      </div>
    </div>
  )
}

DonutChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  total: PropTypes.number.isRequired,
}
