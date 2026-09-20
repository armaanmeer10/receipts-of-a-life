/**
 * StringBoard Page: Interactive corkboard conspiracy board connecting music scrobbles, financial receipts,
 * subscription stacks, and travel events using SVG red string paths and forensic investigation dossiers.
 */
import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useYear } from '../hooks/useYear'
import StringBoardHeader from '../components/StringBoardHeader'
import PinnedCard from '../components/PinnedCard'
import StringLayer from '../components/StringLayer'
import Dossier from '../components/Dossier'

const CARD_DEFS = [
  {
    id: 'c1',
    cx: 14,
    cy: 20,
    rotate: -2.5,
    category: 'music',
    connects: ['c2', 'c4'],
    year: 2013,
  },
  {
    id: 'c2',
    cx: 44,
    cy: 15,
    rotate: 2.5,
    category: 'music',
    connects: ['c3', 'c8'],
    year: 2016,
  },
  {
    id: 'c3',
    cx: 78,
    cy: 24,
    rotate: -1.5,
    category: 'music',
    connects: ['c6'],
    year: 2017,
  },
  {
    id: 'c4',
    cx: 18,
    cy: 64,
    rotate: 1.5,
    category: 'financial',
    connects: ['c5', 'c7'],
    year: 2015,
  },
  {
    id: 'c5',
    cx: 46,
    cy: 72,
    rotate: -2.5,
    category: 'financial',
    connects: ['c6'],
    year: 2015,
  },
  {
    id: 'c6',
    cx: 76,
    cy: 62,
    rotate: 1.5,
    category: 'subscription',
    connects: ['c3'],
    year: 2016,
  },
  {
    id: 'c7',
    cx: 10,
    cy: 84,
    rotate: -3.5,
    category: 'travel',
    connects: [],
    year: 2018,
  },
  {
    id: 'c8',
    cx: 58,
    cy: 83,
    rotate: 2.0,
    category: 'notes',
    connects: ['c2'],
    year: 2016,
  },
]

function getEvent(id, events) {
  switch (id) {
    case 'c1':
      return events.find((e) => e.kind === 'first_play')
    case 'c2':
      return events.find(
        (e) => e.kind === 'discovery' && e.detail?.includes('The Beatles')
      )
    case 'c3':
      return [...events]
        .filter((e) => e.kind === 'peak_month')
        .sort((a, b) => b.value - a.value)[0]
    case 'c4':
      return events.find((e) => e.kind === 'salary_first')
    case 'c5':
      return events.find((e) => e.kind === 'investment')
    case 'c6':
      return events.find((e) => e.title?.includes('Netflix'))
    case 'c7':
      return events.find(
        (e) => e.title?.includes('Bike') || e.detail?.includes('Bikedelux')
      )
    case 'c8':
      return [...events]
        .filter((e) => e.kind === 'binge')
        .sort((a, b) => b.value - a.value)[0]
    default:
      return null
  }
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
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const catCounts = useMemo(() => {
    const c = { all: CARD_DEFS.length }
    for (const d of CARD_DEFS) c[d.category] = (c[d.category] || 0) + 1
    return c
  }, [])

  const handleCard = (id) => setSelectedId((prev) => (prev === id ? null : id))

  const handleSelectFilter = (filterId) => {
    setActiveFilter(filterId)
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
        correlationCount={ALL_CONNECTIONS.length}
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

          {CARD_DEFS.map((def, i) => {
            const event = getEvent(def.id, events)
            const isCategoryHidden =
              activeFilter !== 'all' && def.category !== activeFilter
            const isYearHidden =
              selectedYear !== 'ALL' && def.year !== Number(selectedYear)
            const isHidden = isCategoryHidden || isYearHidden

            return (
              <PinnedCard
                key={def.id}
                def={def}
                event={event}
                isSelected={selectedId === def.id}
                isHidden={isHidden}
                onClick={handleCard}
                index={i}
              />
            )
          })}
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
