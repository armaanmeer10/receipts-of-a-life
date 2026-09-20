import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { num, fmtDate } from '../lib/helpers'

/* ─── constants derived from data ─── */
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

const ALL_YEARS = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]

function chapterForYear(y) {
  return CHAPTERS.find((c) => c.years.includes(y)) || CHAPTERS[0]
}

/* ─── small ui pieces ─── */
function Label({ children, bg = 'bg-hot', text = 'text-ink' }) {
  return (
    <span className={`inline-block border-2 border-ink px-2 py-0.5 text-[12px] font-bold tracking-widest ${bg} ${text}`}>
      {children}
    </span>
  )
}

function Dash() {
  return <div className="my-2 border-t-2 border-dashed border-ink/30" />
}

function SectionHead({ icon, title, badge }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {icon && <span className="text-base" aria-hidden="true">{icon}</span>}
      <span className="font-display text-[12px] font-bold tracking-widest text-ink">{title}</span>
      {badge && (
        <span className="ml-auto border border-hot bg-hot/20 px-1.5 py-0.5 text-[11px] font-bold tracking-widest text-hot">
          {badge}
        </span>
      )}
    </div>
  )
}

/* ─── LEFT PANEL: Core Spindle Stats ─── */
function CoreStats({ stats }) {
  const [startISO, endISO] = stats.spotify_range
  const spanDays = Math.round((new Date(endISO) - new Date(startISO)) / 86400000)
  const avgPerDay = (stats.plays / spanDays).toFixed(1)
  const totalHrs = Math.floor(stats.hours)
  const spoolsLeft = stats.years

  const rows = [
    { k: 'AV/EL SPEED:', v: `${avgPerDay} PER DAY` },
    { k: 'FULL LENGTH:', v: `${num(totalHrs)} HOURS` },
    { k: 'SPOOLS REMAINING:', v: `${spoolsLeft} / 6 STATIONS` },
  ]

  return (
    <div className="border-[3px] border-ink bg-white p-4 shadow-brut-sm">
      <SectionHead icon="◉" title="CORE SPINDLE STATS" badge="LIVE" />
      <Dash />
      {rows.map((r) => (
        <div key={r.k} className="flex justify-between gap-3 py-0.5 font-mono text-[12px]">
          <span className="text-ink/70">{r.k}</span>
          <span className="font-bold">{r.v}</span>
        </div>
      ))}
      <Dash />
      <div className="mt-1 border-2 border-dashed border-ink/40 bg-paper px-3 py-2 font-mono text-[11px] text-ink/60">
        MOTION PARAMETERS OK · THERMAL HEAD: 203 DPI ARCHIVAL GRADE
      </div>
    </div>
  )
}

