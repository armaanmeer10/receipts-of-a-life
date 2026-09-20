/**
 * Explore Page: Read-only database console log interface with real-time text search, preset audit chips,
 * dynamic timeline scrubber playback, Exhibit A top artists audit, and Exhibit B purchase ledger donut.
 */
import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useYear } from '../hooks/useYear'
import { getYearStats } from '../utils/yearStats'
import {
  AVAILABLE_YEARS,
  YEAR_SUBTITLES,
  TIMELINE_INTERVAL_MS,
} from '../constants'
import ExploreLogConsole from '../components/ExploreLogConsole'
import ExploreTopArtists from '../components/ExploreTopArtists'
import ExplorePurchaseLedger from '../components/ExplorePurchaseLedger'
import ExploreFilterResults from '../components/ExploreFilterResults'

export default function Explore({ stats, events }) {
  const { selectedYear, setSelectedYear } = useYear()
  const [searchQuery, setSearchQuery] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)

  const yearStats = useMemo(() => {
    return getYearStats(events, stats, selectedYear)
  }, [events, stats, selectedYear])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    let interval = null
    if (isPlaying) {
      interval = setInterval(() => {
        const yearsList = AVAILABLE_YEARS.filter((y) => y !== 'ALL')
        const currentIdx = yearsList.indexOf(Number(selectedYear))
        if (currentIdx === -1 || currentIdx >= yearsList.length - 1) {
          setIsPlaying(false)
          setSelectedYear(2024)
        } else {
          setSelectedYear(yearsList[currentIdx + 1])
        }
      }, TIMELINE_INTERVAL_MS)
    }
    return () => clearInterval(interval)
  }, [isPlaying, selectedYear, setSelectedYear])

  const filteredEvents = useMemo(() => {
    let list = yearStats ? yearStats.events : events
    if (!searchQuery.trim()) return list

    const q = searchQuery.toLowerCase()
    return list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.detail && e.detail.toLowerCase().includes(q)) ||
        (e.tags && e.tags.some((t) => t.toLowerCase().includes(q))) ||
        (e.kind && e.kind.toLowerCase().includes(q))
    )
  }, [events, yearStats, searchQuery])

  const ledgerBreakdown = useMemo(() => {
    const targetEvents = yearStats ? yearStats.events : events
    const yearPurchases = targetEvents.filter(
      (e) => e.unit === 'INR' && e.value && e.value > 0
    )

    if (yearPurchases.length === 0) return { total: 0, categories: [] }

    const catMap = {}
    let total = 0

    yearPurchases.forEach((e) => {
      if (e.kind === 'salary_first' || e.kind === 'maturity') {
        return
      }

      let cat
      if (
        e.kind === 'investment' ||
        e.tags?.includes('investing') ||
        e.tags?.includes('big')
      ) {
        cat = 'Investments & FDs'
      } else if (
        e.type === 'subscription' ||
        e.tags?.includes('subscription')
      ) {
        cat = 'Subscriptions & Services'
      } else if (
        e.tags?.includes('big-day') ||
        e.title.includes('Money transfer')
      ) {
        cat = 'Transfers & Capital'
      } else {
        cat = 'Daily & Transportation'
      }

      catMap[cat] = (catMap[cat] || 0) + e.value
      total += e.value
    })

    const categories = Object.keys(catMap).map((catName) => ({
      name: catName,
      amount: catMap[catName],
      pct: Math.round((catMap[catName] / total) * 100),
    }))

    return { total, categories }
  }, [events, yearStats])

  const artistAudit = useMemo(() => {
    if (
      !yearStats ||
      !yearStats.topArtists ||
      yearStats.topArtists.length === 0
    ) {
      return []
    }
    return yearStats.topArtists.slice(0, 5)
  }, [yearStats])

  const maxArtistPlays = useMemo(() => {
    if (!artistAudit.length) return 1
    return Math.max(...artistAudit.map((a) => a.plays), 1)
  }, [artistAudit])

  return (
    <main className="flex-1 max-w-full overflow-x-hidden bg-paper font-mono text-ink pb-12">
      <ExploreLogConsole
        selectedYear={selectedYear}
        yearStats={yearStats}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 space-y-6">
        <div className="border-[3px] border-ink bg-white p-4 shadow-brut">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={
                isPlaying
                  ? 'Pause timeline playback'
                  : 'Start timeline playback'
              }
              className={`flex min-h-[44px] items-center justify-center gap-2 border-[2px] border-ink px-4 py-2 font-display text-xs font-bold tracking-wider shadow-[2px_2px_0_#111] transition ${
                isPlaying
                  ? 'bg-hot text-ink'
                  : 'bg-mint text-ink hover:bg-mint/80'
              }`}
            >
              <span>{isPlaying ? '⏸ PAUSE TIMELINE' : '▶ PLAY TIMELINE'}</span>
            </button>

            <div className="flex-1 border-2 border-ink bg-[#ff4d8d] px-4 py-2 text-ink shadow-[2px_2px_0_#111]">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-bold">
                <span className="tracking-widest">
                  REWIND LOCKED: {selectedYear}
                </span>
                <span className="font-mono text-[12px] opacity-90">
                  [{YEAR_SUBTITLES[selectedYear] || 'ARCHIVE AUDIT'}]
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto pb-2">
            <div className="flex min-w-[700px] items-center justify-between border-2 border-ink bg-paper p-1.5">
              {AVAILABLE_YEARS.map((y) => {
                const isSelected = String(selectedYear) === String(y)
                const isPeak = y === 2017

                return (
                  <button
                    key={y}
                    onClick={() => {
                      setSelectedYear(y)
                      setIsPlaying(false)
                    }}
                    aria-pressed={isSelected}
                    aria-label={`Select year ${y}`}
                    className={`relative flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-xs font-bold transition ${
                      isSelected
                        ? 'z-10 border-2 border-ink bg-sun text-ink shadow-[2px_2px_0_#111]'
                        : 'text-ink/75 hover:bg-sun/20 hover:text-ink'
                    }`}
                  >
                    {isPeak && (
                      <span className="absolute -top-3.5 border border-ink bg-hot px-1 text-[12px] font-black text-ink shadow-[1px_1px_0_#111]">
                        ★ PEAK
                      </span>
                    )}
                    <span>{y}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ExploreTopArtists
            selectedYear={selectedYear}
            artistAudit={artistAudit}
            maxArtistPlays={maxArtistPlays}
            eventCount={yearStats.events.length}
          />

          <ExplorePurchaseLedger
            selectedYear={selectedYear}
            ledgerBreakdown={ledgerBreakdown}
            purchases={yearStats.purchases}
          />
        </div>

        <ExploreFilterResults
          searchQuery={searchQuery}
          filteredEvents={filteredEvents}
          onClear={() => setSearchQuery('')}
        />
      </div>
    </main>
  )
}

Explore.propTypes = {
  stats: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
}
