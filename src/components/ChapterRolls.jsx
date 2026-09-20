import PropTypes from 'prop-types'
import { CHAPTERS } from '../constants'

/**
 * Chapter Rolls list selector component for Story Roll.
 */
export default function ChapterRolls({ activeChapter, onChapter }) {
  return (
    <div className="border-[3px] border-ink bg-white p-4 shadow-brut-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-base" aria-hidden="true">
          ☷
        </span>
        <span className="font-display text-[12px] font-bold tracking-widest text-ink">
          CHAPTER ROLLS
        </span>
      </div>
      <div className="my-2 border-t-2 border-dashed border-ink/40" />
      <div className="space-y-1">
        {CHAPTERS.map((ch, i) => {
          const active = ch.id === activeChapter
          return (
            <button
              key={ch.id}
              onClick={() => onChapter(ch.id)}
              aria-label={`Select chapter ${ch.label}`}
              className={`flex min-h-[44px] w-full items-start justify-between gap-2 border-b border-dashed border-ink/30 py-2.5 text-left transition last:border-0 ${
                active
                  ? 'font-bold opacity-100'
                  : 'opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 border-[2px] border-ink px-1.5 py-0.5 text-[12px] font-bold ${ch.color} ${ch.textColor}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div
                    className={`font-display text-[12px] font-bold leading-tight ${
                      active ? 'text-ink' : 'text-ink/80'
                    }`}
                  >
                    {ch.label}
                  </div>
                  <div className="mt-0.5 font-mono text-[12px] text-ink/70">
                    {ch.dateRange}
                  </div>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[12px] font-bold text-ink/65">
                {ch.years.join('–')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

ChapterRolls.propTypes = {
  activeChapter: PropTypes.string.isRequired,
  onChapter: PropTypes.func.isRequired,
}
