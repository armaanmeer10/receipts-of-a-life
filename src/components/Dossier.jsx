import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { fmtDate } from '../utils/format'

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

const CONNECTION_REASONS = {
  'c1–c2': '1,106 days from initial 2013 play to 2016 Beatles discovery',
  'c1–c4': 'Pre-salary phase: free Spotify web player before first income',
  'c2–c3': '2016 Discovery directly triggered 2017 Peak Month (5,176 plays)',
  'c2–c8': 'Beatles discovery led to 157-play mono-artist binge in 5 months',
  'c3–c6': 'Peak listening co-occurred with subscription stack expansion',
  'c4–c5':
    '5 days between first salary (28 Feb) and first investment move (05 Mar)',
  'c4–c7': 'Financial liquidity enabled bike transportation purchase (2018)',
  'c5–c6':
    'Automated monthly investment paired with recurring digital subscriptions',
}

const CHAINS = {
  c1: {
    label: 'ORIGIN NODE: FIRST SIGNAL',
    labelBg: '#ffe500',
    steps: [
      'First Spotify Play · 08 Jul 2013 · 02:44 UTC',
      "Say It, Just Say It — The Mowgli's · web player",
      '149,860 Lifetime Plays confirmed in archive',
    ],
    relationship: 'Initial web player entry point before account maturity',
  },
  c2: {
    label: 'CULTURAL ALIGNMENT: THE BEATLES',
    labelBg: '#ff4d8d',
    steps: [
      'Discovery: Strawberry Fields Forever · Jul 2016',
      'Dec 2016 Surge — 2,656 plays/month (5x previous avg)',
      'Sep 2017 Peak — 5,176 plays / 62 hours in one month',
    ],
    relationship: 'Catalyst for multi-year mono-artist obsession',
  },
  c3: {
    label: 'PEAK SIGNAL: MAX AMPLITUDE REACHED',
    labelBg: '#ff4d8d',
    steps: [
      'Sep 2017: 5,176 plays · 62 hours · Beatles-led',
      'Jul 2017 surge also: 3,915 plays / ₹2,00,000 FD same month',
      'High-money periods co-occur with high listening intensity',
    ],
    relationship: 'Peak career & financial activity window',
  },
  c4: {
    label: 'INCOME RECEIPT: LEDGER OPENS',
    labelBg: '#ffe500',
    steps: [
      'First Salary: ₹49,806 · 28 Feb 2015',
      'First Investment: ₹1,000 · 05 Mar 2015 (5 days later)',
      'PPF Account opened · May 2015 · ₹20,000',
    ],
    relationship: 'Triggers start of 2,461 transaction ledger entries',
  },
  c5: {
    label: 'CAPITAL DEPLOYMENT: PHASE I',
    labelBg: '#ffe500',
    steps: [
      'SIP begins · ₹1,000/mo recurring deposit',
      'Fixed Deposit ₹2,00,000 · Jun 2017',
      'SIP Redemption ₹1,13,376 + ₹1,06,875 · Jan 2018',
    ],
    relationship: 'Direct financial predecessor to major asset moves',
  },
  c6: {
    label: 'SUBSCRIPTION STACK ASSEMBLED',
    labelBg: '#00f5a0',
    steps: [
      'Netflix · Oct 2016 · ₹199/mo — 8 payments',
      'Tata Sky · Dec 2016 · ₹214/mo — 24 payments',
      'Edtech Course · Dec 2016 · ₹2,816/mo — 14 payments',
    ],
    relationship: 'Automated recurring spending patterns',
  },
  c7: {
    label: 'TRAVEL & TRANSPORTATION',
    labelBg: '#b8f500',
    steps: [
      'Two-Wheeler Bike Payment: ₹50,000 · 18 Jan 2018',
      'Travels & Transit: ₹2,598 on heavy listening day',
      'Final ledger receipt: Train ticket ₹30 on 20 Sep 2018',
    ],
    relationship: 'Physical mobility transactions logged in ledger',
  },
  c8: {
    label: 'BINGE PATTERN: OBSESSION CONFIRMED',
    labelBg: '#ff4d8d',
    steps: [
      'Beatles Binge: 157 plays · 02 Dec 2016 — 100% single-artist',
      '116 plays · 04 Jan 2017 · 97% Beatles',
      'Mono-artist days confirmed across 11-year timeline',
    ],
    relationship: 'Deep focus loops during coding & work sessions',
  },
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
      return null
  }
}

