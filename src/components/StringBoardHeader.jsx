import PropTypes from 'prop-types'
import { AVAILABLE_YEARS } from '../constants'

const FILTER_CATS = [
  {
    id: 'all',
    label: 'ALL CONNECTIONS',
    active: 'bg-ink text-paper border-ink',
  },
  {
    id: 'music',
    label: 'MUSIC & SCROBBLES',
    active: 'bg-hot text-ink border-ink',
  },
  {
    id: 'financial',
    label: 'FINANCIAL & LEDGER',
    active: 'bg-sun text-ink border-ink',
  },
  {
    id: 'subscription',
    label: 'SUBSCRIPTIONS',
    active: 'bg-mint text-ink border-ink',
  },
  {
    id: 'travel',
    label: 'TRAVEL & PLACES',
    active: 'bg-volt text-white border-ink',
  },
  {
    id: 'notes',
    label: 'NOTES & ANOMALIES',
    active: 'bg-[#ffd3e3] text-[#880e4f] border-ink',
  },
]

/**
 * Top title, controls, and filter bar header component for String Board.
 */
export default function StringBoardHeader({
  selectedYear,
  onSelectYear,
  activeFilter,
  onSelectFilter,
  catCounts,
  correlationCount,
}) {
  return (
    <>
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
              Forensic triangulation of late-night Spotify manic loops, 03:00 AM
              panic deliveries, and irreversible life-pivot credit card
              authorisations.
            </p>
            <div className="flex gap-3">
              <div className="border-[3px] border-ink bg-white px-4 py-2 shadow-brut-sm">
                <div className="font-mono text-[12px] font-bold tracking-widest text-ink/70">
                  ACTIVE YEAR
                </div>
                <div className="mt-0.5 font-display text-2xl font-bold leading-none text-ink">
                  {selectedYear}
                </div>
              </div>
              <div className="border-[3px] border-ink bg-sun px-4 py-2 shadow-brut-sm">
                <div className="font-mono text-[12px] font-bold tracking-widest text-ink/80">
                  ACTIVE CORRELATIONS
                </div>
                <div className="mt-0.5 font-display text-2xl font-bold leading-none text-ink">
                  {String(correlationCount).padStart(2, '0')}{' '}
                  <span className="font-mono text-xs">NODES</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                onClick={() => onSelectYear(y)}
                aria-pressed={isSelected}
                aria-label={`Select year ${y}`}
                className={`min-h-[44px] border-2 px-3 py-1 font-mono text-[12px] font-bold tracking-wider transition ${
                  isSelected
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

      <div className="border-b-[3px] border-ink bg-paper px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          <span className="shrink-0 font-mono text-[12px] font-bold tracking-widest text-ink/75">
            ▼ EVIDENCE FILTERS:
          </span>
          {FILTER_CATS.map((cat) => {
            const count = catCounts[cat.id] ?? 0
            const isActive = activeFilter === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => onSelectFilter(cat.id)}
                aria-label={`Filter evidence by ${cat.label}`}
                className={`min-h-[44px] border-2 px-3 py-1.5 font-mono text-[12px] font-bold tracking-wider transition ${
                  isActive
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
    </>
  )
}

StringBoardHeader.propTypes = {
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onSelectYear: PropTypes.func.isRequired,
  activeFilter: PropTypes.string.isRequired,
  onSelectFilter: PropTypes.func.isRequired,
  catCounts: PropTypes.object.isRequired,
  correlationCount: PropTypes.number.isRequired,
}
