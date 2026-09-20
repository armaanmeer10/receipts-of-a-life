import PropTypes from 'prop-types'
import { AVAILABLE_YEARS } from '../constants'

/**
 * Reusable Year Selector bar component.
 */
export default function YearSelector({
  selectedYear,
  onSelectYear,
  availableYears = AVAILABLE_YEARS,
}) {
  return (
    <section className="no-print relative z-20 border-b-[3px] border-ink bg-paper px-4 py-3 md:px-8">
      <div className="mx-auto max-w-7xl">
        <span className="mb-2 block font-mono text-[12px] font-bold tracking-widest text-ink/80">
          ▼ SELECT AUDIT YEAR:
        </span>
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {availableYears.map((y) => {
            const isSelected = String(selectedYear) === String(y)
            return (
              <button
                key={y}
                onClick={() => onSelectYear(y)}
                aria-pressed={isSelected}
                aria-label={`Select year ${y}`}
                className={`shrink-0 min-h-[44px] border-2 px-3 py-1 font-mono text-[12px] font-bold tracking-wider transition ${
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
      </div>
    </section>
  )
}

YearSelector.propTypes = {
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onSelectYear: PropTypes.func.isRequired,
  availableYears: PropTypes.array,
}
