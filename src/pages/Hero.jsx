/**
 * Hero Page: Landing experience featuring thermal receipt printer animation, year selector,
 * interactive stat tiles, neo-brutalist stickers, and browser thermal print trigger.
 */
import { useState, useEffect, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { useYear, AVAILABLE_YEARS } from '../context/YearContext'
import { getYearStats } from '../utils/yearStats'
import { num, playBeep } from '../lib/helpers'

function zigzag(teeth = 22, depth = 8) {
  const pts = ['0 0', '100% 0']
  for (let i = teeth; i >= 0; i--) {
    pts.push(`${((i * 100) / teeth).toFixed(2)}% ${i % 2 === 0 ? '100%' : `calc(100% - ${depth}px)`}`)
  }
  return `polygon(${pts.join(', ')})`
}
const ZIGZAG = zigzag()
// Simple box-shadow replaces the stacked SVG filter — much cheaper to composite
const BARCODE =
  'repeating-linear-gradient(90deg,#111 0 2px,transparent 2px 4px,#111 4px 5px,transparent 5px 8px,#111 8px 11px,transparent 11px 12px)'

function useCountUp(target, ms = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target == null) {
      setValue(0)
      return
    }
    let raf
    let start
    const tick = (t) => {
      if (!start) start = t
      const p = Math.min((t - start) / ms, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return value
}

const scrollToAudit = () =>
  document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

function PrinterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 9V3h10v6" />
      <rect x="3" y="9" width="18" height="8" rx="1" />
      <path d="M7 14h10v7H7z" fill="#ffe500" />
    </svg>
  )
}

function SaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

function Dash() {
  return <div className="my-2 border-t-2 border-dashed border-ink/40" />
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-3 font-mono text-[12px]">
      <span className="text-ink/80">{k}</span>
      <span className="text-right font-bold text-ink">{v}</span>
    </div>
  )
}

function Sticker({ label, value, bg, textClass = 'text-ink', className, rotate, delay }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{ scale: 1, rotate, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14, delay }}
      className={`absolute z-30 border-[3px] border-ink px-3 py-1.5 shadow-brut-sm ${bg} ${textClass} ${className} text-left`}
    >
      <div className="text-[12px] font-bold tracking-widest">{label}</div>
      <div className="font-display text-sm font-bold leading-tight">{value}</div>
    </motion.div>
  )
}

function Receipt({ yearStats }) {
  if (!yearStats) return null

  const yLabel = yearStats.year === 'ALL' ? 'ALL YEARS (2013-2024)' : `YEAR ${yearStats.year}`

  return (
    <div id="printable-receipt" style={{ boxShadow: '5px 5px 0 #111, 0 0 0 2px #111' }}>
      <div
        className="bg-[#fffdf5] px-4 pb-8 pt-4 font-mono text-[12px] leading-relaxed text-ink"
        style={{ clipPath: ZIGZAG }}
      >
        <div className="text-center">
          <div className="font-display text-base font-bold tracking-wide">RECEIPTS OF A LIFE</div>
          <div className="text-[12px] font-bold text-ink">TERMINAL #001 · {yLabel} · 203 DPI</div>
        </div>

        <Dash />
        <Row k="DATE RANGE:" v={yearStats.dateRange} />
        <Row k="STATUS:" v="VERIFIED AUDIT" />
        <Dash />

        {yearStats.topArtist ? (
          <div className="mb-1.5">
            <div className="font-bold text-ink">01. TOP ARTIST</div>
            <div className="text-ink/80 font-bold">
              {yearStats.topArtist.artist} ({num(yearStats.topArtist.plays)} PLAYS)
            </div>
          </div>
        ) : (
          <Row k="TOP ARTIST:" v="No records" />
        )}

        {yearStats.plays != null ? (
          <Row k="MUSIC SCROBBLES:" v={`${num(yearStats.plays)} PLAYS`} />
        ) : (
          <Row k="MUSIC SCROBBLES:" v="No records" />
        )}

        {yearStats.hours != null ? (
          <Row k="ACOUSTIC TIME:" v={`${num(yearStats.hours)} HOURS`} />
        ) : (
          <Row k="ACOUSTIC TIME:" v="No records" />
        )}

        {yearStats.salary != null ? (
          <Row k="SALARY INFLOW:" v={`₹${num(yearStats.salary)}`} />
        ) : (
          <Row k="SALARY INFLOW:" v="No records" />
        )}

        {yearStats.totalSpend != null ? (
          <Row k="OUTFLOW SPEND:" v={`₹${num(Math.round(yearStats.totalSpend))}`} />
        ) : (
          <Row k="OUTFLOW SPEND:" v="No records" />
        )}

        {yearStats.investmentsCount > 0 ? (
          <Row
            k="INVESTMENTS:"
            v={yearStats.investmentsTotal ? `₹${num(yearStats.investmentsTotal)} (${yearStats.investmentsCount})` : `${yearStats.investmentsCount} MOVES`}
          />
        ) : (
          <Row k="INVESTMENTS:" v="No records" />
        )}

        {yearStats.subscriptionsCount > 0 ? (
          <Row k="SUBSCRIPTIONS:" v={`${yearStats.subscriptionsCount} ACTIVE`} />
        ) : (
          <Row k="SUBSCRIPTIONS:" v="No records" />
        )}

        {yearStats.busiestMonth && (
          <Row k="PEAK MONTH:" v={yearStats.busiestMonth} />
        )}

        <Dash />
        <Row k="SUBTOTAL (LOGS):" v={`${yearStats.events.length} EVENTS`} />

        <div className="mt-3 flex items-center justify-between border-2 border-ink bg-sun px-3 py-1.5 font-bold">
          <span className="font-display text-sm">TOTAL:</span>
          <span className="text-xs">
            {yearStats.totalSpend ? `₹${num(Math.round(yearStats.totalSpend))} spent` : yearStats.plays ? `${num(yearStats.plays)} plays` : '0 items'}
          </span>
        </div>

        <div className="mt-4 h-9" style={{ background: BARCODE }} />
        <div className="mt-1 text-center text-[12px] font-bold tracking-widest">
          *POS-{yearStats.year}-AUDITED*
        </div>
      </div>
    </div>
  )
}

