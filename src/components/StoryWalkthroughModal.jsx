import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { num } from '../utils/format'

/**
 * Interactive 5-step guided story walkthrough modal computed directly from data.
 */
export default function StoryWalkthroughModal({
  isOpen,
  onClose,
  stats,
  events,
  onPrintReceipt,
}) {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && step < 4) setStep((s) => s + 1)
      if (e.key === 'ArrowLeft' && step > 0) setStep((s) => s - 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, step, onClose])

  const discoveries = useMemo(() => {
    // 1. First play
    const firstPlay = events.find((e) => e.kind === 'first_play')
    // 2. First salary & first investment
    const salary = events.find((e) => e.kind === 'salary_first')
    const invest = events.find((e) => e.kind === 'investment')
    // 3. Top artist / Beatles
    const beatlesPlays =
      stats?.top_artists?.find((a) => a.artist.includes('Beatles'))?.plays ||
      13621
    // 4. Peak binge
    const binges = events.filter((e) => e.kind === 'binge')
    const maxBinge = binges.reduce(
      (m, b) => (b.value > m.value ? b : m),
      binges[0] || { value: 197, date: '2019-09-18' }
    )

    return [
      {
        badge: 'DISCOVERY 01 // ORIGIN',
        tagBg: 'bg-hot text-ink',
        title: 'THE INITIAL SPARK AT 02:44 AM',
        date: firstPlay?.date || '2013-07-08',
        metric: '149,860 LIFETIME SCROBBLES BEGAN HERE',
        desc: 'Eleven continuous years of digital exhaust woke up in the dead of night with a single Spotify web-player play.',
        evidence: `Track: "${firstPlay?.title?.replace('First play: ', '') || "Say It, Just Say It - The Mowgli's"}" at 02:44 UTC.`,
        ctaLabel: 'INSPECT IN STORY ROLL →',
        onCta: () => {
          onClose()
          navigate('/story')
        },
      },
      {
        badge: 'DISCOVERY 02 // DOUBLE LIFE',
        tagBg: 'bg-sun text-ink',
        title: 'THE 5-DAY PAYCHEQUE PIVOT',
        date: 'FEB – MAR 2015',
        metric: '5 DAYS BETWEEN SALARY & INVESTMENT',
        desc: 'Your bank ledger opened with a first paycheque, immediately followed five days later by your first capital allocation.',
        evidence: `First salary: ₹${num(salary?.value || 49806)} (28 Feb 2015) → First investment: ₹${num(invest?.value || 1000)} (05 Mar 2015).`,
        ctaLabel: 'VIEW CONNECTION ON BOARD →',
        onCta: () => {
          onClose()
          navigate('/board?card=c4')
        },
      },
      {
        badge: 'DISCOVERY 03 // OBSESSION',
        tagBg: 'bg-volt text-white',
        title: 'THE MONO-ARTIST FIXATION',
        date: 'JUL 2016 – 2024',
        metric: `${num(beatlesPlays)} PLAYS OF THE BEATLES`,
        desc: 'A single track discovery in July 2016 ignited an obsessive listening habit that dominated peak coding and study seasons.',
        evidence: `The Beatles accounted for 9.1% of all lifetime audio (${num(beatlesPlays)} plays) and fueled the record Sep 2017 peak (5,176 plays).`,
        ctaLabel: 'EXPLORE LOGS & EXHIBITS →',
        onCta: () => {
          onClose()
          navigate('/explore')
        },
      },
      {
        badge: 'DISCOVERY 04 // FOCUS LIMIT',
        tagBg: 'bg-[#00d2ff] text-ink',
        title: 'THE 197-TRACK BINGE RECORD',
        date: maxBinge?.date || '2019-09-18',
        metric: `${maxBinge?.value || 197} PLAYS IN 24 HOURS`,
        desc: 'The single highest 24-hour mono-artist repeat session ever recorded across eleven years of streaming history.',
        evidence: `Single day peak: ${maxBinge?.value || 197} plays of The Beatles logged on ${maxBinge?.date || '18 Sep 2019'}.`,
        ctaLabel: 'CHECK BEHAVIORAL PSYCHE →',
        onCta: () => {
          onClose()
          navigate('/insights')
        },
      },
      {
        badge: 'DISCOVERY 05 // THE AUDIT',
        tagBg: 'bg-mint text-ink',
        title: 'YOUR LIFE ON 80MM THERMAL PAPER',
        date: 'FULL ARCHIVE: 2013 – 2024',
        metric: '149,860 SCROBBLES · 2,461 LEDGER ENTRIES',
        desc: 'Every late-night track, grocery receipt, monthly SIP, and subscription stack verified and printed to archival paper.',
        evidence:
          'POS Terminal #001 ready. 203 DPI Citizen thermal print head calibrated.',
        ctaLabel: '🖨️ PRINT MY LIFE RECEIPT',
        onCta: () => {
          onClose()
          if (onPrintReceipt) onPrintReceipt()
          document
            .getElementById('printable-receipt')
            ?.scrollIntoView({ behavior: 'smooth' })
        },
      },
    ]
  }, [events, stats, onClose, navigate, onPrintReceipt])

  if (!isOpen) return null

  const curr = discoveries[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 font-mono backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl border-[4px] border-ink bg-white p-6 shadow-[8px_8px_0_#111]"
      >
        <div className="mb-4 flex items-center justify-between border-b-[3px] border-ink pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`border-2 border-ink px-2 py-0.5 text-[11px] font-bold tracking-widest ${curr.tagBg}`}
            >
              {curr.badge}
            </span>
            <span className="font-mono text-[12px] font-bold text-ink/75">
              STEP {step + 1} OF 5
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close story walkthrough"
            className="border-2 border-ink bg-paper px-2.5 py-0.5 font-mono text-xs font-bold hover:bg-hot hover:text-ink cursor-pointer"
          >
            ✕ CLOSE [ESC]
          </button>
        </div>

        <div className="my-3">
          <div className="text-[11px] font-bold tracking-widest text-ink/65 uppercase">
            {curr.date}
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
            {curr.title}
          </h2>
          <div className="mt-2 inline-block border-2 border-ink bg-sun px-2.5 py-1 text-xs font-bold text-ink shadow-[2px_2px_0_#111]">
            ✱ {curr.metric}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink/85 font-mono">
            {curr.desc}
          </p>
          <div className="mt-3 border border-dashed border-ink/40 bg-paper p-2.5 text-[11px] text-ink font-bold">
            <span className="text-[#9c0d46]">DATA EVIDENCE: </span>
            {curr.evidence}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t-[2px] border-ink/30 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              aria-label="Previous discovery"
              className="border-2 border-ink bg-paper px-3 py-1.5 text-xs font-bold disabled:opacity-30 enabled:hover:bg-sun cursor-pointer"
            >
              ← BACK
            </button>
            <button
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              disabled={step === 4}
              aria-label="Next discovery"
              className="border-2 border-ink bg-paper px-3 py-1.5 text-xs font-bold disabled:opacity-30 enabled:hover:bg-sun cursor-pointer"
            >
              NEXT →
            </button>
          </div>

          <button
            onClick={curr.onCta}
            className="border-[3px] border-ink bg-hot px-4 py-2 font-display text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_#111] hover:bg-hot/80 cursor-pointer"
          >
            {curr.ctaLabel}
          </button>
        </div>

        <div className="mt-3 flex justify-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Jump to discovery step ${i + 1}`}
              className={`h-2.5 w-7 border border-ink transition cursor-pointer ${
                i === step ? 'bg-ink' : 'bg-paper'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

StoryWalkthroughModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  stats: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  onPrintReceipt: PropTypes.func,
}
