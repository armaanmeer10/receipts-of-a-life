import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * Neo-brutalist archetype card component for Insights page.
 */
export default function ArchetypeCard({ card, idx }) {
  return (
    <motion.div
      key={card.id}
      initial={{ opacity: 0, y: 30, rotate: card.rotate }}
      animate={{ opacity: 1, y: 0, rotate: card.rotate }}
      transition={{ duration: 0.5, delay: idx * 0.12 }}
      whileHover={{ y: -8, rotate: 0, scale: 1.02 }}
      className={`relative flex min-h-[460px] flex-col justify-between border-[3px] ${card.border} ${card.bg} ${card.text} p-5 shadow-brut transition-shadow duration-200`}
    >
      <div
        aria-hidden="true"
        className="absolute -top-3.5 left-1/2 z-20 h-5 w-16 -translate-x-1/2 border border-ink/50 bg-white/80 shadow-sm backdrop-blur-xs"
        style={{
          transform: `translateX(-50%) rotate(${idx % 2 === 0 ? -2 : 2}deg)`,
        }}
      />

      <div>
        <div className="mb-3 flex items-center justify-between border-b border-current/30 pb-2">
          <span
            className={`px-2 py-0.5 text-[12px] font-bold tracking-widest ${card.tagBg}`}
          >
            {card.tag}
          </span>
          <span className="font-mono text-[12px] font-bold opacity-80">
            {card.id}
          </span>
        </div>

        <div className="my-2 flex items-start justify-between gap-2">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-wide">
            {card.title}
          </h2>
          <span className="shrink-0 text-2xl" aria-hidden="true">
            {card.icon}
          </span>
        </div>

        <div className="my-3 grid grid-cols-2 gap-2 border-y border-dashed border-current/40 py-2 text-[12px]">
          {card.stats.map((st) => (
            <div key={st.label}>
              <div className="font-bold opacity-80">{st.label}</div>
              <div className="font-bold">{st.value}</div>
            </div>
          ))}
        </div>

        <p className="my-3 text-xs font-bold leading-relaxed">
          {card.mainStat}
        </p>

        <div className="my-4 border-l-2 border-current py-1 pl-3 text-[12px] italic leading-relaxed opacity-90">
          {card.quote}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-dashed border-current/40 pt-3 text-[12px] font-bold">
        <span className="opacity-80">{card.status}</span>
        <span className="border border-current px-1.5 py-0.5 font-mono">
          {card.statusBadge}
        </span>
      </div>
    </motion.div>
  )
}

ArchetypeCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    tagBg: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    bg: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    border: PropTypes.string.isRequired,
    rotate: PropTypes.number.isRequired,
    stats: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      })
    ).isRequired,
    mainStat: PropTypes.string.isRequired,
    quote: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    statusBadge: PropTypes.string.isRequired,
  }).isRequired,
  idx: PropTypes.number.isRequired,
}
