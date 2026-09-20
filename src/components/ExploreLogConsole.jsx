import { useRef } from 'react'
import PropTypes from 'prop-types'
import { num } from '../utils/format'
import { PRESET_CHIPS, EVENT_KINDS, ALL_KINDS_LIST } from '../constants'

/**
 * Console log header, search bar, and kind filter chips for Explore page.
 */
export default function ExploreLogConsole({
  selectedYear,
  yearStats,
  searchQuery,
  onSearchChange,
  onClearSearch,
  selectedKind,
  onSelectKind,
  visibleCount,
  totalCount,
}) {
  const searchInputRef = useRef(null)
  const isFiltered = Boolean(searchQuery.trim() || selectedKind !== 'ALL')

  return (
    <>
      <div className="border-b-[3px] border-ink bg-ink px-4 py-2.5 text-paper md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[12px] tracking-widest text-paper/80">
            <span
              className="h-2 w-2 rounded-full bg-mint animate-pulse"
              aria-hidden="true"
            />
            CONSOLE LOG: READ-ONLY DATABASE ACCESS /// MODE: DB_READ_09
          </div>
          <div className="flex items-center gap-2">
            <span className="border border-sun bg-sun/10 px-2 py-0.5 text-[12px] font-bold text-sun">
              SCROBBLES:{' '}
              {yearStats.plays != null ? num(yearStats.plays) : 'No records'}
            </span>
            <span className="border border-hot bg-hot/20 px-2 py-0.5 text-[12px] font-bold text-hot">
              PURCHASES:{' '}
              {yearStats.purchases != null
                ? num(yearStats.purchases)
                : 'No records'}
            </span>
          </div>
        </div>
      </div>

      <div className="border-[3px] border-ink bg-white p-4 shadow-brut">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            EXPLORE ARCHIVE LOGS ({selectedYear})
          </h1>
          <div className="flex items-center gap-2">
            <span className="border border-ink bg-paper px-2.5 py-1 font-mono text-[12px] font-bold text-ink shadow-brut-sm">
              Showing {visibleCount} of {totalCount} receipts
            </span>
            {isFiltered && (
              <button
                onClick={onClearSearch}
                className="border border-ink bg-hot px-2.5 py-1 font-mono text-[12px] font-bold text-ink shadow-brut-sm hover:bg-hot/80 cursor-pointer"
              >
                CLEAR FILTERS [ESC]
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex min-h-[44px] flex-1 items-center gap-2 border-2 border-ink bg-paper px-3 py-2">
            <span className="font-display text-sm font-bold tracking-wider text-ink">
              SEARCH:
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Beatles, Netflix, Salary, Fixed Deposit, Silence..."
              className="min-h-[36px] w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink/60"
              aria-label="Search receipts and scrobbles"
            />
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => searchInputRef.current?.focus()}
              aria-label="Filter disk search"
              className="min-h-[44px] border-2 border-ink bg-sun px-4 py-2 font-display text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_#111] transition hover:bg-sun/80 cursor-pointer"
            >
              FILTER DISK
            </button>
            {searchQuery && (
              <button
                onClick={onClearSearch}
                aria-label="Clear search input"
                className="min-h-[44px] border-2 border-ink bg-hot px-3 py-2 font-mono text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_#111] transition hover:bg-hot/80 cursor-pointer"
              >
                CLEAR [ESC]
              </button>
            )}
          </div>
        </div>

        {/* ══ PRESET AUDITS ══ */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-dashed border-ink/30 pt-2">
          <span className="text-[11px] font-bold tracking-wider text-ink/75">
            PRESETS:
          </span>
          {PRESET_CHIPS.map((chip) => (
            <button
              key={chip.query}
              onClick={() => onSearchChange(chip.query)}
              aria-label={`Search preset ${chip.label}`}
              className={`min-h-[32px] border border-ink/50 px-2 py-0.5 text-[11px] font-bold transition cursor-pointer ${
                searchQuery === chip.query
                  ? 'border-ink bg-hot text-ink shadow-[1px_1px_0_#111]'
                  : 'bg-paper text-ink/80 hover:border-ink hover:bg-sun/40'
              }`}
            >
              + {chip.label}
            </button>
          ))}
        </div>

        {/* ══ ALL 15 DATA TYPE FILTERS (Requirement 1) ══ */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-dashed border-ink/30 pt-2">
          <span className="text-[11px] font-bold tracking-wider text-ink/75">
            RECEIPT TYPES:
          </span>
          <button
            onClick={() => onSelectKind('ALL')}
            className={`min-h-[30px] border px-2 py-0.5 text-[11px] font-bold transition cursor-pointer ${
              selectedKind === 'ALL'
                ? 'border-ink bg-ink text-paper shadow-[1px_1px_0_#111]'
                : 'border-ink/50 bg-paper text-ink hover:bg-sun/40'
            }`}
          >
            ALL TYPES
          </button>
          {ALL_KINDS_LIST.map((k) => {
            const meta = EVENT_KINDS[k]
            const isSel = selectedKind === k
            return (
              <button
                key={k}
                onClick={() => onSelectKind(isSel ? 'ALL' : k)}
                className={`min-h-[30px] border px-2 py-0.5 font-mono text-[10px] font-bold transition cursor-pointer ${
                  isSel
                    ? 'border-ink bg-sun text-ink shadow-[2px_2px_0_#111]'
                    : `${meta.color} opacity-80 hover:opacity-100`
                }`}
              >
                {meta.label}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

ExploreLogConsole.propTypes = {
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  yearStats: PropTypes.object.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
  selectedKind: PropTypes.string.isRequired,
  onSelectKind: PropTypes.func.isRequired,
  visibleCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
}
