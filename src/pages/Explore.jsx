import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { useYear, AVAILABLE_YEARS } from '../context/YearContext'
import { getYearStats } from '../utils/yearStats'
import { num, playBeep } from '../lib/helpers'

const YEAR_SUBTITLES = {
  ALL: 'FULL ARCHIVE AUDIT (2013-2024)',
  2013: 'LATE-NIGHT BEGINNINGS / FIRST SIGNAL',
  2014: 'THE SILENT SPINDLE / ARCHIVE GAP',
  2015: 'INCOME OPENS / FIRST SALARY & INVESTMENT',
  2016: 'BEATLES DISCOVERY & SUBSCRIPTION STACK',
  2017: 'THE YEAR OF EVERYTHING / CAREER & CODE PIVOT',
  2018: 'PEAK VOLUME & INVESTMENT MATURITY',
  2019: 'SURGE & BEATLES MONO-LOOPS',
  2020: 'LOCKDOWN BINGES & AMBIENT LOOPS',
  2021: 'QUIET ARCHIVE / FADE OUT',
  2022: 'JUANES BINGE & SPARSE RECEIPTS',
  2023: 'EHRLING LOOPS & AMBIENT DAYS',
  2024: 'THE FINAL SPINS / ARCHIVE CLOSE',
}

const PRESET_CHIPS = [
  { label: 'The Beatles (13.6k plays)', query: 'The Beatles' },
  { label: 'Subscriptions & Media', query: 'subscription' },
  { label: 'Investments & FDs', query: 'Investment' },
  { label: 'Salary & Income', query: 'salary' },
  { label: 'Travel & Bike Transit', query: 'Travel' },
  { label: 'Notes & Anomalies', query: 'silence' },
]

const ARTIST_DATA_BY_YEAR = {
  2013: [
    { name: "THE MOWGLI'S", plays: 142, track: 'SAY IT, JUST SAY IT' },
    { name: 'THE STROKES', plays: 98, track: 'LAST NITE' },
    { name: 'KINGS OF LEON', plays: 76, track: 'NOTION' },
  ],
  2014: [
    { name: 'THE STROKES', plays: 120, track: 'REPTILIA' },
    { name: 'KINGS OF LEON', plays: 85, track: 'SEX ON FIRE' },
  ],
  2015: [
    { name: 'BOB DYLAN', plays: 1240, track: 'MR. TAMBOURINE MAN' },
    { name: 'LED ZEPPELIN', plays: 980, track: "BABE I'M GONNA LEAVE YOU" },
    { name: 'JOHNNY CASH', plays: 890, track: 'RING OF FIRE' },
  ],
  2016: [
    { name: 'THE BEATLES', plays: 2656, track: 'STRAWBERRY FIELDS FOREVER' },
    { name: 'THE BLACK KEYS', plays: 1120, track: 'HOWLIN FOR YOU' },
    { name: 'BILLY JOEL', plays: 890, track: "WE DIDN'T START THE FIRE" },
  ],
  2017: [
    { name: 'THE BEATLES', plays: 4210, track: 'A DAY IN THE LIFE (BINGE)' },
    { name: 'RADIOHEAD', plays: 3040, track: 'IN RAINBOWS LOOP' },
    { name: 'FRANK OCEAN', plays: 2180, track: 'BLONDE LATE-NIGHT' },
  ],
  2018: [
    { name: 'THE BEATLES', plays: 3450, track: 'COME TOGETHER' },
    { name: 'THE KILLERS', plays: 2100, track: "ALL THESE THINGS THAT I'VE DONE" },
    { name: 'JOHN MAYER', plays: 1650, track: 'IN THE BLOOD' },
  ],
  2019: [
    { name: 'THE BEATLES', plays: 3890, track: 'ABBEY ROAD MEDLEY' },
    { name: 'THE STROKES', plays: 1420, track: 'THE NEW ABNORMAL' },
  ],
  2020: [
    { name: 'HOWARD SHORE', plays: 3263, track: 'CONCERNING HOBBITS' },
    { name: 'THE KILLERS', plays: 2450, track: 'DYING BREED' },
  ],
  2021: [
    { name: 'THE BEATLES', plays: 1450, track: 'GET BACK' },
    { name: 'THE STROKES', plays: 890, track: 'ODE TO THE METS' },
  ],
  2022: [
    { name: 'JUANES', plays: 890, track: 'LA CAMISA NEGRA' },
  ],
  2023: [
    { name: 'EHRLING', plays: 940, track: 'DANCE WITH ME' },
  ],
  2024: [
    { name: 'ANDREA BOCELLI', plays: 780, track: 'TIME TO SAY GOODBYE' },
    { name: 'JUAN GABRIEL', plays: 640, track: 'HASTA QUE TE CONOCI' },
  ],
}

