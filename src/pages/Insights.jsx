/**
 * Insights Page: Behavioral audit and psyche synthesis page featuring four distinct neo-brutalist
 * archetype cards (#01 Night Owl, #02 Beatles Loyalist, #03 Saver Investor, #04 Binge Listener).
 */
import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useYear } from '../hooks/useYear'
import { getYearStats } from '../utils/yearStats'
import { num } from '../utils/format'
import ArchetypeCard from '../components/ArchetypeCard'

export default function Insights({ stats, events }) {
  const navigate = useNavigate()
  const { selectedYear } = useYear()

  const yearStats = useMemo(
    () => getYearStats(events, stats, selectedYear),
    [events, stats, selectedYear]
  )

  const longestBinge = useMemo(() => {
    let targetEvents = events
    if (selectedYear !== 'ALL') {
      targetEvents = events.filter(
        (e) => e.date && String(e.date).includes(String(selectedYear))
      )
    }
    const binges = targetEvents.filter((e) => e.kind === 'binge')
    if (!binges.length) return null
    const top = binges.reduce(
      (max, e) => (e.value > max.value ? e : max),
      binges[0]
    )
    return {
      plays: top.value,
      artist: top.title.includes('Beatles')
        ? 'The Beatles'
        : top.title.split(' ')[0],
    }
  }, [events, selectedYear])

  const archetypes = [
    {
      id: '#01_OWL',
      tag: '★ AUDITED PATTERN',
      tagBg: 'bg-ink text-paper',
      title: 'NIGHT OWL',
      icon: '🌙',
      bg: 'bg-[#ffe500]',
      text: 'text-ink',
      border: 'border-ink',
      rotate: -1.5,
      stats: [
        { label: 'PEAK ACTIVITY', value: '00:00 - 04:59 UTC' },
        {
          label: 'NIGHT PLAYS',
          value:
            yearStats.nightPlays != null
              ? `${num(yearStats.nightPlays)} PLAYS`
              : 'No records',
        },
      ],
      mainStat:
        yearStats.nightPlays != null
          ? `${num(yearStats.nightPlays)} night plays logged for ${selectedYear}.`
          : `No late-night scrobbles recorded for ${selectedYear}.`,
      quote:
        '"Late-night playlists and digital activity reveal a listener operating when the world is quiet."',
      status: 'CIRCADIAN PATTERN',
      statusBadge: 'NIGHT_AUDIT',
    },
    {
      id: '#02_FAB',
      tag: '★ FIXATION CRITICAL',
      tagBg: 'bg-ink text-paper',
      title: 'BEATLES LOYALIST',
      icon: '🔴',
      bg: 'bg-[#ff4d8d]',
      text: 'text-ink',
      border: 'border-ink',
      rotate: 1.2,
      stats: [
        {
          label: 'CORE ARTIST',
          value: yearStats.topArtist ? yearStats.topArtist.artist : 'N/A',
        },
        {
          label: 'ARTIST PLAYS',
          value: yearStats.topArtist
            ? `${num(yearStats.topArtist.plays)} PLAYS`
            : 'No records',
        },
      ],
      mainStat: yearStats.topArtist
        ? `${num(yearStats.topArtist.plays)} plays of ${yearStats.topArtist.artist} recorded in ${selectedYear}.`
        : `No dominant mono-artist recorded for ${selectedYear}.`,
      quote:
        '"When seeking focus or comfort, you consistently turned to mono-artist listening loops."',
      status: 'MONO-ARTIST AUDIT',
      statusBadge: 'BINGE_LOCKED',
    },
    {
      id: '#03_CAP',
      tag: '★ DISCIPLINE: AUDITED',
      tagBg: 'bg-ink text-paper',
      title: 'SAVER INVESTOR',
      icon: '🏛️',
      bg: 'bg-[#eae6f8]',
      text: 'text-ink',
      border: 'border-ink',
      rotate: -0.8,
      stats: [
        {
          label: 'LEDGER MOVES',
          value:
            yearStats.purchases != null
              ? `${num(yearStats.purchases)} ENTRIES`
              : 'No records',
        },
        {
          label: 'TOTAL SPEND',
          value:
            yearStats.totalSpend != null
              ? `₹${num(Math.round(yearStats.totalSpend))}`
              : 'No records',
        },
      ],
      mainStat:
        yearStats.purchases != null
          ? `${num(yearStats.purchases)} transactions logged in ${selectedYear} totaling ${
              yearStats.totalSpend
                ? `₹${num(Math.round(yearStats.totalSpend))}`
                : 'audited entries'
            }.`
          : `No bank ledger entries recorded for ${selectedYear}.`,
      quote:
        '"Your spending ledger reflects deliberate capital allocation into fixed deposits and investments."',
      status: 'CAPITAL AUDIT',
      statusBadge: 'VERIFIED',
    },
    {
      id: '#04_LOOP',
      tag: '★ FOCUS OBSESSED',
      tagBg: 'bg-paper text-ink border border-paper/40',
      title: 'BINGE LISTENER',
      icon: '♾️',
      bg: 'bg-[#1e3a8a]',
      text: 'text-paper',
      border: 'border-ink',
      rotate: 1.8,
      stats: [
        {
          label: 'MAX REPEAT',
          value: longestBinge ? `${longestBinge.plays} IN A DAY` : 'No records',
        },
        {
          label: 'FOCUS STATE',
          value: longestBinge ? 'MONO-LOOP' : 'BALANCED',
        },
      ],
      mainStat: longestBinge
        ? `Single day repeat record: ${longestBinge.plays} plays of ${longestBinge.artist} in a 24-hour window.`
        : `No single-artist binge day recorded for ${selectedYear}.`,
      quote:
        '"High-volume repeat listening days correlate directly with intense coding and work sessions."',
      status: 'RECURSIVE COGNITION',
      statusBadge: 'MONO_LOOP',
    },
  ]

  const handlePrintStory = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    navigate('/')
  }

  return (
    <main className="flex-1 max-w-full overflow-x-hidden bg-paper font-mono text-ink pb-16">
      <div className="border-b-[3px] border-ink bg-white px-4 py-6 shadow-brut-sm md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="border border-ink bg-paper px-2 py-0.5 text-[12px] font-bold tracking-widest text-ink">
                  SECTION 05 // FINAL SYNTHESIS
                </span>
                <span className="text-[12px] font-bold tracking-wider text-ink/75">
                  ACTIVE AUDIT: {selectedYear}
                </span>
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
                BEHAVIORAL AUDIT &amp; PSYCHE
              </h1>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-ink/80">
                Eleven continuous years of thermal paper rolls distilled into
                four dominant behavioral archetypes and your definitive forensic
                ledger statement.
              </p>
            </div>

            <div className="max-w-xs shrink-0 border-[3px] border-ink bg-sun p-4 shadow-brut-sm">
              <div className="text-[12px] font-bold tracking-widest text-ink/80">
                AUDIT YEAR: {selectedYear}
              </div>
              <div className="mt-0.5 font-display text-lg font-bold text-ink">
                {yearStats.plays != null
                  ? `${num(yearStats.plays)} SCROBBLES`
                  : 'NO SCROBBLES'}
              </div>
              <div className="mt-1 border-t border-dashed border-ink/40 pt-1 text-[12px] font-bold text-ink/80">
                {yearStats.events.length} EVENTS RECORDED
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(rgba(17,17,17,0.2) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {archetypes.map((card, idx) => (
            <ArchetypeCard key={card.id} card={card} idx={idx} />
          ))}
        </div>

        <div className="pointer-events-none relative hidden h-20 w-full overflow-visible lg:block">
          <svg
            className="h-full w-full"
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M 125 0 Q 300 60 500 70"
              fill="none"
              stroke="#9c0d46"
              strokeWidth="2"
              strokeDasharray="4 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            />
            <motion.path
              d="M 375 0 Q 430 40 500 70"
              fill="none"
              stroke="#9c0d46"
              strokeWidth="2"
              strokeDasharray="4 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.7 }}
            />
            <motion.path
              d="M 625 0 Q 570 40 500 70"
              fill="none"
              stroke="#9c0d46"
              strokeWidth="2"
              strokeDasharray="4 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.8 }}
            />
            <motion.path
              d="M 875 0 Q 700 60 500 70"
              fill="none"
              stroke="#9c0d46"
              strokeWidth="2"
              strokeDasharray="4 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.9 }}
            />
          </svg>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-[3px] border-ink bg-ink p-4 text-paper shadow-brut md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex gap-1" aria-hidden="true">
              <span className="h-6 w-2 rounded-full border-2 border-paper/60 bg-paper/20" />
              <span className="h-6 w-2 rounded-full border-2 border-paper/60 bg-paper/20" />
            </div>
            <div className="text-xs font-bold tracking-widest text-paper">
              FEEDER NOZZLE #01 // AUDITING YEAR {selectedYear}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="border border-sun bg-sun/20 px-2.5 py-1 text-xs font-bold text-sun">
              YEAR: {selectedYear}
            </span>

            <button
              onClick={handlePrintStory}
              aria-label="Print story receipt and return to top"
              className="min-h-[44px] border-2 border-paper bg-hot px-4 py-2 font-display text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_#fff] transition hover:bg-hot/80"
            >
              🖨️ PRINT STORY ▶
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

Insights.propTypes = {
  stats: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
}
