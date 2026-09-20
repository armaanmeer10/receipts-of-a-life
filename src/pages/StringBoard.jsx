/**
 * StringBoard Page: Interactive corkboard conspiracy board connecting music scrobbles, financial receipts,
 * subscription stacks, and travel events using SVG red string paths and forensic investigation dossiers.
 */
import { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSearchParams } from 'react-router-dom'
import { useYear } from '../hooks/useYear'
import { calculateConnections } from '../utils/connections'
import StringBoardHeader from '../components/StringBoardHeader'
import PinnedCard from '../components/PinnedCard'
import StringLayer from '../components/StringLayer'
import Dossier from '../components/Dossier'

const CARD_DEFS = [
  {
    id: 'c1',
    eventId: 'e001',
    cx: 14,
    cy: 20,
    rotate: -2.5,
    category: 'music',
    connects: ['c2', 'c4'],
    year: 2013,
  },
  {
    id: 'c2',
    eventId: 'e029',
    cx: 44,
    cy: 15,
    rotate: 2.5,
    category: 'music',
    connects: ['c3', 'c8'],
    year: 2016,
  },
  {
    id: 'c3',
    eventId: 'e053',
    cx: 78,
    cy: 24,
    rotate: -1.5,
    category: 'music',
    connects: ['c6'],
    year: 2017,
  },
  {
    id: 'c4',
    eventId: 'e008',
    cx: 18,
    cy: 64,
    rotate: 1.5,
    category: 'financial',
    connects: ['c5', 'c7'],
    year: 2015,
  },
  {
    id: 'c5',
    eventId: 'e009',
    cx: 46,
    cy: 72,
    rotate: -2.5,
    category: 'financial',
    connects: ['c6'],
    year: 2015,
  },
  {
    id: 'c6',
    eventId: 'e030',
    cx: 76,
    cy: 62,
    rotate: 1.5,
    category: 'subscription',
    connects: ['c3'],
    year: 2016,
  },
  {
    id: 'c7',
    eventId: 'e068',
    cx: 10,
    cy: 84,
    rotate: -3.5,
    category: 'travel',
    connects: [],
    year: 2018,
  },
  {
    id: 'c8',
    eventId: 'e033',
    cx: 58,
    cy: 83,
    rotate: 2.0,
    category: 'notes',
    connects: ['c2'],
    year: 2016,
  },
]

function getEvent(def, events) {
  return (
    events.find((e) => e.id === def.eventId) ||
    events.find((e) => e.id === def.id) ||
    null
  )
}

function buildConnections() {
  const seen = new Set()
  const out = []
  for (const d of CARD_DEFS) {
    for (const t of d.connects) {
      const key = [d.id, t].sort().join('–')
      if (!seen.has(key)) {
        seen.add(key)
        out.push([d.id, t])
      }
    }
  }
  return out
}

const ALL_CONNECTIONS = buildConnections()

export default function StringBoard({ events }) {
  const { selectedYear, setSelectedYear } = useYear()
  const [searchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState('all')
  const [userSelectedId, setUserSelectedId] = useState(null)

  // Derive deep-link card from URL param without setState-in-effect
  const urlSelectedId = useMemo(() => {
    const cardParam = searchParams.get('card')
    if (!cardParam) return null
    const matched = CARD_DEFS.find(
      (c) => c.id === cardParam || c.eventId === cardParam
    )
    return matched ? matched.id : cardParam
  }, [searchParams])

  // User click overrides URL param; merge both sources
  const selectedId = userSelectedId ?? urlSelectedId
  const setSelectedId = setUserSelectedId

  // Support Esc key to clear selection / filters
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserSelectedId(null)
        setActiveFilter('all')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setUserSelectedId, setActiveFilter])

  const catCounts = useMemo(() => {
    const c = { all: CARD_DEFS.length }
    for (const d of CARD_DEFS) c[d.category] = (c[d.category] || 0) + 1
    return c
  }, [])

  // Calculate live rule connections
  const liveRulesCount = useMemo(() => {
    return calculateConnections(events).length
  }, [events])

  const visibleCards = useMemo(() => {
    return CARD_DEFS.filter((def) => {
      const isCategoryHidden =
        activeFilter !== 'all' && def.category !== activeFilter
      const isYearHidden =
        selectedYear !== 'ALL' && def.year !== Number(selectedYear)
      return !isCategoryHidden && !isYearHidden
    })
  }, [activeFilter, selectedYear])

  const handleCard = (id) => setSelectedId((prev) => (prev === id ? null : id))

  const handleSelectFilter = (filterId) => {
    setActiveFilter(filterId)
    setSelectedId(null)
  }

  const handleClearFilters = () => {
    setActiveFilter('all')
    setSelectedYear('ALL')
    setSelectedId(null)
  }

  return (
    <main className="flex-1 max-w-full overflow-x-hidden">
      <StringBoardHeader
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        activeFilter={activeFilter}
        onSelectFilter={handleSelectFilter}
        catCounts={catCounts}
        correlationCount={liveRulesCount || ALL_CONNECTIONS.length}
        visibleCount={visibleCards.length}
        totalCount={CARD_DEFS.length}
        onClearFilters={handleClearFilters}
      />

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1fr_360px]">
        <div
          className="relative overflow-hidden border-b-[3px] border-ink lg:border-b-0 lg:border-r-[3px]"
          style={{ minHeight: 580, height: 580 }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#e5d9c0',
              backgroundImage:
                'radial-gradient(rgba(100,72,30,0.25) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
            aria-hidden="true"
          >
            <div className="text-center font-display text-6xl font-bold leading-none tracking-tight text-[rgba(100,72,30,0.08)] md:text-8xl">
              THE
              <br />
              CONSPIRACY
              <br />
              BOARD
            </div>
          </div>

          <StringLayer
            connections={ALL_CONNECTIONS}
            cardDefs={CARD_DEFS}
            activeFilter={activeFilter}
            selectedId={selectedId}
            selectedYear={selectedYear}
          />

          {visibleCards.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center font-mono">
              <div className="border-[3px] border-ink bg-white p-6 shadow-brut max-w-sm space-y-3">
                <div className="text-4xl" aria-hidden="true">
                  📌
                </div>
                <div className="font-display text-lg font-bold text-ink">
                  NO EVIDENCE MATCHING CURRENT FILTER
                </div>
                <p className="text-xs text-ink/75">
                  No pinned receipts found for category &quot;{activeFilter}
                  &quot; in year {selectedYear}.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-2 border-2 border-ink bg-sun px-4 py-2 font-display text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_#111] hover:bg-sun/80"
                >
                  RESET EVIDENCE BOARD
                </button>
              </div>
            </div>
          ) : (
            CARD_DEFS.map((def, i) => {
              const event = getEvent(def, events)
              const isHidden = !visibleCards.some((v) => v.id === def.id)

              return (
                <PinnedCard
                  key={def.id}
                  def={def}
                  event={event}
                  isSelected={
                    selectedId === def.id || selectedId === def.eventId
                  }
                  isHidden={isHidden}
                  onClick={handleCard}
                  index={i}
                />
              )
            })
          )}
        </div>

        <div style={{ minHeight: 580, height: 580 }}>
          <Dossier
            selectedId={selectedId}
            events={events}
            cardDefs={CARD_DEFS}
          />
        </div>
      </div>
    </main>
  )
}

StringBoard.propTypes = {
  events: PropTypes.array.isRequired,
}