const DONUT_COLORS = ['#ffe500', '#ff4d8d', '#00f5a0', '#b8f500', '#00d2ff', '#ff9900']

function PlainSvgDonut({ data, total }) {
  if (!data || data.length === 0 || total === 0) return null

  let accumulatedAngle = 0
  const radius = 65
  const strokeWidth = 24
  const circumference = 2 * Math.PI * radius

  const slices = data.map((item, idx) => {
    const percentage = item.amount / total
    const strokeDasharray = `${percentage * circumference} ${circumference}`
    const strokeDashoffset = -accumulatedAngle * circumference
    accumulatedAngle += percentage

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      color: DONUT_COLORS[idx % DONUT_COLORS.length],
    }
  })

  return (
    <div className="relative flex items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90 transform" aria-label="Purchase ledger category donut chart">
        <circle cx="90" cy="90" r={radius} fill="transparent" stroke="#111" strokeWidth={strokeWidth + 6} />
        {slices.map((slice, idx) => (
          <motion.circle
            key={idx}
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
        <span className="font-mono text-[12px] font-bold text-ink/75 tracking-wider">TOTAL SPEND</span>
        <span className="font-display text-lg font-bold text-ink">
          ₹{num(Math.round(total))}
        </span>
      </div>
    </div>
  )
}

export default function Explore({ stats, events }) {
  const { selectedYear, setSelectedYear } = useYear()
  const [searchQuery, setSearchQuery] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const searchInputRef = useRef(null)

  const yearStats = getYearStats(events, stats, selectedYear)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    let interval = null
    if (isPlaying) {
      interval = setInterval(() => {
        const yearsList = AVAILABLE_YEARS.filter((y) => y !== 'ALL')
        const currentIdx = yearsList.indexOf(Number(selectedYear))
        if (currentIdx === -1 || currentIdx >= yearsList.length - 1) {
          setIsPlaying(false)
          setSelectedYear(2024)
        } else {
          setSelectedYear(yearsList[currentIdx + 1])
        }
      }, 1500)
    }
    return () => clearInterval(interval)
  }, [isPlaying, selectedYear, setSelectedYear])

  const filteredEvents = useMemo(() => {
    let list = events
    if (selectedYear !== 'ALL') {
      list = list.filter((e) => e.date.startsWith(String(selectedYear)))
    }
    if (!searchQuery.trim()) return list

    const q = searchQuery.toLowerCase()
    return list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.detail && e.detail.toLowerCase().includes(q)) ||
        (e.tags && e.tags.some((t) => t.toLowerCase().includes(q))) ||
        (e.kind && e.kind.toLowerCase().includes(q))
    )
  }, [events, selectedYear, searchQuery])

  const ledgerBreakdown = useMemo(() => {
    let targetEvents = events
    if (selectedYear !== 'ALL') {
      targetEvents = events.filter((e) => e.date.startsWith(String(selectedYear)))
    }

    const yearPurchases = targetEvents.filter(
      (e) => e.unit === 'INR' && e.value && e.value > 0
    )

    if (yearPurchases.length === 0) return { total: 0, categories: [] }

    const catMap = {}
    let total = 0

    yearPurchases.forEach((e) => {
      let cat = 'Other Spending'
      if (e.kind === 'investment' || e.tags?.includes('investing') || e.tags?.includes('big')) {
        cat = 'Investments & FDs'
      } else if (e.type === 'subscription' || e.tags?.includes('subscription')) {
        cat = 'Subscriptions & Services'
      } else if (e.kind === 'salary_first' || e.kind === 'maturity') {
        return
      } else if (e.tags?.includes('big-day') || e.title.includes('Money transfer')) {
        cat = 'Transfers & Capital'
      } else {
        cat = 'Daily & Transportation'
      }

      catMap[cat] = (catMap[cat] || 0) + e.value
      total += e.value
    })

    const categories = Object.keys(catMap).map((catName) => ({
      name: catName,
      amount: catMap[catName],
      pct: Math.round((catMap[catName] / total) * 100),
    }))

    return { total, categories }
  }, [events, selectedYear])

  const artistAudit = useMemo(() => {
    if (selectedYear === 'ALL') {
      return stats.top_artists.slice(0, 5).map((a) => ({ name: a.artist.toUpperCase(), plays: a.plays, track: 'TOP ARTIST' }))
    }
    return ARTIST_DATA_BY_YEAR[selectedYear] || [
      { name: 'THE BEATLES', plays: 450, track: 'GENERAL SCROBBLE' },
      { name: 'VARIOUS ARTISTS', plays: 320, track: 'ARCHIVE MIX' },
    ]
  }, [selectedYear, stats])

  const maxArtistPlays = useMemo(() => {
    return Math.max(...artistAudit.map((a) => a.plays), 1)
  }, [artistAudit])

  return (
    <main className="flex-1 bg-paper font-mono text-ink pb-12 max-w-full overflow-x-hidden">
      <div className="border-b-[3px] border-ink bg-ink px-4 py-2.5 text-paper md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[12px] tracking-widest text-paper/80">
            <span className="h-2 w-2 rounded-full bg-mint animate-pulse" aria-hidden="true" />
            CONSOLE LOG: READ-ONLY DATABASE ACCESS /// MODE: DB_READ_09
          </div>
          <div className="flex items-center gap-2">
            <span className="border border-sun bg-sun/10 px-2 py-0.5 text-[12px] font-bold text-sun">
              SCROBBLES: {yearStats.plays != null ? num(yearStats.plays) : 'No records'}
            </span>
            <span className="border border-hot bg-hot/20 px-2 py-0.5 text-[12px] font-bold text-hot">
              PURCHASES: {yearStats.purchases != null ? num(yearStats.purchases) : 'No records'}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 space-y-6">
        <div className="border-[3px] border-ink bg-white p-4 shadow-brut">
          <div className="mb-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              EXPLORE ARCHIVE LOGS ({selectedYear})
            </h1>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 border-2 border-ink bg-paper px-3 py-2 min-h-[44px]">
              <span className="font-display text-sm font-bold tracking-wider text-ink">
                EXPLORE:
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Beatles, Netflix, Salary, Fixed Deposit..."
                className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink/60 min-h-[36px]"
                aria-label="Search receipts and scrobbles"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => searchInputRef.current?.focus()}
                aria-label="Filter disk search"
                className="min-h-[44px] border-2 border-ink bg-sun px-4 py-2 font-display text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_#111] hover:bg-sun/80 transition"
              >
                FILTER DISK
              </button>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                  className="min-h-[44px] border-2 border-ink bg-hot px-3 py-2 font-mono text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_#111] hover:bg-hot/80 transition"
                >
                  CLEAR [ESC]
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-dashed border-ink/30">
            <span className="text-[12px] font-bold text-ink/75 tracking-wider">
              PRESET AUDITS:
            </span>
            {PRESET_CHIPS.map((chip) => (
              <button
                key={chip.query}
                onClick={() => setSearchQuery(chip.query)}
                aria-label={`Search category ${chip.label}`}
                className={`min-h-[36px] border border-ink/50 px-2.5 py-1 text-[12px] font-bold transition ${
                  searchQuery === chip.query
                    ? 'border-ink bg-hot text-ink shadow-[1px_1px_0_#111]'
                    : 'bg-paper text-ink/80 hover:border-ink hover:bg-sun/40'
                }`}
              >
                + {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ TIMELINE SCRUBBER LINKED TO YEAR CONTEXT ══ */}
        <div className="border-[3px] border-ink bg-white p-4 shadow-brut">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause timeline playback' : 'Start timeline playback'}
              className={`min-h-[44px] flex items-center justify-center gap-2 border-[2px] border-ink px-4 py-2 font-display text-xs font-bold tracking-wider shadow-[2px_2px_0_#111] transition ${
                isPlaying ? 'bg-hot text-ink' : 'bg-mint text-ink hover:bg-mint/80'
              }`}
            >
              <span>{isPlaying ? '⏸ PAUSE TIMELINE' : '▶ PLAY TIMELINE'}</span>
            </button>

            <div className="flex-1 border-2 border-ink bg-[#ff4d8d] px-4 py-2 text-ink shadow-[2px_2px_0_#111]">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-bold">
                <span className="tracking-widest">
                  REWIND LOCKED: {selectedYear}
                </span>
                <span className="font-mono text-[12px] opacity-90">
                  [{YEAR_SUBTITLES[selectedYear] || 'ARCHIVE AUDIT'}]
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto pb-2">
            <div className="flex min-w-[700px] items-center justify-between border-2 border-ink bg-paper p-1.5">
              {AVAILABLE_YEARS.map((y) => {
                const isSelected = selectedYear === y || selectedYear === String(y)
                const isPeak = y === 2017

                return (
                  <button
                    key={y}
                    onClick={() => {
                      setSelectedYear(y)
                      setIsPlaying(false)
                    }}
                    aria-pressed={isSelected}
                    aria-label={`Select year ${y}`}
                    className={`relative flex flex-1 flex-col items-center justify-center py-2 text-xs font-bold transition min-h-[44px] ${
                      isSelected
                        ? 'border-2 border-ink bg-sun text-ink shadow-[2px_2px_0_#111] z-10'
                        : 'text-ink/75 hover:text-ink hover:bg-sun/20'
                    }`}
                  >
                    {isPeak && (
                      <span className="absolute -top-3.5 border border-ink bg-hot px-1 text-[12px] font-black text-ink shadow-[1px_1px_0_#111]">
                        ★ PEAK
                      </span>
                    )}
                    <span>{y}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="border-[3px] border-ink bg-white p-5 shadow-brut flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-[2px] border-ink pb-3 mb-4">
                <div>
                  <div className="text-[12px] font-bold text-ink/75 tracking-widest">
                    EXHIBIT A // {selectedYear} AUDIT REPORT
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink">
                    TOP ARTISTS AUDIT ({selectedYear})
                  </h2>
                </div>
                {selectedYear === 2017 && (
                  <span className="border-2 border-ink bg-sun px-2 py-0.5 text-[12px] font-bold text-ink">
                    ★ PEAK YEAR
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {artistAudit.map((item, idx) => {
                  const pct = Math.round((item.plays / maxArtistPlays) * 100)
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-bold text-ink">
                          {String(idx + 1).padStart(2, '0')}. {item.name}
                        </span>
                        <span className="font-bold text-[#9c0d46]">
                          {num(item.plays)} PLAYS
                        </span>
                      </div>
                      <div className="h-6 w-full border-2 border-ink bg-paper p-0.5 relative">
                        <motion.div
                          className="h-full bg-sun border-r-2 border-ink flex items-center px-2"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.08 }}
                        >
                          {pct > 35 && (
                            <span className="text-[12px] font-bold text-ink truncate">
                              {item.track}
                            </span>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 border-t-2 border-dashed border-ink/30 pt-3 text-[12px] text-ink/75 font-bold">
              AUDITED LOGS FOR {selectedYear}: {yearStats.events.length} EVENTS
            </div>
          </div>

          <div className="border-[3px] border-ink bg-white p-5 shadow-brut flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-[2px] border-ink pb-3 mb-4">
                <div>
                  <div className="text-[12px] font-bold text-ink/75 tracking-widest">
                    EXHIBIT B // {selectedYear} EXPENSE DISSECTION
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink">
                    PURCHASE LEDGER BREAKDOWN
                  </h2>
                </div>
                <span className="border-2 border-ink bg-mint px-2 py-0.5 text-[12px] font-bold text-ink">
                  {selectedYear} AUDITED
                </span>
              </div>

              {ledgerBreakdown.total > 0 ? (
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-around py-2">
                  <PlainSvgDonut
                    data={ledgerBreakdown.categories}
                    total={ledgerBreakdown.total}
                  />

                  <div className="space-y-2 w-full max-w-xs">
                    {ledgerBreakdown.categories.map((cat, idx) => (
                      <div
                        key={cat.name}
                        className="flex items-center justify-between border-b border-dashed border-ink/30 pb-1 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 border border-ink"
                            style={{
                              backgroundColor:
                                DONUT_COLORS[idx % DONUT_COLORS.length],
                            }}
                          />
                          <span className="font-bold text-ink">{cat.name}</span>
                        </div>
                        <span className="font-mono text-ink/80 font-bold">
                          ₹{num(Math.round(cat.amount))} ({cat.pct}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="my-6 border-2 border-dashed border-ink/40 bg-paper p-6 text-center">
                  <div className="text-3xl mb-2" aria-hidden="true">🧾</div>
                  <div className="font-display text-sm font-bold text-ink">
                    NO FINANCIAL RECEIPTS RECORDED IN {selectedYear}
                  </div>
                  <p className="mt-1 text-xs text-ink/75">
                    Bank statements overlap primary window (2015-2018). Music
                    stream logs remain active.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 border-t-2 border-dashed border-ink/30 pt-3 text-[12px] text-ink/75 font-bold">
              BANK AUDIT WINDOW: 2015 – 2018 /// TOTAL LEDGER ENTRIES: {num(stats.purchases)}
            </div>
          </div>
        </div>

        {searchQuery && (
          <div className="border-[3px] border-ink bg-white p-5 shadow-brut">
            <div className="flex items-center justify-between border-b-[2px] border-ink pb-2 mb-3">
              <div className="font-display text-sm font-bold tracking-wider text-ink">
                FILTER MATCHES FOR &quot;{searchQuery}&quot; ({filteredEvents.length} RECORDS FOUND)
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-[#9c0d46] underline hover:text-ink min-h-[44px] px-2"
                aria-label="Clear active query filter"
              >
                CLEAR FILTER
              </button>
            </div>
            <div className="divide-y divide-dashed divide-ink/30 max-h-72 overflow-y-auto">
              {filteredEvents.length === 0 ? (
                <div className="py-4 text-center text-xs text-ink/75">
                  No events found matching your filter query.
                </div>
              ) : (
                filteredEvents.map((evt) => (
                  <div key={evt.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 text-xs gap-1">
                    <div>
                      <span className="font-bold text-ink mr-2">{evt.title}</span>
                      <span className="text-ink/75">{evt.detail}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="border border-ink/40 bg-paper px-1.5 py-0.5 text-[12px] text-ink font-bold">
                        {evt.date}
                      </span>
                      {evt.value && (
                        <span className="font-bold text-[#9c0d46]">
                          {evt.unit === 'INR' ? `₹${num(evt.value)}` : `${num(evt.value)} ${evt.unit}`}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