/**
 * Forensic Audit Investigation Dossier side-panel component for String Board.
 */
export default function Dossier({ selectedId, events, cardDefs }) {
  const chain = selectedId ? CHAINS[selectedId] : null
  const def = cardDefs.find((d) => d.id === selectedId)
  const event = selectedId ? getEvent(selectedId, events) : null

  const catColor =
    def?.category === 'music'
      ? 'bg-hot/20 text-hot border-hot/40'
      : def?.category === 'financial'
        ? 'bg-sun/40 text-ink border-sun'
        : def?.category === 'subscription'
          ? 'bg-mint/20 text-ink border-mint/50'
          : def?.category === 'travel'
            ? 'bg-volt/20 text-white border-volt'
            : 'bg-paper text-ink border-ink'

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
              Click any receipt on the board to reveal its verified data
              connections
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
                <span
                  className={`border-2 px-2 py-0.5 font-mono text-[12px] font-bold tracking-widest ${catColor}`}
                >
                  {def?.category?.toUpperCase()}
                </span>
                {event && (
                  <span className="font-mono text-[12px] text-ink/75">
                    {fmtDate(event.date)}
                  </span>
                )}
              </div>

              {event && (
                <div className="border-[2px] border-ink/30 bg-paper p-3">
                  <div className="font-display text-base font-bold leading-tight text-ink">
                    {event.title}
                  </div>
                  {event.detail && (
                    <div className="mt-1.5 font-mono text-[12px] leading-relaxed text-ink/80">
                      {event.detail}
                    </div>
                  )}
                </div>
              )}

              {chain && (
                <div className="border-[2px] border-ink/30 bg-paper p-3">
                  <div className="mb-2 font-mono text-[12px] font-bold tracking-widest text-ink/70">
                    CHAIN OF CAUSATION:
                  </div>
                  <div
                    className="mb-3 inline-block border-[2px] border-ink px-2 py-0.5"
                    style={{ background: chain.labelBg }}
                  >
                    <span className="font-mono text-[12px] font-bold text-ink">
                      {chain.label}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {chain.steps.map((step, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 font-mono text-[12px] text-ink"
                      >
                        <span
                          className="mt-0.5 shrink-0 font-bold text-[#9c0d46]"
                          aria-hidden="true"
                        >
                          →
                        </span>
                        <span className="leading-snug">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {chain?.relationship && (
                <div className="border-2 border-dashed border-ink bg-sun/30 p-2.5 font-mono text-[12px]">
                  <div className="font-bold tracking-widest text-ink/70">
                    SYSTEM RELATIONSHIP:
                  </div>
                  <div className="mt-0.5 font-bold text-ink">
                    {chain.relationship}
                  </div>
                </div>
              )}

              {def?.connects?.length > 0 && (
                <div>
                  <div className="mb-2 font-mono text-[12px] font-bold tracking-widest text-ink/70">
                    CONNECTED DATA NODES ({def.connects.length}):
                  </div>
                  <div className="space-y-2">
                    {def.connects.map((cid) => {
                      const pairKey = [def.id, cid].sort().join('–')
                      const reason =
                        CONNECTION_REASONS[pairKey] ||
                        'Temporal & thematic correlation'
                      return (
                        <div
                          key={cid}
                          className="border border-[#9c0d46] bg-[#9c0d46]/10 p-2 font-mono text-[12px] text-[#9c0d46]"
                        >
                          <div className="font-bold">▶ {CARD_LABEL[cid]}</div>
                          <div className="mt-0.5 text-[12px] opacity-90">
                            {reason}
                          </div>
                        </div>
                      )
                    })}
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
