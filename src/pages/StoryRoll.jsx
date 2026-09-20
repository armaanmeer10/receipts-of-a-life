import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useYear, AVAILABLE_YEARS } from '../context/YearContext'
import { getYearStats } from '../utils/yearStats'
import { num, fmtDate } from '../lib/helpers'

const CHAPTERS = [
  {
    id: 'ch1',
    label: 'LATE-NIGHT BEGINNINGS',
    dateRange: 'JUL 2013 – AUG 2014',
    years: [2013, 2014],
    color: 'bg-hot',
    textColor: 'text-ink',
    tag: 'FIRST SIGNAL',
    desc: 'The archive wakes up. A single play at 02:44 AM starts eleven years of data.',
  },
  {
    id: 'ch2',
    label: 'THE WINTER PIVOT',
    dateRange: 'JAN 2015 – DEC 2016',
    years: [2015, 2016],
    color: 'bg-sun',
    textColor: 'text-ink',
    tag: 'INCOME BEGINS',
    desc: 'First salary. First investments. First subscriptions. The ledger opens.',
  },
  {
    id: 'ch3',
    label: 'THE YEAR OF EVERYTHING',
    dateRange: 'JAN 2017 – DEC 2017',
    years: [2017],
    color: 'bg-volt',
    textColor: 'text-white',
    tag: 'PEAK CHAOS',
    desc: 'Peak listening month. ₹2 lakh in fixed deposits. The Beatles every single day.',
  },
  {
    id: 'ch4',
    label: 'PEAK VOLUME & AMBIENCE',
    dateRange: 'JAN 2018 – DEC 2020',
    years: [2018, 2019, 2020],
    color: 'bg-mint',
    textColor: 'text-ink',
    tag: 'MAX SIGNAL',
    desc: 'The ledger closes. The music keeps going. 5,176 plays in a single month.',
  },
  {
    id: 'ch5',
    label: 'THE QUIET YEARS',
    dateRange: 'JAN 2021 – DEC 2024',
    years: [2021, 2022, 2023, 2024],
    color: 'bg-paper',
    textColor: 'text-ink',
    tag: 'FADE OUT',
    desc: 'Fewer receipts. Bigger gaps. The archive winds down quietly.',
  },
]

function chapterForYear(y) {
  if (y === 'ALL') return CHAPTERS[0]
  return CHAPTERS.find((c) => c.years.includes(Number(y))) || CHAPTERS[0]
}

function Dash() {
  return <div className="my-2 border-t-2 border-dashed border-ink/40" />
}

function SectionHead({ icon, title, badge }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {icon && <span className="text-base" aria-hidden="true">{icon}</span>}
      <span className="font-display text-[12px] font-bold tracking-widest text-ink">{title}</span>
      {badge && (
        <span className="ml-auto border border-hot bg-hot/20 px-2 py-0.5 text-[12px] font-bold tracking-widest text-[#880e4f]">
          {badge}
        </span>
      )}
    </div>
  )
}

function CoreStats({ yearStats }) {
  const playsText = yearStats.plays != null ? `${num(yearStats.plays)} PLAYS` : 'No records'
  const hoursText = yearStats.hours != null ? `${num(yearStats.hours)} HOURS` : 'No records'
  const purchasesText = yearStats.purchases != null ? `${num(yearStats.purchases)} PURCHASES` : 'No records'

  const rows = [
    { k: 'ACTIVE AUDIT:', v: `${yearStats.dateRange}` },
    { k: 'MUSIC PLAYS:', v: playsText },
    { k: 'ACOUSTIC HOURS:', v: hoursText },
    { k: 'LEDGER ENTRIES:', v: purchasesText },
  ]

  return (
    <div className="border-[3px] border-ink bg-white p-4 shadow-brut-sm">
      <SectionHead icon="◉" title="CORE SPINDLE STATS" badge="LIVE" />
      <Dash />
      {rows.map((r) => (
        <div key={r.k} className="flex justify-between gap-3 py-0.5 font-mono text-[12px]">
          <span className="text-ink/75">{r.k}</span>
          <span className="font-bold">{r.v}</span>
        </div>
      ))}
      <Dash />
      <div className="mt-1 border-2 border-dashed border-ink/40 bg-paper px-3 py-2 font-mono text-[12px] text-ink/75 font-bold">
        MOTION PARAMETERS OK · THERMAL HEAD: 203 DPI ARCHIVAL GRADE
      </div>
    </div>
  )
}

