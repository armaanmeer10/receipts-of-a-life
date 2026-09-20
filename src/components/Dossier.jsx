import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { fmtDate } from '../utils/format'
import { getConnectionsForEvent } from '../utils/connections'
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

function getEvent(id, events) {
  switch (id) {
    case 'c1':
      return events.find((e) => e.kind === 'first_play')
    case 'c2':
      return events.find(
        (e) => e.kind === 'discovery' && e.detail?.includes('The Beatles')
      )
    case 'c3':
      return [...events]
        .filter((e) => e.kind === 'peak_month')
        .sort((a, b) => b.value - a.value)[0]
    case 'c4':
      return events.find((e) => e.kind === 'salary_first')
    case 'c5':
      return events.find((e) => e.kind === 'investment')
    case 'c6':
      return events.find((e) => e.title?.includes('Netflix'))
    case 'c7':
      return events.find(
        (e) => e.title?.includes('Bike') || e.detail?.includes('Bikedelux')
      )
    case 'c8':
      return [...events]
        .filter((e) => e.kind === 'binge')
        .sort((a, b) => b.value - a.value)[0]
    default:
      return events.find((e) => e.id === id) || null
  }
}

/**
 * Forensic Audit Investigation Dossier component with explicit "Why Connected" section.
 */
export default function Dossier({ selectedId, events, cardDefs }) {
  const def = cardDefs.find((d) => d.id === selectedId)
  const event = selectedId ? getEvent(selectedId, events) : null
  const kindMeta = event ? EVENT_KINDS[event.kind] : null

  // Compute live plain-language connections from connections engine
  const liveConnections = event
    ? getConnectionsForEvent(event.id, events).slice(0, 5)
    : []

  return (
    <div className="flex h-full flex-col border-[3px] border-ink bg-white">
      <div className="shrink-0 border-b-[3px] border-ink bg-ink px-4 py-3">
        <div className="font-mono text-[12px] tracking-widest text-paper/70">
          CASE FILE: FORENSIC AUDIT
        </div>
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl font-bold text-paper">
            INVESTIGATION DOSSIER
          </h2>
          <span className="text-xl" aria-hidden="true">
            🧳
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!selectedId ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="text-5xl" aria-hidden="true">
              📌
            </div>
            <div className="font-display text-sm font-bold tracking-widest text-ink/75">
              SELECT A PINNED CARD
            </div>
            <div className="font-mono text-[12px] text-ink/70">
              Click any receipt on the board to inspect its verified data
              connections and plain-language causation reasons
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="border-2 border-ink bg-sun px-2 py-0.5 font-mono text-[12px] font-bold tracking-widest text-ink">
                  {def?.category?.toUpperCase() || 'RECEIPT'}
                </span>
                {kindMeta && (
                  <span
                    className={`border px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider ${kindMeta.color}`}
                  >
                    TYPE: {kindMeta.label}
                  </span>
                )}
                {event && (
                  <span className="font-mono text-[12px] font-bold text-ink/75">
                    {fmtDate(event.date)}
                  </span>
                )}
              </div>

              {event && (
                <div className="border-[2px] border-ink/30 bg-paper p-3">
                  <div className="text-[11px] font-bold tracking-wider text-ink/70">
                    {CARD_LABEL[selectedId] || 'EVIDENCE ITEM'}
                  </div>
                  <div className="mt-0.5 font-display text-base font-bold leading-tight text-ink">
                    {event.title}
                  </div>
                  {event.detail && (
                    <div className="mt-1.5 border-t border-dashed border-ink/30 pt-1.5 font-mono text-[12px] leading-relaxed text-ink/80">
                      {event.detail}
                    </div>
                  )}
                </div>
              )}

              {/* ══ WHY CONNECTED SECTION (Requirement 2) ══ */}
              <div className="border-[2px] border-ink bg-sun/15 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-display text-xs font-bold tracking-wider text-ink">
                    ⚡ WHY CONNECTED ({liveConnections.length} RULES MATCHED)
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#880e4f]">
                    VERIFIED
                  </span>
                </div>
                <p className="mb-2 text-[11px] text-ink/75">
                  Connections formed by chronological co-occurrence, nocturnal
                  windows, and shared artists or financial patterns:
                </p>
                <div className="space-y-2">
                  {liveConnections.length === 0 ? (
                    <div className="border border-dashed border-ink/40 p-2 font-mono text-[11px] text-ink/75">
                      Anchor record in archive; linked via timeline narrative.
                    </div>
                  ) : (
                    liveConnections.map((conn, idx) => {
                      const otherId = conn.a === event?.id ? conn.b : conn.a
                      const otherEvent = events.find((e) => e.id === otherId)
                      return (
                        <div
                          key={idx}
                          className="border border-ink/60 bg-white p-2 text-xs"
                        >
                          <div className="font-bold text-[#9c0d46]">
                            → Linked to: {otherEvent?.title || otherId}
                          </div>
                          <div className="mt-1 font-mono text-[11px] leading-snug text-ink/85">
                            {conn.reason}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {def?.connects?.length > 0 && (
                <div className="border-t border-dashed border-ink/40 pt-3">
                  <div className="mb-2 font-mono text-[12px] font-bold tracking-widest text-ink/70">
                    BOARD STRING PATHS:
                  </div>
                  <div className="space-y-1.5">
                    {def.connects.map((cid) => (
                      <div
                        key={cid}
                        className="border border-[#9c0d46] bg-[#9c0d46]/10 px-2 py-1 font-mono text-[11px] text-[#9c0d46]"
                      >
                        <span className="font-bold">● RED STRING: </span>
                        {CARD_LABEL[cid] || cid}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

Dossier.propTypes = {
  selectedId: PropTypes.string,
  events: PropTypes.array.isRequired,
  cardDefs: PropTypes.array.isRequired,
}
