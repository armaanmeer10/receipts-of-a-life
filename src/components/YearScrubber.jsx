import PropTypes from 'prop-types'
import { AVAILABLE_YEARS, CHAPTERS } from '../constants'

function chapterForYear(y) {
  if (y === 'ALL') return CHAPTERS[0]
  return CHAPTERS.find((c) => c.years.includes(Number(y))) || CHAPTERS[0]
}

/**
 * Year Scrubber grid control component for Story Roll.
 */
export default function YearScrubber({ selectedYear, onYear }) {
  return (
    <div className="border-[3px] border-ink bg-white p-4 shadow-brut-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-base" aria-hidden="true">
          ◎
        </span>
        <span className="font-display text-[12px] font-bold tracking-widest text-ink">
          YEAR SCRUBBER
        </span>
        <span className="ml-auto border border-hot bg-hot/20 px-2 py-0.5 text-[12px] font-bold tracking-widest text-[#880e4f]">
          TO THE ARCHIVE
        </span>
      </div>
      <div className="my-2 border-t-2 border-dashed border-ink/40" />
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
              className={`min-h-[44px] border-2 py-2 text-[12px] font-bold tracking-wider transition ${
                active
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

YearScrubber.propTypes = {
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onYear: PropTypes.func.isRequired,
}