/* ─── LEFT PANEL: Year Scrubber ─── */
function YearScrubber({ activeYear, onYear }) {
  return (
    <div className="border-[3px] border-ink bg-white p-4 shadow-brut-sm">
      <SectionHead icon="◎" title="YEAR SCRUBBER" badge="TO THE ARCHIVE" />
      <Dash />
      <div className="grid grid-cols-4 gap-1.5">
        {ALL_YEARS.map((y) => {
          const ch = chapterForYear(y)
          const active = y === activeYear
          return (
            <button
              key={y}
              onClick={() => onYear(y)}
              className={`border-2 py-1.5 text-[12px] font-bold tracking-wider transition
                ${active
                  ? `border-ink ${ch.color} ${ch.textColor} shadow-[2px_2px_0_#111]`
                  : 'border-ink/40 bg-paper/60 text-ink/60 hover:border-ink hover:bg-sun/30'
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

/* ─── LEFT PANEL: Chapter Rolls ─── */
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
              className={`flex w-full items-start justify-between gap-2 border-b border-dashed border-ink/20 py-2 text-left transition last:border-0
                ${active ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 border-[2px] border-ink px-1 text-[10px] font-bold ${ch.color} ${ch.textColor}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className={`font-display text-[12px] font-bold leading-tight ${active ? 'text-ink' : 'text-ink/70'}`}>
                    {ch.label}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-ink/50">{ch.dateRange}</div>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-ink/40">
                {ch.years.join('–')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── RIGHT PANEL: Biography tape header ─── */
function BiographyHeader({ stats }) {
  const [startISO, endISO] = stats.spotify_range
  const startY = startISO.slice(0, 4)
  const endY = endISO.slice(0, 4)

  return (
    <div className="border-b-[3px] border-ink/30 pb-5 text-center">
      <div className="mb-3 inline-flex items-center gap-2 border-[2px] border-paper/40 px-4 py-1">
        <span className="text-mint text-[12px]">●</span>
        <span className="font-mono text-[12px] tracking-widest text-paper/80">OFFICIAL BIOGRAPHY TAPE</span>
        <span className="text-mint text-[12px]">●</span>
      </div>

      <div className="font-display text-4xl font-bold leading-tight text-paper sm:text-5xl">
        RECEIPTS OF A LIFE
      </div>
      <p className="mt-3 mx-auto max-w-sm font-mono text-[12px] leading-relaxed text-paper/60">
        {stats.plays.toLocaleString()} plays of Spotify browsing, {num(stats.purchases)} bank
        statements, {num(stats.artists)} iTunes crumbs &amp; digital exhaust.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 font-mono text-[11px] text-paper/40">
        {[
          `TERMINAL ID: POS-${startY}-07`,
          `PRINTER: THERMAL BUILT-BEGIN`,
          `BATTERY: RUNNING`,
          `COMPILER: UDC / FORKED`,
        ].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── RIGHT PANEL: Chapter detail ─── */
function ChapterDetail({ chapter, events }) {
  if (!chapter) return null
  const chEvents = events
    .filter((e) => e.chapter === chapter.id)
    .sort((a, b) => a.date.localeCompare(b.date))

  const highlight = chEvents.find((e) => ['first_play', 'salary_first', 'peak_month', 'surge', 'last_receipt'].includes(e.kind))
  const listEvents = chEvents.filter((e) => e !== highlight).slice(0, 6)

  const totalVal = chEvents.reduce((s, e) => s + (e.value || 0), 0)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={chapter.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
        className="space-y-4"
      >
        {/* chapter header strip */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 font-mono text-[11px] tracking-widest text-paper/40">
              ROLL SEGMENT MORE
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
              {chapter.label}
            </h2>
            <div className="mt-1 font-mono text-[12px] text-paper/50">
              TIMEFRAME: {chapter.dateRange}
            </div>
          </div>
          <div
            className={`shrink-0 rotate-[3deg] border-[3px] border-paper/80 px-3 py-2 text-center font-display text-[11px] font-bold leading-tight tracking-wider ${chapter.color} ${chapter.textColor}`}
          >
            AUDIT<br />ORIGIN
          </div>
        </div>

        {/* highlighted event */}
        {highlight && (
          <div className="border-2 border-mint/60 bg-mint/10 px-3 py-2">
            <div className="mb-1 font-mono text-[11px] font-bold tracking-widest text-mint">
              ▶ AUDIT SIGNAL VERIFIED
            </div>
            <div className="font-mono text-[12px] text-paper/80">{highlight.title}</div>
            <div className="mt-1 font-mono text-[11px] text-paper/50">{highlight.detail}</div>
          </div>
        )}

        {/* event list */}
        <div className="border-[2px] border-paper/20 bg-paper/5">
          <div className="border-b border-paper/20 px-3 py-1.5 font-mono text-[11px] tracking-widest text-paper/40">
            EVENT LOG ·  {chEvents.length} ENTRIES
          </div>
          <div className="divide-y divide-paper/10">
            {listEvents.map((e) => (
              <div key={e.id} className="flex items-start justify-between gap-3 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-[12px] text-paper/80">{e.title}</div>
                  <div className="font-mono text-[11px] text-paper/40">{fmtDate(e.date)}</div>
                </div>
                {e.value != null && (
                  <div className="shrink-0 font-mono text-[12px] font-bold text-sun">
                    {e.unit === 'INR'
                      ? `₹${num(Math.round(e.value))}`
                      : `${e.unit === 'plays' ? num(e.value) : e.value} ${e.unit}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* subtotal */}
        <div className="flex items-center justify-between border-t-2 border-dashed border-paper/30 pt-3 font-mono">
          <span className="text-[12px] font-bold tracking-widest text-paper/60">
            CHA SUBTOTAL (CAFFEINE &amp; SCROBBLES):
          </span>
          <span className="text-[12px] font-bold text-sun">
            {totalVal > 0 ? `₹${num(Math.round(totalVal))} / ${chEvents.length} MIN` : `${chEvents.length} EVENTS`}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ─── RIGHT PANEL: Thermal print head header bar ─── */
function PrintHeadBar({ isEmitting, onToggle }) {
  return (
    <div className="flex items-center justify-between border-b-[3px] border-ink/40 bg-ink px-4 py-2">
      <div className="flex items-center gap-2 font-mono text-[12px] tracking-widest text-paper/70">
        <span className={`text-base ${isEmitting ? 'text-mint animate-pulse' : 'text-paper/30'}`}>●</span>
        CITIZEN THERMAL PRINT HEAD: {isEmitting ? 'EMITTING ///' : 'PAUSED'}
      </div>
      <button
        onClick={onToggle}
        className="border-[2px] border-paper/40 bg-paper/10 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-paper/70 transition hover:bg-paper/20"
      >
        {isEmitting ? 'PAUSE ACTION' : 'RESUME ▶'}
      </button>
    </div>
  )
}

/* ─── PAGE ─── */
export default function StoryRoll({ stats, events }) {
  const [activeYear, setActiveYear] = useState(2013)
  const [activeChapterId, setActiveChapterId] = useState('ch1')
  const [emitting, setEmitting] = useState(true)

  const activeChapter = CHAPTERS.find((c) => c.id === activeChapterId)

  const handleYearClick = (y) => {
    setActiveYear(y)
    const ch = chapterForYear(y)
    setActiveChapterId(ch.id)
  }

  const handleChapterClick = (id) => {
    setActiveChapterId(id)
    const ch = CHAPTERS.find((c) => c.id === id)
    if (ch) setActiveYear(ch.years[0])
  }

  return (
    <main className="flex-1 bg-paper">
      {/* ── page title strip ── */}
      <div className="border-b-[3px] border-ink bg-ink px-4 py-2 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <span className="font-display text-[12px] font-bold tracking-widest text-paper">STORY ROLL</span>
          <span className="font-mono text-[12px] text-paper/40">·</span>
          <span className="font-mono text-[12px] text-paper/50 tracking-wider">
            {stats.plays.toLocaleString()} PLAYS · {stats.spotify_range[0].slice(0,4)}–{stats.spotify_range[1].slice(0,4)}
          </span>
          <span className="ml-auto border border-hot bg-hot/20 px-2 py-0.5 font-mono text-[11px] font-bold tracking-widest text-hot">
            ARCHIVAL MODE
          </span>
        </div>
      </div>

      {/* ── two-column body ── */}
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[440px_1fr]">

        {/* ════ LEFT PANEL ════ */}
        <div className="space-y-4 border-r-0 border-ink p-4 lg:border-r-[3px] lg:p-6">
          <CoreStats stats={stats} />
          <YearScrubber activeYear={activeYear} onYear={handleYearClick} />
          <ChapterRolls activeChapter={activeChapterId} onChapter={handleChapterClick} />
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className="flex flex-col bg-ink text-paper">
          <PrintHeadBar isEmitting={emitting} onToggle={() => setEmitting((v) => !v)} />

          <div className="flex-1 overflow-y-auto p-5 lg:p-8">
            <div className="mx-auto max-w-xl space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <BiographyHeader stats={stats} />
              </motion.div>

              <div className="border-t-[3px] border-paper/10 pt-6">
                <ChapterDetail chapter={activeChapter} events={events} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