function Printer({ printKey, yearStats }) {
  return (
    <div className="relative mx-auto w-full max-w-[440px] pt-6">
      <Sticker
        label="MUSIC AUDIT"
        value={yearStats.plays != null ? `${num(yearStats.plays)} TRACKS` : 'No records'}
        bg="bg-sun"
        className="-left-2 top-0 sm:-left-6"
        rotate={-5}
        delay={0.3}
      />
      <Sticker
        label="ACOUSTIC SPAN"
        value={yearStats.hours != null ? `${num(yearStats.hours)} HOURS` : 'No records'}
        bg="bg-hot"
        className="-right-2 top-24 sm:-right-8"
        rotate={4}
        delay={0.4}
      />
      <Sticker
        label="AUDITED SLIPS"
        value={yearStats.purchases != null ? `${num(yearStats.purchases)} PURCHASES` : 'No records'}
        bg="bg-volt"
        textClass="text-white"
        className="-left-2 bottom-10 sm:-left-8"
        rotate={-3}
        delay={0.5}
      />

      <div className="relative z-20 border-[3px] border-ink bg-ink px-3 pb-3 pt-2 text-paper shadow-brut">
        <div className="flex justify-between text-[12px] tracking-widest text-paper">
          <span>PRINT HEAD MK-IV</span>
          <span>
            80MM <span className="text-mint font-bold">● READY</span>
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between border-2 border-sun bg-sun/10 px-2 py-1 text-[12px] text-sun font-bold">
          <span>⚠ ACTIVE AUDIT YEAR: {yearStats.year}</span>
          <span className="opacity-80">203 DPI THERMAL</span>
        </div>
        <div className="mt-2 h-2 border border-paper/30 bg-black" />
      </div>

      <div className="relative z-10 mx-3 overflow-hidden px-2 pb-3">
        <div key={`${printKey}-${yearStats.year}`} className="printing">
          <Receipt yearStats={yearStats} />
        </div>
      </div>
    </div>
  )
}

const Tile = memo(function Tile({ label, icon, value, suffix = '', caption, bg, text = 'text-ink', rotate, delay }) {
  const shown = useCountUp(value)

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1, rotate }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay }}
      className={`border-[3px] border-ink p-4 shadow-brut ${bg} ${text}`}
    >
      <div className="flex items-start justify-between">
        <span className="border-2 border-ink bg-white px-1.5 py-0.5 text-[12px] font-bold tracking-widest text-ink">{label}</span>
        <span className="text-lg" aria-hidden="true">{icon}</span>
      </div>
      <div className="mt-3 min-w-[4ch] font-display text-4xl font-bold leading-none tracking-tight tabular-nums md:text-5xl">
        {value != null ? shown.toLocaleString('en-US') : '—'}
        {value != null && suffix && <span className="ml-1 text-2xl md:text-3xl">{suffix}</span>}
      </div>
      <div className="mt-2 text-[12px] font-bold tracking-widest">
        {value != null ? caption : 'No records for this year'}
      </div>
    </motion.div>
  )
})

