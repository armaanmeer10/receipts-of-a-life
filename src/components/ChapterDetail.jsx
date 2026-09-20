import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { num, fmtDate } from '../utils/format'
import { getConnectionsForEvent } from '../utils/connections'
import { EVENT_KINDS } from '../constants'

/**
 * Animated Chapter Detail view component for Story Roll with type badges and "connected to" chips.
 */
export default function ChapterDetail({ chapter, events, selectedYear }) {
  const navigate = useNavigate()

  if (!chapter) return null

  let chEvents = events.filter((e) => e.chapter === chapter.id)

  if (selectedYear !== 'ALL') {
    chEvents = chEvents.filter(
      (e) => e.date && String(e.date).includes(String(selectedYear))
    )
  }

  chEvents.sort((a, b) => a.date.localeCompare(b.date))

  const highlight = chEvents.find((e) =>
    [
      'first_play',
      'salary_first',
      'peak_month',
      'surge',
      'last_receipt',
    ].includes(e.kind)
  )
  const listEvents = chEvents.filter((e) => e !== highlight).slice(0, 8)
  const totalVal = chEvents.reduce((s, e) => s + (e.value || 0), 0)

  const handleOpenOnBoard = (targetId) => {
    navigate(`/board?card=${targetId}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${chapter.id}-${selectedYear}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
        className="space-y-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 font-mono text-[12px] font-bold tracking-widest text-paper/70">
              ROLL SEGMENT: {selectedYear}
            </div>
            <h2 className="font-display text-2xl font-bold leading-tight text-paper sm:text-3xl">
              {chapter.label}
            </h2>
            <div className="mt-1 font-mono text-[12px] text-paper/80">
              TIMEFRAME: {chapter.dateRange}
            </div>
          </div>
          <div
            className={`shrink-0 rotate-[3deg] border-[3px] border-paper/90 px-3 py-2 text-center font-display text-[12px] font-bold leading-tight tracking-wider ${chapter.color} ${chapter.textColor}`}
          >
            AUDIT
            <br />
            ORIGIN
          </div>
        </div>

        {highlight && (
          <div className="border-2 border-mint bg-mint/15 px-3 py-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-[12px] font-bold tracking-widest text-mint">
                ▶ AUDIT SIGNAL VERIFIED
              </span>
              {EVENT_KINDS[highlight.kind] && (
                <span
                  className={`border px-1.5 py-0.2 font-mono text-[10px] font-bold ${EVENT_KINDS[highlight.kind].color}`}
                >
                  {EVENT_KINDS[highlight.kind].label}
                </span>
              )}
            </div>
            <div className="font-mono text-[12px] font-bold text-paper">
              {highlight.title}
            </div>
            <div className="mt-1 font-mono text-[12px] text-paper/80">
              {highlight.detail}
            </div>
          </div>
        )}

        <div className="border-[2px] border-paper/30 bg-paper/10">
          <div className="border-b border-paper/30 px-3 py-2 font-mono text-[12px] font-bold tracking-widest text-paper/80">
            EVENT LOG · {chEvents.length} ENTRIES ({selectedYear})
          </div>
          <div className="divide-y divide-paper/20">
            {chEvents.length === 0 ? (
              <div className="p-4 text-center font-mono text-xs text-paper/70">
                No records logged for this chapter in year {selectedYear}.
              </div>
            ) : (
              listEvents.map((e) => {
                const kindMeta = EVENT_KINDS[e.kind]
                const conns = getConnectionsForEvent(e.id, events)

                return (
                  <div key={e.id} className="flex flex-col gap-1.5 px-3 py-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="truncate font-mono text-[12px] font-bold text-paper">
                            {e.title}
                          </span>
                          {kindMeta && (
                            <span
                              className={`border px-1.5 py-0.2 font-mono text-[10px] font-bold ${kindMeta.color}`}
                            >
                              {kindMeta.label}
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[12px] text-paper/70">
                          {fmtDate(e.date)}
                        </div>
                      </div>
                      {e.value != null && (
                        <div className="shrink-0 font-mono text-[12px] font-bold text-sun">
                          {e.unit === 'INR'
                            ? `₹${num(Math.round(e.value))}`
                            : `${e.unit === 'plays' ? num(e.value) : e.value} ${e.unit}`}
                        </div>
                      )}
                    </div>

                    {/* ══ CONNECTED TO CHIPS (Requirement 4) ══ */}
                    {conns.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="font-mono text-[10px] text-paper/60 font-bold">
                          LINKED:
                        </span>
                        {conns.slice(0, 2).map((c, i) => {
                          const otherId = c.a === e.id ? c.b : c.a
                          const otherEvt = events.find(
                            (ev) => ev.id === otherId
                          )
                          const shortTitle = otherEvt?.title
                            ? otherEvt.title.slice(0, 24) + '…'
                            : otherId

                          return (
                            <button
                              key={i}
                              onClick={() => handleOpenOnBoard(otherId)}
                              aria-label={`Open connection to ${otherEvt?.title || otherId} on String Board`}
                              className="inline-flex items-center gap-1 border border-paper/40 bg-paper/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-paper hover:border-hot hover:bg-hot hover:text-ink transition cursor-pointer"
                            >
                              <span>⚡</span>
                              <span>{shortTitle}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t-2 border-dashed border-paper/40 pt-3 font-mono">
          <span className="text-[12px] font-bold tracking-widest text-paper/80">
            CHA SUBTOTAL:
          </span>
          <span className="text-[12px] font-bold text-sun">
            {totalVal > 0
              ? `₹${num(Math.round(totalVal))} / ${chEvents.length} EVENTS`
              : `${chEvents.length} EVENTS`}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

ChapterDetail.propTypes = {
  chapter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    dateRange: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
  }),
  events: PropTypes.array.isRequired,
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
}
