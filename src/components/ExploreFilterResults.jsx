import PropTypes from 'prop-types'
import { num } from '../utils/format'

/**
 * Explore page filter search result list component.
 */
export default function ExploreFilterResults({
  searchQuery,
  filteredEvents,
  onClear,
}) {
  if (!searchQuery) return null

  return (
    <div className="border-[3px] border-ink bg-white p-5 shadow-brut">
      <div className="mb-3 flex items-center justify-between border-b-[2px] border-ink pb-2">
        <div className="font-display text-sm font-bold tracking-wider text-ink">
          FILTER MATCHES FOR &quot;{searchQuery}&quot; ({filteredEvents.length}{' '}
          RECORDS FOUND)
        </div>
        <button
          onClick={onClear}
          className="min-h-[44px] px-2 text-xs font-bold text-[#9c0d46] underline hover:text-ink"
          aria-label="Clear active query filter"
        >
          CLEAR FILTER
        </button>
      </div>
      <div className="max-h-72 divide-y divide-dashed divide-ink/30 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="py-4 text-center text-xs text-ink/75">
            No events found matching your filter query.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="flex flex-col gap-1 py-2 text-xs justify-between sm:flex-row sm:items-center"
            >
              <div>
                <span className="mr-2 font-bold text-ink">{evt.title}</span>
                <span className="text-ink/75">{evt.detail}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="border border-ink/40 bg-paper px-1.5 py-0.5 text-[12px] font-bold text-ink">
                  {evt.date}
                </span>
                {evt.value && (
                  <span className="font-bold text-[#9c0d46]">
                    {evt.unit === 'INR'
                      ? `₹${num(evt.value)}`
                      : `${num(evt.value)} ${evt.unit}`}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

ExploreFilterResults.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  filteredEvents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      detail: PropTypes.string,
      date: PropTypes.string,
      value: PropTypes.number,
      unit: PropTypes.string,
    })
  ).isRequired,
  onClear: PropTypes.func.isRequired,
}
