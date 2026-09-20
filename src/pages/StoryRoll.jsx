/**
 * StoryRoll Page: Chronological chapter tape walkthrough (2013-2024) with interactive timeline scrubber,
 * live print head animation toggle, biography header, and chapter event audit logs.
 */
import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { useYear } from '../hooks/useYear'
import { getYearStats } from '../utils/yearStats'
import { CHAPTERS } from '../constants'
import CoreStats from '../components/CoreStats'
import YearScrubber from '../components/YearScrubber'
import ChapterRolls from '../components/ChapterRolls'
import BiographyHeader from '../components/BiographyHeader'
import ChapterDetail from '../components/ChapterDetail'

function PrintHeadBar({ isEmitting, onToggle }) {
  return (
    <div className="flex items-center justify-between border-b-[3px] border-ink/40 bg-ink px-4 py-2">
      <div className="flex items-center gap-2 font-mono text-[12px] font-bold tracking-widest text-paper/80">
        <span
          className={`text-base ${
            isEmitting ? 'animate-pulse text-mint' : 'text-paper/40'
          }`}
        >
          ●
        </span>
        CITIZEN THERMAL PRINT HEAD: {isEmitting ? 'EMITTING ///' : 'PAUSED'}
      </div>
      <button
        onClick={onToggle}
        aria-label={
          isEmitting ? 'Pause print emission' : 'Resume print emission'
        }
        className="min-h-[44px] border-[2px] border-paper/40 bg-paper/10 px-3 py-1.5 font-mono text-[12px] font-bold tracking-wider text-paper transition hover:bg-paper/20"
      >
        {isEmitting ? 'PAUSE ACTION' : 'RESUME ▶'}
      </button>
    </div>
  )
}

PrintHeadBar.propTypes = {
  isEmitting: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

export default function StoryRoll({ stats, events }) {
  const { selectedYear, setSelectedYear } = useYear()
  const [overrideChapterId, setOverrideChapterId] = useState(null)
  const [emitting, setEmitting] = useState(true)

  const yearStats = useMemo(() => {
    return getYearStats(events, stats, selectedYear)
  }, [events, stats, selectedYear])

  const activeChapterId = useMemo(() => {
    if (selectedYear !== 'ALL') {
      const ch = CHAPTERS.find((c) => c.years.includes(Number(selectedYear)))
      if (ch) return ch.id
    }
    return overrideChapterId || 'ch1'
  }, [selectedYear, overrideChapterId])

  const activeChapter = CHAPTERS.find((c) => c.id === activeChapterId)

  const handleYearClick = (y) => {
    setSelectedYear(y)
    setOverrideChapterId(null)
  }

  const handleChapterClick = (id) => {
    setOverrideChapterId(id)
    const ch = CHAPTERS.find((c) => c.id === id)
    if (ch && ch.years?.[0]) setSelectedYear(ch.years[0])
  }

  return (
    <main className="flex-1 max-w-full overflow-x-hidden bg-paper">
      <div className="border-b-[3px] border-ink bg-ink px-4 py-2.5 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <span className="font-display text-[12px] font-bold tracking-widest text-paper">
            STORY ROLL
          </span>
          <span className="font-mono text-[12px] text-paper/50">·</span>
          <span className="font-mono text-[12px] font-bold tracking-wider text-paper/80">
            YEAR: {selectedYear} · {yearStats.events.length} EVENTS
          </span>
          <span className="ml-auto border border-hot bg-hot/20 px-2 py-0.5 font-mono text-[12px] font-bold tracking-widest text-hot">
            ARCHIVAL MODE
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[440px_1fr]">
        <div className="space-y-4 border-r-0 border-ink p-4 lg:border-r-[3px] lg:p-6">
          <CoreStats yearStats={yearStats} />
          <YearScrubber selectedYear={selectedYear} onYear={handleYearClick} />
          <ChapterRolls
            activeChapter={activeChapterId}
            onChapter={handleChapterClick}
          />
        </div>

        <div className="flex flex-col bg-ink text-paper">
          <PrintHeadBar
            isEmitting={emitting}
            onToggle={() => setEmitting((v) => !v)}
          />

          <div className="flex-1 overflow-y-auto p-5 lg:p-8">
            <div className="mx-auto max-w-xl space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <BiographyHeader stats={stats} yearStats={yearStats} />
              </motion.div>

              <div className="border-t-[3px] border-paper/20 pt-6">
                <ChapterDetail
                  chapter={activeChapter}
                  events={events}
                  selectedYear={selectedYear}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

StoryRoll.propTypes = {
  stats: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
}