export default function Hero({ stats, events, printKey, onReprint, beepOn }) {
  const { selectedYear, setSelectedYear } = useYear()
  const yearStats = useMemo(
    () => getYearStats(events, stats, selectedYear),
    [events, stats, selectedYear]
  )

  const handleYearChange = (y) => {
    setSelectedYear(y)
    if (beepOn) playBeep()
  }

  const handleSaveReceipt = () => {
    if (beepOn) playBeep()
    window.print()
  }

  return (
    <main className="relative flex-1 max-w-full overflow-x-hidden">
      <svg
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="thread" d="M 380 250 C 500 110, 640 110, 760 250" />
        <path className="thread" d="M 300 640 C 520 600, 720 420, 850 240" />
      </svg>

      <section className="no-print relative z-20 border-b-[3px] border-ink bg-paper px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          <span className="font-mono text-[12px] font-bold tracking-widest text-ink/80">
            ▼ SELECT AUDIT YEAR:
          </span>
          {AVAILABLE_YEARS.map((y) => {
            const isSelected = String(selectedYear) === String(y)
            return (
              <button
                key={y}
                onClick={() => handleYearChange(y)}
                aria-pressed={isSelected}
                aria-label={`Select year ${y}`}
                className={`min-h-[44px] border-2 px-3 py-1 font-mono text-[12px] font-bold tracking-wider transition ${
                  isSelected
                    ? 'border-ink bg-sun text-ink shadow-[2px_2px_0_#111]'
                    : 'border-ink/50 bg-white text-ink/80 hover:border-ink hover:bg-sun/30'
                }`}
              >
                {y}
              </button>
            )
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-8 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <motion.span
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1, rotate: -1 }}
            className="inline-block border-[3px] border-ink bg-hot px-3 py-1 text-[12px] font-bold tracking-widest shadow-brut-sm text-ink"
          >
            ✱ AUDIT PERIOD: {selectedYear === 'ALL' ? '2013–2024' : selectedYear}
          </motion.span>

          <h1 className="mt-5 block w-fit border-[3px] border-ink bg-sun px-4 py-2 font-display text-5xl font-bold leading-[0.95] tracking-tight shadow-brut sm:text-6xl xl:text-7xl">
            YOUR LIFE,
            <br />
            IN RECEIPTS.
          </h1>

          <div className="mt-8 max-w-xl border-[3px] border-ink bg-white p-4 shadow-brut-sm">
            <p className="text-sm leading-relaxed">
              Eleven years of late-night playlists, milk runs, new subscriptions and first paycheques —
              forensically audited on{' '}
              <mark className="bg-sun px-1 font-bold">80mm thermal receipt paper</mark>.
            </p>
            <div className="mt-3 border-t-2 border-dashed border-ink/40 pt-2 text-[12px] tracking-widest text-ink font-bold">
              ACTIVE YEAR: {selectedYear} · LOGS AUDITED: {yearStats.events.length} EVENTS
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onReprint}
              aria-label="Print story receipt"
              className="flex min-h-[44px] items-center gap-2 border-[3px] border-ink bg-sun px-5 py-3 font-display text-sm font-bold tracking-wide shadow-brut transition hover:-translate-y-0.5 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
            >
              <PrinterIcon /> PRINT MY STORY
            </button>
            <button
              onClick={handleSaveReceipt}
              aria-label="Save or print thermal receipt"
              className="flex min-h-[44px] items-center gap-2 border-[3px] border-ink bg-mint px-5 py-3 font-display text-sm font-bold tracking-wide text-ink shadow-brut transition hover:-translate-y-0.5 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
            >
              <SaveIcon /> SAVE RECEIPT
            </button>
            <button
              onClick={scrollToAudit}
              aria-label="Read the audit – scroll down"
              className="min-h-[44px] border-[3px] border-ink bg-white px-4 py-3 text-[12px] font-bold tracking-wider shadow-brut-sm transition hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              READ AUDIT ↓
            </button>
          </div>
        </div>

        <Printer
          printKey={printKey}
          yearStats={yearStats}
        />
      </section>

      <section id="audit" className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pb-12 pt-4 md:px-8 lg:grid-cols-4 lg:gap-6">
        <Tile
          key={`music-${selectedYear}-${yearStats.plays}`}
          label="MUSIC AUDIT"
          icon="♪"
          value={yearStats.plays}
          caption="TRACKS PLAYED"
          bg="bg-sun"
          rotate={-1}
          delay={0.2}
        />
        <Tile
          key={`hours-${selectedYear}-${yearStats.hours}`}
          label="TIME LOST"
          icon="◔"
          value={yearStats.hours}
          suffix="hrs"
          caption="ACOUSTIC SPAN"
          bg="bg-hot"
          rotate={1}
          delay={0.3}
        />
        <Tile
          key={`purchases-${selectedYear}-${yearStats.purchases}`}
          label="PURCHASE LEDGER"
          icon="₹"
          value={yearStats.purchases}
          caption="PURCHASES"
          bg="bg-white"
          rotate={-0.5}
          delay={0.4}
        />
        <Tile
          key={`timeline-${selectedYear}`}
          label="TIMELINE"
          icon="▣"
          value={selectedYear === 'ALL' ? 12 : 1}
          suffix={selectedYear === 'ALL' ? 'Years' : 'Year'}
          caption={selectedYear === 'ALL' ? 'FULL ARCHIVE' : `YEAR ${selectedYear}`}
          bg="bg-volt"
          text="text-white"
          rotate={1}
          delay={0.5}
        />
      </section>
    </main>
  )
}
