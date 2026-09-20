import PropTypes from 'prop-types'
import { num } from '../utils/format'
import { EVENT_KINDS } from '../constants'

/**
 * Explore page filter search result list component with type badges, friendly empty state, and keyboard support.
 */
export default function ExploreFilterResults({
  searchQuery,
  selectedKind,
  filteredEvents,
  onClear,
}) {
  const isFiltering = Boolean(searchQuery.trim() || selectedKind !== 'ALL')
  if (!isFiltering) return null

  return (
    <div className="border-[3px] border-ink bg-white p-5 shadow-brut">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b-[2px] border-ink pb-2">
        <div className="font-display text-sm font-bold tracking-wider text-ink">
          FILTER RESULTS ({filteredEvents.length} RECEIPTS FOUND)
          {selectedKind !== 'ALL' && (
            <span className="ml-2 border border-ink bg-sun px-2 py-0.5 font-mono text-[10px] text-ink">
              TYPE: {EVENT_KINDS[selectedKind]?.label || selectedKind}
            </span>
          )}
        </div>
        <button
          onClick={onClear}
          className="min-h-[36px] px-2 text-xs font-bold text-[#9c0d46] underline hover:text-ink cursor-pointer"
          aria-label="Clear active query filter"
        >
          CLEAR ALL FILTERS [ESC]
        </button>
      </div>

      <div className="max-h-80 divide-y divide-dashed divide-ink/30 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center font-mono">
            <div className="text-3xl mb-2" aria-hidden="true">
              🔍
            </div>
            <div className="font-display text-sm font-bold text-ink">
              NO RECEIPTS MATCH THE SELECTED FILTER
            </div>
            <p className="mt-1 text-xs text-ink/75">
              Try adjusting your search query or selecting &quot;ALL
              TYPES&quot;.
            </p>
            <button
              onClick={onClear}
              className="mt-3 border-2 border-ink bg-sun px-3 py-1.5 font-display text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_#111] hover:bg-sun/80 cursor-pointer"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const kindMeta = EVENT_KINDS[evt.kind]

            return (
              <div
                key={evt.id}
                tabIndex={0}
                className="flex flex-col gap-1.5 py-2.5 text-xs justify-between sm:flex-row sm:items-center focus:outline-none focus:bg-sun/10"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-ink">{evt.title}</span>
                    {kindMeta && (
                      <span
                        className={`border px-1.5 py-0.2 font-mono text-[10px] font-bold ${kindMeta.color}`}
                      >
                        {kindMeta.label}
                      </span>
                    )}
                  </div>
                  {evt.detail && (
                    <div className="mt-0.5 text-ink/75 font-mono text-[11px] truncate">
                      {evt.detail}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="border border-ink/40 bg-paper px-1.5 py-0.5 text-[11px] font-bold text-ink font-mono">
                    {evt.date}
                  </span>
                  {evt.value && (
                    <span className="font-bold text-[#9c0d46] font-mono">
                      {evt.unit === 'INR'
                        ? `₹${num(evt.value)}`
                        : `${num(evt.value)} ${evt.unit}`}
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

ExploreFilterResults.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  selectedKind: PropTypes.string.isRequired,
  filteredEvents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      detail: PropTypes.string,
      date: PropTypes.string,
      value: PropTypes.number,
      unit: PropTypes.string,
      kind: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClear: PropTypes.func.isRequired,
}
