/**
 * StringBoard Page: Interactive corkboard conspiracy board connecting music scrobbles, financial receipts,
 * subscription stacks, and travel events using SVG red string paths and forensic investigation dossiers.
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useYear, AVAILABLE_YEARS } from '../context/YearContext'
import { num, fmtDate } from '../lib/helpers'

const CARD_DEFS = [
  { id: 'c1', cx: 14, cy: 20, rotate: -2.5, category: 'music', connects: ['c2', 'c4'], year: 2013 },
  { id: 'c2', cx: 44, cy: 15, rotate: 2.5, category: 'music', connects: ['c3', 'c8'], year: 2016 },
  { id: 'c3', cx: 78, cy: 24, rotate: -1.5, category: 'music', connects: ['c6'], year: 2017 },
  { id: 'c4', cx: 18, cy: 64, rotate: 1.5, category: 'financial', connects: ['c5', 'c7'], year: 2015 },
  { id: 'c5', cx: 46, cy: 72, rotate: -2.5, category: 'financial', connects: ['c6'], year: 2015 },
  { id: 'c6', cx: 76, cy: 62, rotate: 1.5, category: 'subscription', connects: ['c3'], year: 2016 },
  { id: 'c7', cx: 10, cy: 84, rotate: -3.5, category: 'travel', connects: [], year: 2018 },
  { id: 'c8', cx: 58, cy: 83, rotate: 2.0, category: 'notes', connects: ['c2'], year: 2016 },
]

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

const FILTER_CATS = [
  { id: 'all', label: 'ALL CONNECTIONS', active: 'bg-ink text-paper border-ink' },
  { id: 'music', label: 'MUSIC & SCROBBLES', active: 'bg-hot text-ink border-ink' },
  { id: 'financial', label: 'FINANCIAL & LEDGER', active: 'bg-sun text-ink border-ink' },
  { id: 'subscription', label: 'SUBSCRIPTIONS', active: 'bg-mint text-ink border-ink' },
  { id: 'travel', label: 'TRAVEL & PLACES', active: 'bg-volt text-white border-ink' },
  { id: 'notes', label: 'NOTES & ANOMALIES', active: 'bg-[#ffd3e3] text-[#880e4f] border-ink' },
]

const CONNECTION_REASONS = {
  'c1–c2': '1,106 days from initial 2013 play to 2016 Beatles discovery',
  'c1–c4': 'Pre-salary phase: free Spotify web player before first income',
  'c2–c3': '2016 Discovery directly triggered 2017 Peak Month (5,176 plays)',
  'c2–c8': 'Beatles discovery led to 157-play mono-artist binge in 5 months',
  'c3–c6': 'Peak listening co-occurred with subscription stack expansion',
  'c4–c5': '5 days between first salary (28 Feb) and first investment move (05 Mar)',
  'c4–c7': 'Financial liquidity enabled bike transportation purchase (2018)',
  'c5–c6': 'Automated monthly investment paired with recurring digital subscriptions',
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
    case 'c1': return events.find(e => e.kind === 'first_play')
    case 'c2': return events.find(e => e.kind === 'discovery' && e.detail?.includes('The Beatles'))
    case 'c3': return [...events].filter(e => e.kind === 'peak_month').sort((a, b) => b.value - a.value)[0]
    case 'c4': return events.find(e => e.kind === 'salary_first')
    case 'c5': return events.find(e => e.kind === 'investment')
    case 'c6': return events.find(e => e.title?.includes('Netflix'))
    case 'c7': return events.find(e => e.title?.includes('Bike') || e.detail?.includes('Bikedelux'))
    case 'c8': return [...events].filter(e => e.kind === 'binge').sort((a, b) => b.value - a.value)[0]
    default: return null
  }
}

function buildConnections() {
  const seen = new Set()
  const out = []
  for (const d of CARD_DEFS) {
    for (const t of d.connects) {
      const key = [d.id, t].sort().join('–')
      if (!seen.has(key)) { seen.add(key); out.push([d.id, t]) }
    }
  }
  return out
}
const ALL_CONNECTIONS = buildConnections()

function Pin({ selected }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute -top-4 left-1/2 z-20 h-7 w-7 -translate-x-1/2 rounded-full border-[3px] shadow-md transition-all
        ${selected ? 'scale-125 border-[#7f0000] bg-[#e53935]' : 'border-[#8b0000] bg-[#9c0d46]'}`}
    />
  )
}

function CardBody({ id, def, event }) {
  if (!event) return <p className="font-mono text-[12px] text-ink/75">No data</p>

  const catBadge =
    def.category === 'music' ? 'border-hot/50 bg-hot/10 text-hot' :
    def.category === 'financial' ? 'border-sun bg-sun/40 text-ink' :
    def.category === 'subscription' ? 'border-mint/50 bg-mint/20 text-ink' :
    def.category === 'travel' ? 'border-volt/50 bg-volt/20 text-ink' :
    'border-ink bg-paper text-ink'

  return (
    <div className="space-y-1.5">
      <div className="font-mono text-[12px] font-bold tracking-widest text-ink/70">
        {CARD_LABEL[id]}
      </div>
      <div className="font-display text-sm font-bold leading-tight text-ink">
        {event.title.length > 52 ? event.title.slice(0, 50) + '…' : event.title}
      </div>
      <div className="font-mono text-[12px] text-ink/75">{fmtDate(event.date)}</div>
      {event.value != null && (
        <div className={`inline-block border px-1.5 py-0.5 font-mono text-[12px] font-bold ${catBadge}`}>
          {event.unit === 'INR'
            ? `₹${num(Math.round(event.value))}`
            : `${num(event.value)} ${event.unit}`}
        </div>
      )}
      {event.detail && (
        <div className="border-t border-dashed border-ink/30 pt-1.5 font-mono text-[12px] leading-snug text-ink/80">
          {event.detail.length > 70 ? event.detail.slice(0, 68) + '…' : event.detail}
        </div>
      )}
    </div>
  )
}

function PinnedCard({ def, event, isSelected, isHidden, onClick, index }) {
  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.button
          key={def.id}
          aria-label={`Inspect evidence card ${CARD_LABEL[def.id]}`}
          style={{ position: 'absolute', left: `${def.cx}%`, top: `${def.cy}%`, width: 195, zIndex: isSelected ? 15 : 10 }}
          initial={{ x: '-50%', y: '-65%', scale: 0.35, opacity: 0, rotate: def.rotate + (def.rotate > 0 ? 28 : -28) }}
          animate={{ x: '-50%', y: '-50%', scale: 1, opacity: 1, rotate: def.rotate }}
          exit={{ x: '-50%', y: '-40%', scale: 0.3, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 210, damping: 20, delay: index * 0.07 }}
          whileHover={{ scale: 1.05, zIndex: 25, transition: { duration: 0.15 } }}
          onClick={() => onClick(def.id)}
          className="cursor-pointer text-left"
        >
          <Pin selected={isSelected} />
          <div
            className={`border-[3px] bg-[#fffdf5] p-3 transition-shadow duration-150
              ${isSelected
                ? 'border-[#9c0d46] shadow-[4px_4px_0_#9c0d46]'
                : 'border-ink shadow-brut-sm hover:shadow-brut'
              }`}
          >
            <CardBody id={def.id} def={def} event={event} />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function StringLayer({ activeFilter, selectedId, selectedYear }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {ALL_CONNECTIONS.map(([a, b], i) => {
        const da = CARD_DEFS.find(d => d.id === a)
        const db = CARD_DEFS.find(d => d.id === b)
        if (!da || !db) return null

        const isYearMatch = selectedYear === 'ALL' || da.year === Number(selectedYear) || db.year === Number(selectedYear)

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
            transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: 'easeInOut' }}
          />
        )
      })}
    </svg>
  )
}

function Dossier({ selectedId, events }) {
  const chain = selectedId ? CHAINS[selectedId] : null
  const def = CARD_DEFS.find(d => d.id === selectedId)
  const event = selectedId ? getEvent(selectedId, events) : null

  const catColor =
    def?.category === 'music' ? 'bg-hot/20 text-hot border-hot/40' :
    def?.category === 'financial' ? 'bg-sun/40 text-ink border-sun' :
    def?.category === 'subscription' ? 'bg-mint/20 text-ink border-mint/50' :
    def?.category === 'travel' ? 'bg-volt/20 text-white border-volt' :
    'bg-paper text-ink border-ink'

  return (
    <div className="flex h-full flex-col border-[3px] border-ink bg-white">
      <div className="shrink-0 border-b-[3px] border-ink bg-ink px-4 py-3">
        <div className="font-mono text-[12px] tracking-widest text-paper/70">CASE FILE: FORENSIC AUDIT</div>
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl font-bold text-paper">INVESTIGATION DOSSIER</h2>
          <span className="text-xl" aria-hidden="true">🧳</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!selectedId ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="text-5xl" aria-hidden="true">📌</div>
            <div className="font-display text-sm font-bold tracking-widest text-ink/75">
              SELECT A PINNED CARD
            </div>
            <div className="font-mono text-[12px] text-ink/70">
              Click any receipt on the board to reveal its verified data connections
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
                <span className={`border-2 px-2 py-0.5 font-mono text-[12px] font-bold tracking-widest ${catColor}`}>
                  {def?.category?.toUpperCase()}
                </span>
                {event && (
                  <span className="font-mono text-[12px] text-ink/75">{fmtDate(event.date)}</span>
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
                    <span className="font-mono text-[12px] font-bold text-ink">{chain.label}</span>
                  </div>
                  <div className="space-y-2">
                    {chain.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 font-mono text-[12px] text-ink">
                        <span className="mt-0.5 shrink-0 font-bold text-[#9c0d46]" aria-hidden="true">→</span>
                        <span className="leading-snug">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {chain?.relationship && (
                <div className="border-2 border-dashed border-ink bg-sun/30 p-2.5 font-mono text-[12px]">
                  <div className="font-bold text-ink/70 tracking-widest">SYSTEM RELATIONSHIP:</div>
                  <div className="font-bold text-ink mt-0.5">{chain.relationship}</div>
                </div>
              )}

              {def?.connects?.length > 0 && (
                <div>
                  <div className="mb-2 font-mono text-[12px] font-bold tracking-widest text-ink/70">
                    CONNECTED DATA NODES ({def.connects.length}):
                  </div>
                  <div className="space-y-2">
                    {def.connects.map(cid => {
                      const pairKey = [def.id, cid].sort().join('–')
                      const reason = CONNECTION_REASONS[pairKey] || 'Temporal & thematic correlation'
                      return (
                        <div
                          key={cid}
                          className="border border-[#9c0d46] bg-[#9c0d46]/10 p-2 font-mono text-[12px] text-[#9c0d46]"
                        >
                          <div className="font-bold">▶ {CARD_LABEL[cid]}</div>
                          <div className="text-[12px] opacity-90 mt-0.5">{reason}</div>
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

export default function StringBoard({ stats, events }) {
  const { selectedYear, setSelectedYear } = useYear()
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const catCounts = useMemo(() => {
    const c = { all: CARD_DEFS.length }
    for (const d of CARD_DEFS) c[d.category] = (c[d.category] || 0) + 1
    return c
  }, [])

  const handleCard = (id) => setSelectedId(prev => (prev === id ? null : id))

  return (
    <main className="flex-1 max-w-full overflow-x-hidden">
      <div className="border-b-[3px] border-ink bg-paper px-4 py-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="border-2 border-ink bg-[#ffd3e3] px-2.5 py-1 font-mono text-[12px] font-bold tracking-widest text-[#880e4f]">
              ⬛ CONFIDENTIAL DIGITAL AUDIT // CLASSIFIED
            </span>
            <span className="border-2 border-ink bg-mint px-2.5 py-1 font-mono text-[12px] font-bold tracking-widest text-ink">
              ✓ CRIME OF CONSUMPTION: SOLVED
            </span>
          </div>

          <div className="mb-4">
            <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl">
              THE CONSPIRACY BOARD:
              <br />
              <span className="mt-1 inline-block bg-sun px-2 py-1">
                EVERYTHING IS CONNECTED ({selectedYear})
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-lg font-mono text-[12px] leading-relaxed text-ink/80">
              Forensic triangulation of late-night Spotify manic loops, 03:00 AM panic deliveries,
              and irreversible life-pivot credit card authorisations.
            </p>
            <div className="flex gap-3">
              <div className="border-[3px] border-ink bg-white px-4 py-2 shadow-brut-sm">
                <div className="font-mono text-[12px] font-bold tracking-widest text-ink/70">ACTIVE YEAR</div>
                <div className="font-display text-2xl font-bold text-ink leading-none mt-0.5">
                  {selectedYear}
                </div>
              </div>
              <div className="border-[3px] border-ink bg-sun px-4 py-2 shadow-brut-sm">
                <div className="font-mono text-[12px] font-bold tracking-widest text-ink/80">ACTIVE CORRELATIONS</div>
                <div className="font-display text-2xl font-bold text-ink leading-none mt-0.5">
                  {String(ALL_CONNECTIONS.length).padStart(2, '0')} <span className="text-xs font-mono">NODES</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ YEAR SELECTOR ROW ══ */}
      <div className="border-b-[3px] border-ink bg-paper px-4 py-2.5 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          <span className="shrink-0 font-mono text-[12px] font-bold tracking-widest text-ink/75">
            ▼ SELECT AUDIT YEAR:
          </span>
          {AVAILABLE_YEARS.map((y) => {
            const isSelected = String(selectedYear) === String(y)
            return (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                aria-pressed={isSelected}
                aria-label={`Select year ${y}`}
                className={`min-h-[44px] border-2 px-3 py-1 font-mono text-[12px] font-bold tracking-wider transition
                  ${isSelected
                    ? 'border-ink bg-sun text-ink shadow-[2px_2px_0_#111]'
                    : 'border-ink/50 bg-white text-ink/80 hover:border-ink'
                  }`}
              >
                {y}
              </button>
            )
          })}
        </div>
      </div>

      {/* ══ FILTER BAR ══ */}
      <div className="border-b-[3px] border-ink bg-paper px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          <span className="shrink-0 font-mono text-[12px] font-bold tracking-widest text-ink/75">
            ▼ EVIDENCE FILTERS:
          </span>
          {FILTER_CATS.map(cat => {
            const count = catCounts[cat.id] ?? 0
            const isActive = activeFilter === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveFilter(cat.id)
                  setSelectedId(null)
                }}
                aria-label={`Filter evidence by ${cat.label}`}
                className={`min-h-[44px] border-2 px-3 py-1.5 font-mono text-[12px] font-bold tracking-wider transition
                  ${isActive
                    ? `${cat.active} shadow-[2px_2px_0_#111]`
                    : 'border-ink/50 bg-white text-ink/80 hover:border-ink hover:text-ink'
                  }`}
              >
                {cat.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1fr_360px]">
        <div
          className="relative overflow-hidden border-b-[3px] border-ink lg:border-b-0 lg:border-r-[3px]"
          style={{ minHeight: 580, height: 580 }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#e5d9c0',
              backgroundImage:
                'radial-gradient(rgba(100,72,30,0.25) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
            aria-hidden="true"
          >
            <div className="text-center font-display font-bold leading-none tracking-tight text-[rgba(100,72,30,0.08)] text-6xl md:text-8xl">
              THE<br />CONSPIRACY<br />BOARD
            </div>
          </div>

          <StringLayer activeFilter={activeFilter} selectedId={selectedId} selectedYear={selectedYear} />

          {CARD_DEFS.map((def, i) => {
            const event = getEvent(def.id, events)
            const isCategoryHidden = activeFilter !== 'all' && def.category !== activeFilter
            const isYearHidden = selectedYear !== 'ALL' && def.year !== Number(selectedYear)
            const isHidden = isCategoryHidden || isYearHidden

            return (
              <PinnedCard
                key={def.id}
                def={def}
                event={event}
                isSelected={selectedId === def.id}
                isHidden={isHidden}
                onClick={handleCard}
                index={i}
              />
            )
          })}
        </div>

        <div style={{ minHeight: 580, height: 580 }}>
          <Dossier selectedId={selectedId} events={events} />
        </div>
      </div>
    </main>
  )
}