function YearScrubber({ selectedYear, onYear }) {
  return (
    <div className="border-[3px] border-ink bg-white p-4 shadow-brut-sm">
      <SectionHead icon="◎" title="YEAR SCRUBBER" badge="TO THE ARCHIVE" />
      <Dash />
      <div className="grid grid-cols-4 gap-1.5">
        {AVAILABLE_YEARS.map((y) => {
          const ch = chapterForYear(y)
          const active = String(y) === String(selectedYear)
          return (
            <button
              key={y}
              onClick={() => onYear(y)}
              aria-pressed={active}
              aria-label={`Scrub to year ${y}`}
              className={`border-2 py-2 text-[12px] font-bold tracking-wider transition min-h-[44px]
                ${active
                  ? `border-ink ${ch.color} ${ch.textColor} shadow-[2px_2px_0_#111]`
                  : 'border-ink/50 bg-paper text-ink/75 hover:border-ink hover:bg-sun/40'
                }`}
            >
              {y}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ChapterRolls({ activeChapter, onChapter }) {
  return (
    <div className="border-[3px] border-ink bg-white p-4 shadow-brut-sm">
      <SectionHead icon="☷" title="CHAPTER ROLLS" />
      <Dash />
      <div className="space-y-1">
        {CHAPTERS.map((ch, i) => {
          const active = ch.id === activeChapter
          return (
            <button
              key={ch.id}
              onClick={() => onChapter(ch.id)}
              aria-label={`Select chapter ${ch.label}`}
              className={`flex w-full items-start justify-between gap-2 border-b border-dashed border-ink/30 py-2.5 text-left transition min-h-[44px] last:border-0
                ${active ? 'opacity-100 font-bold' : 'opacity-75 hover:opacity-100'}`}
            >
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 border-[2px] border-ink px-1.5 py-0.5 text-[12px] font-bold ${ch.color} ${ch.textColor}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className={`font-display text-[12px] font-bold leading-tight ${active ? 'text-ink' : 'text-ink/80'}`}>
                    {ch.label}
                  </div>
                  <div className="mt-0.5 font-mono text-[12px] text-ink/70">{ch.dateRange}</div>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[12px] text-ink/65 font-bold">
                {ch.years.join('–')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BiographyHeader({ stats, yearStats }) {
  const [startISO] = stats.spotify_range
  const startY = startISO.slice(0, 4)

  const playsText = yearStats.plays != null ? `${num(yearStats.plays)} plays` : 'No plays'
  const purchasesText = yearStats.purchases != null ? `${num(yearStats.purchases)} purchases` : 'No bank receipts'

  return (
    <div className="border-b-[3px] border-ink/40 pb-5 text-center">
      <div className="mb-3 inline-flex items-center gap-2 border-[2px] border-paper/60 px-4 py-1">
        <span className="text-mint text-[12px]">●</span>
        <span className="font-mono text-[12px] tracking-widest text-paper font-bold">
          OFFICIAL BIOGRAPHY TAPE · {yearStats.year}
        </span>
        <span className="text-mint text-[12px]">●</span>
      </div>

      <h1 className="font-display text-3xl font-bold leading-tight text-paper sm:text-4xl md:text-5xl">
        STORY ROLL: RECEIPTS OF A LIFE
      </h1>
      <p className="mt-3 mx-auto max-w-sm font-mono text-[12px] leading-relaxed text-paper/80 font-bold">
        {playsText} of Spotify browsing, {purchasesText} bank statements, digital exhaust.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 font-mono text-[12px] text-paper/70 font-bold">
        {[
          `TERMINAL ID: POS-${startY}-07`,
          `PRINTER: THERMAL BUILT-BEGIN`,
          `ACTIVE AUDIT YEAR: ${yearStats.year}`,
        ].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  )
}

function ChapterDetail({ chapter, events, selectedYear }) {
  if (!chapter) return null
  let chEvents = events.filter((e) => e.chapter === chapter.id)

  if (selectedYear !== 'ALL') {
    chEvents = chEvents.filter((e) => e.date && String(e.date).includes(String(selectedYear)))
  }

  chEvents.sort((a, b) => a.date.localeCompare(b.date))

  const highlight = chEvents.find((e) => ['first_play', 'salary_first', 'peak_month', 'surge', 'last_receipt'].includes(e.kind))
  const listEvents = chEvents.filter((e) => e !== highlight).slice(0, 8)
  const totalVal = chEvents.reduce((s, e) => s + (e.value || 0), 0)

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
            <div className="mb-1 font-mono text-[12px] tracking-widest text-paper/70 font-bold">
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
            AUDIT<br />ORIGIN
          </div>
        </div>

        {highlight && (
          <div className="border-2 border-mint bg-mint/15 px-3 py-2">
            <div className="mb-1 font-mono text-[12px] font-bold tracking-widest text-mint">
              ▶ AUDIT SIGNAL VERIFIED
            </div>
            <div className="font-mono text-[12px] font-bold text-paper">{highlight.title}</div>
            <div className="mt-1 font-mono text-[12px] text-paper/80">{highlight.detail}</div>
          </div>
        )}

        <div className="border-[2px] border-paper/30 bg-paper/10">
          <div className="border-b border-paper/30 px-3 py-2 font-mono text-[12px] font-bold tracking-widest text-paper/80">
            EVENT LOG · {chEvents.length} ENTRIES ({selectedYear})
          </div>
          <div className="divide-y divide-paper/20">
            {chEvents.length === 0 ? (
              <div className="p-4 text-center text-xs text-paper/70 font-mono">
                No records logged for this chapter in year {selectedYear}.
              </div>
            ) : (
              listEvents.map((e) => (
                <div key={e.id} className="flex items-start justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono text-[12px] font-bold text-paper">{e.title}</div>
                    <div className="font-mono text-[12px] text-paper/70">{fmtDate(e.date)}</div>
                  </div>
                  {e.value != null && (
                    <div className="shrink-0 font-mono text-[12px] font-bold text-sun">
                      {e.unit === 'INR'
                        ? `₹${num(Math.round(e.value))}`
                        : `${e.unit === 'plays' ? num(e.value) : e.value} ${e.unit}`}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t-2 border-dashed border-paper/40 pt-3 font-mono">
          <span className="text-[12px] font-bold tracking-widest text-paper/80">
            CHA SUBTOTAL:
          </span>
          <span className="text-[12px] font-bold text-sun">
            {totalVal > 0 ? `₹${num(Math.round(totalVal))} / ${chEvents.length} EVENTS` : `${chEvents.length} EVENTS`}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function PrintHeadBar({ isEmitting, onToggle }) {
  return (
    <div className="flex items-center justify-between border-b-[3px] border-ink/40 bg-ink px-4 py-2">
      <div className="flex items-center gap-2 font-mono text-[12px] tracking-widest text-paper/80">
        <span className={`text-base ${isEmitting ? 'text-mint animate-pulse' : 'text-paper/40'}`}>●</span>
        CITIZEN THERMAL PRINT HEAD: {isEmitting ? 'EMITTING ///' : 'PAUSED'}
      </div>
      <button
        onClick={onToggle}
        aria-label={isEmitting ? 'Pause print emission' : 'Resume print emission'}
        className="min-h-[44px] border-[2px] border-paper/40 bg-paper/10 px-3 py-1.5 font-mono text-[12px] font-bold tracking-wider text-paper transition hover:bg-paper/20"
      >
        {isEmitting ? 'PAUSE ACTION' : 'RESUME ▶'}
      </button>
    </div>
  )
}

export default function StoryRoll({ stats, events }) {
  const { selectedYear, setSelectedYear } = useYear()
  const [activeChapterId, setActiveChapterId] = useState('ch1')
  const [emitting, setEmitting] = useState(true)

  const yearStats = useMemo(() => {
    return getYearStats(events, stats, selectedYear)
  }, [events, stats, selectedYear])

  useEffect(() => {
    if (selectedYear !== 'ALL') {
      const ch = chapterForYear(selectedYear)
      setActiveChapterId(ch.id)
    }
  }, [selectedYear])

  const activeChapter = CHAPTERS.find((c) => c.id === activeChapterId)

  const handleYearClick = (y) => {
    setSelectedYear(y)
    const ch = chapterForYear(y)
    setActiveChapterId(ch.id)
  }

  const handleChapterClick = (id) => {
    setActiveChapterId(id)
    const ch = CHAPTERS.find((c) => c.id === id)
    if (ch && ch.years?.[0]) setSelectedYear(ch.years[0])
  }

  return (
    <main className="flex-1 bg-paper max-w-full overflow-x-hidden">
      <div className="border-b-[3px] border-ink bg-ink px-4 py-2.5 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <span className="font-display text-[12px] font-bold tracking-widest text-paper">STORY ROLL</span>
          <span className="font-mono text-[12px] text-paper/50">·</span>
          <span className="font-mono text-[12px] text-paper/80 tracking-wider font-bold">
            YEAR: {selectedYear} · {yearStats.events.length} EVENTS
          </span>
          <span className="ml-auto border border-hot bg-hot/20 px-2 py-0.5 font-mono text-[12px] font-bold tracking-widest text-hot">
            ARCHIVAL MODE
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[440px_1fr]">
        <div className="space-y-4 border-r-0 border-ink p-4 lg:border-r-[3px] lg:p-6">
          <CoreStats yearStats={yearStats} />
          <YearScrubber selectedYear={selectedYear} onYear={handleYearClick} />
          <ChapterRolls activeChapter={activeChapterId} onChapter={handleChapterClick} />
        </div>

        <div className="flex flex-col bg-ink text-paper">
          <PrintHeadBar isEmitting={emitting} onToggle={() => setEmitting((v) => !v)} />

          <div className="flex-1 overflow-y-auto p-5 lg:p-8">
            <div className="mx-auto max-w-xl space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <BiographyHeader stats={stats} yearStats={yearStats} />
              </motion.div>

              <div className="border-t-[3px] border-paper/20 pt-6">
                <ChapterDetail chapter={activeChapter} events={events} selectedYear={selectedYear} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
