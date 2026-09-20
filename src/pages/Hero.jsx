/**
 * Hero Page: Landing experience featuring thermal receipt printer animation, year selector,
 * interactive stat tiles, neo-brutalist stickers, and browser thermal print trigger.
 */
import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { useYear } from '../hooks/useYear'
import { getYearStats } from '../utils/yearStats'
import { playBeep } from '../utils/audio'
import YearSelector from '../components/YearSelector'
import Printer from '../components/Printer'
import Tile from '../components/Tile'

function PrinterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 9V3h10v6" />
      <rect x="3" y="9" width="18" height="8" rx="1" />
      <path d="M7 14h10v7H7z" fill="#ffe500" />
    </svg>
  )
}

function SaveIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

const scrollToAudit = () =>
  document
    .getElementById('audit')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function Hero({ stats, events, printKey, onReprint, beepOn }) {
  const { selectedYear, setSelectedYear, availableYears } = useYear()
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

      <YearSelector
        selectedYear={selectedYear}
        onSelectYear={handleYearChange}
        availableYears={availableYears}
      />

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-8 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <motion.span
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1, rotate: -1 }}
            className="inline-block border-[3px] border-ink bg-hot px-3 py-1 text-[12px] font-bold tracking-widest shadow-brut-sm text-ink"
          >
            ✱ AUDIT PERIOD:{' '}
            {selectedYear === 'ALL' ? '2013–2024' : selectedYear}
          </motion.span>

          <h1 className="mt-5 block w-fit border-[3px] border-ink bg-sun px-4 py-2 font-display text-5xl font-bold leading-[0.95] tracking-tight shadow-brut sm:text-6xl xl:text-7xl">
            YOUR LIFE,
            <br />
            IN RECEIPTS.
          </h1>

          <div className="mt-8 max-w-xl border-[3px] border-ink bg-white p-4 shadow-brut-sm">
            <p className="text-sm leading-relaxed">
              Eleven years of late-night playlists, milk runs, new subscriptions
              and first paycheques — forensically audited on{' '}
              <mark className="bg-sun px-1 font-bold">
                80mm thermal receipt paper
              </mark>
              .
            </p>
            <div className="mt-3 border-t-2 border-dashed border-ink/40 pt-2 text-[12px] tracking-widest text-ink font-bold">
              ACTIVE YEAR: {selectedYear} · LOGS AUDITED:{' '}
              {yearStats.events.length} EVENTS
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

        <Printer printKey={printKey} yearStats={yearStats} />
      </section>

      <section
        id="audit"
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pb-12 pt-4 md:px-8 lg:grid-cols-4 lg:gap-6"
      >
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
          caption={
            selectedYear === 'ALL' ? 'FULL ARCHIVE' : `YEAR ${selectedYear}`
          }
          bg="bg-volt"
          text="text-white"
          rotate={1}
          delay={0.5}
        />
      </section>
    </main>
  )
}

Hero.propTypes = {
  stats: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  printKey: PropTypes.number.isRequired,
  onReprint: PropTypes.func.isRequired,
  beepOn: PropTypes.bool.isRequired,
}
