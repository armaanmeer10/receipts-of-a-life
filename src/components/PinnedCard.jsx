import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { num, fmtDate } from '../utils/format'
import { EVENT_KINDS } from '../constants'

const CARD_LABEL = {
  c1: 'SPOTIFY LOG ARCHIVE',
  c2: 'BEATLES DISCOVERY',
  c3: 'PEAK MONTH SIGNAL',
  c4: 'SALARY RECEIPT',
  c5: 'INVESTMENT LEDGER',
  c6: 'SUBSCRIPTION STACK',
  c7: 'BIKE & TRAVEL EXPENSE',
  c8: 'BINGE LOG: BEATLES',
}

function Pin({ selected }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute -top-4 left-1/2 z-20 h-7 w-7 -translate-x-1/2 rounded-full border-[3px] shadow-md transition-all ${
        selected
          ? 'scale-125 border-[#7f0000] bg-[#e53935]'
          : 'border-[#8b0000] bg-[#9c0d46]'
      }`}
    />
  )
}

Pin.propTypes = {
  selected: PropTypes.bool,
}

function CardBody({ id, event }) {
  if (!event)
    return <p className="font-mono text-[12px] text-ink/75">No data</p>

  const kindMeta = EVENT_KINDS[event.kind]
  const kindBadgeClass = kindMeta?.color || 'bg-paper text-ink border-ink'
  const kindLabel = kindMeta?.label || event.kind.toUpperCase()

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-1">
        <span className="font-mono text-[11px] font-bold tracking-widest text-ink/70">
          {CARD_LABEL[id] || event.title}
        </span>
        <span
          className={`border px-1.5 py-0.2 text-[10px] font-bold tracking-wider ${kindBadgeClass}`}
        >
          {kindLabel}
        </span>
      </div>

      <div className="font-display text-sm font-bold leading-tight text-ink">
        {event.title.length > 52 ? `${event.title.slice(0, 50)}…` : event.title}
      </div>

      <div className="font-mono text-[12px] text-ink/75">
        {fmtDate(event.date)}
      </div>

      {event.value != null && (
        <div className="inline-block border border-ink/40 bg-sun/30 px-1.5 py-0.5 font-mono text-[12px] font-bold text-ink">
          {event.unit === 'INR'
            ? `₹${num(Math.round(event.value))}`
            : `${num(event.value)} ${event.unit}`}
        </div>
      )}

      {event.detail && (
        <div className="border-t border-dashed border-ink/30 pt-1.5 font-mono text-[11px] leading-snug text-ink/80">
          {event.detail.length > 70
            ? `${event.detail.slice(0, 68)}…`
            : event.detail}
        </div>
      )}
    </div>
  )
}

CardBody.propTypes = {
  id: PropTypes.string.isRequired,
  def: PropTypes.shape({
    category: PropTypes.string.isRequired,
  }).isRequired,
  event: PropTypes.object,
}

/**
 * Pinned corkboard item card component for String Board with keyboard accessibility and kind badge.
 */
export default function PinnedCard({
  def,
  event,
  isSelected,
  isHidden,
  onClick,
  index,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(def.id)
    }
  }

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          key={def.id}
          role="button"
          tabIndex={0}
          aria-label={`Inspect evidence card ${CARD_LABEL[def.id] || def.id}`}
          aria-pressed={isSelected}
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            left: `${def.cx}%`,
            top: `${def.cy}%`,
            width: 195,
            zIndex: isSelected ? 15 : 10,
          }}
          initial={{
            x: '-50%',
            y: '-65%',
            scale: 0.35,
            opacity: 0,
            rotate: def.rotate + (def.rotate > 0 ? 28 : -28),
          }}
          animate={{
            x: '-50%',
            y: '-50%',
            scale: 1,
            opacity: 1,
            rotate: def.rotate,
          }}
          exit={{ x: '-50%', y: '-40%', scale: 0.3, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 210,
            damping: 20,
            delay: index * 0.07,
          }}
          whileHover={{
            scale: 1.05,
            zIndex: 25,
            transition: { duration: 0.15 },
          }}
          onClick={() => onClick(def.id)}
          className="cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-hot"
        >
          <Pin selected={isSelected} />
          <div
            className={`border-[3px] bg-[#fffdf5] p-3 transition-shadow duration-150 ${
              isSelected
                ? 'border-[#9c0d46] shadow-[4px_4px_0_#9c0d46]'
                : 'border-ink shadow-brut-sm hover:shadow-brut'
            }`}
          >
            <CardBody id={def.id} def={def} event={event} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

PinnedCard.propTypes = {
  def: PropTypes.shape({
    id: PropTypes.string.isRequired,
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    rotate: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  event: PropTypes.object,
  isSelected: PropTypes.bool.isRequired,
  isHidden: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
}
