import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { num, fmtDate, fmtTime, playBeep } from '../lib/helpers'

function zigzag(teeth = 22, depth = 8) {
  const pts = ['0 0', '100% 0']
  for (let i = teeth; i >= 0; i--) {
    pts.push(`${((i * 100) / teeth).toFixed(2)}% ${i % 2 === 0 ? '100%' : `calc(100% - ${depth}px)`}`)
  }
  return `polygon(${pts.join(', ')})`
}
const ZIGZAG = zigzag()

const OUTLINE = 'drop-shadow(0 0 2px #111) drop-shadow(5px 5px 0 #111)'

const BARCODE =
  'repeating-linear-gradient(90deg,#111 0 2px,transparent 2px 4px,#111 4px 5px,transparent 5px 8px,#111 8px 11px,transparent 11px 12px)'

function useCountUp(target, ms = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    let start
    const tick = (t) => {
      if (!start) start = t
      const p = Math.min((t - start) / ms, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return value
}

const scrollToAudit = () =>
  document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

function PrinterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 9V3h10v6" />
      <rect x="3" y="9" width="18" height="8" rx="1" />
      <path d="M7 14h10v7H7z" fill="#ffe500" />
    </svg>
  )
}

function Dash() {
  return <div className="my-2 border-t-2 border-dashed border-ink/40" />
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-3 font-mono text-[12px]">
      <span className="text-ink/80">{k}</span>
      <span className="text-right font-bold text-ink">{v}</span>
    </div>
  )
}

function Sticker({ label, value, bg, textClass = 'text-ink', className, rotate, delay, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={`Select receipt filter: ${label}`}
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{ scale: 1, rotate, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14, delay }}
      whileHover={{ scale: 1.08, rotate: 0, transition: { duration: 0.15 } }}
      className={`absolute z-30 border-[3px] border-ink px-3 py-1.5 shadow-brut-sm ${bg} ${textClass} ${className} cursor-pointer text-left`}
    >
      <div className="text-[12px] font-bold tracking-widest">{label}</div>
      <div className="font-display text-sm font-bold leading-tight">{value}</div>
    </motion.button>
  )
}

function Receipt({ receipt }) {
  if (!receipt) return null

  return (
    <div style={{ filter: OUTLINE }}>
      <div
        className="bg-[#fffdf5] px-4 pb-8 pt-4 font-mono text-[12px] leading-relaxed text-ink"
        style={{ clipPath: ZIGZAG }}
      >
        <div className="text-center">
          <div className="font-display text-base font-bold tracking-wide">RECEIPTS OF A LIFE</div>
          <div className="text-[12px] text-ink/80">TERMINAL #001 · AUDIT RECEIPT #{receipt.id} · 203 DPI</div>
        </div>

        <Dash />
        <Row k="DATE:" v={receipt.date} />
        <Row k="TIME:" v={receipt.time} />
        <Row k="SOURCE:" v={receipt.source} />
        <Dash />

        <div className="font-bold text-ink text-sm">{receipt.itemLabel}</div>
        <div className="font-bold text-ink">{receipt.title}</div>
        <div className="text-ink/80">{receipt.subtitle}</div>

        <div className="my-2.5 text-center">
          <span className={`inline-block border-2 border-ink px-2 py-0.5 text-[12px] font-bold ${receipt.badgeColor}`}>
            {receipt.badge}
          </span>
        </div>

        <Dash />
        <Row k="SUBTOTAL (AUDIT):" v="VERIFIED RECORD" />

        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-sm font-bold">TOTAL:</span>
          <span className="border-2 border-ink bg-sun px-2 py-0.5 text-xs font-bold text-ink">
            {receipt.totalText}
          </span>
        </div>

        <div className="mt-4 h-9" style={{ background: BARCODE }} />
        <div className="mt-1 text-center text-[12px] tracking-widest font-bold">
          {receipt.barcodeText}
        </div>
      </div>
    </div>
  )
}

function Printer({ stats, printKey, activeIndex, onSelectIndex }) {
  const featuredReceipts = [
    {
      id: 1,
      badge: '★ FIRST RECORDED DIGITAL EVENT ★',
      badgeColor: 'bg-hot text-ink',
      title: stats.first_play.track,
      subtitle: `ARTIST: ${stats.first_play.artist}`,
      date: fmtDate(stats.first_play.ts),
      time: `${fmtTime(stats.first_play.ts)} UTC`,
      source: stats.first_play.platform,
      itemLabel: '01. FIRST MUSIC SCROBBLE',
      totalText: '1 song, 1 life.',
      barcodeText: '*20130708-0244-MOWGLIS*',
    },
    {
      id: 2,
      badge: '★ FIRST SALARY CREDITED ★',
      badgeColor: 'bg-sun text-ink',
      title: 'SALARY CREDIT: ₹49,806',
      subtitle: 'ACCOUNT: DIRECT DEPOSIT',
      date: '28 FEB 2015',
      time: '10:00 UTC',
      source: 'SALARY LEDGER',
      itemLabel: '02. INCOME ENTRY #01',
      totalText: '₹49,806 credited.',
      barcodeText: '*20150228-SALARY-FIRST*',
    },
    {
      id: 3,
      badge: '★ MONO-ARTIST DISCOVERY ★',
      badgeColor: 'bg-mint text-ink',
      title: 'Strawberry Fields Forever',
      subtitle: 'ARTIST: The Beatles (13,621 Plays Total)',
      date: '18 JUL 2016',
      time: '14:22 UTC',
      source: 'SPOTIFY DESKTOP',
      itemLabel: '03. THE BEATLES DISCOVERY',
      totalText: '13,621 plays total.',
      barcodeText: '*20160718-BEATLES-DISCOVERY*',
    },
    {
      id: 4,
      badge: '★ CAPITAL INVESTMENT MOVE ★',
      badgeColor: 'bg-sun text-ink',
      title: 'FIXED DEPOSIT: ₹2,00,000',
      subtitle: 'TERM: 3 YEARS ARCHIVAL FD',
      date: '27 JUN 2017',
      time: '11:30 UTC',
      source: 'BANK LEDGER',
      itemLabel: '04. FIXED DEPOSIT LOCKIN',
      totalText: '₹2,00,000 invested.',
      barcodeText: '*20170627-FD-200K*',
    },
    {
      id: 5,
      badge: '★ PEAK LISTENING MONTH ★',
      badgeColor: 'bg-hot text-ink',
      title: '5,176 Plays in Sep 2017',
      subtitle: 'ARTIST: The Beatles & Radiohead',
      date: '06 SEP 2017',
      time: '23:59 UTC',
      source: 'SPOTIFY AUDIT',
      itemLabel: '05. ALL-TIME PEAK MONTH',
      totalText: '62 hours, 5,176 plays.',
      barcodeText: '*20170906-PEAK-MONTH*',
    },
    {
      id: 6,
      badge: '★ RECURRING SUBSCRIPTION ★',
      badgeColor: 'bg-mint text-ink',
      title: 'Netflix & Digital Services',
      subtitle: 'SUBSCRIPTION: ₹199 / MONTH',
      date: '07 OCT 2016',
      time: '08:15 UTC',
      source: 'RECURRING LEDGER',
      itemLabel: '06. NETFLIX SUBSCRIPTION',
      totalText: '₹199 monthly bill.',
      barcodeText: '*20161007-NETFLIX-START*',
    },
    {
      id: 7,
      badge: '★ FINAL LEDGER RECEIPT ★',
      badgeColor: 'bg-paper text-ink',
      title: 'Transportation / Train: ₹30',
      subtitle: 'NOTE: 2 Place 5 to Place 0',
      date: '20 SEP 2018',
      time: '12:04 UTC',
      source: 'LEDGER CLOSE',
      itemLabel: '07. TRANSIT TICKET',
      totalText: '₹30 train fare.',
      barcodeText: '*20180920-LEDGER-CLOSE*',
    },
  ]

  const currentIdx = (activeIndex + printKey) % featuredReceipts.length
  const currentReceipt = featuredReceipts[currentIdx]

  return (
    <div className="relative mx-auto w-full max-w-[440px] pt-6">
      <Sticker
        label="MUSIC AUDIT"
        value={`${num(stats.plays)} TRACKS`}
        bg="bg-sun"
        className="-left-2 top-0 sm:-left-6"
        rotate={-5}
        delay={0.9}
        onClick={() => onSelectIndex(2)}
      />
      <Sticker
        label="ACOUSTIC SPAN"
        value={`${num(Math.floor(stats.hours))} HOURS`}
        bg="bg-hot"
        className="-right-2 top-24 sm:-right-8"
        rotate={4}
        delay={1.1}
        onClick={() => onSelectIndex(4)}
      />
      <Sticker
        label="AUDITED SLIPS"
        value={`${num(stats.purchases)} PURCHASES`}
        bg="bg-volt"
        textClass="text-white"
        className="-left-2 bottom-10 sm:-left-8"
        rotate={-3}
        delay={1.3}
        onClick={() => onSelectIndex(3)}
      />

      <div className="relative z-20 border-[3px] border-ink bg-ink px-3 pb-3 pt-2 text-paper shadow-brut">
        <div className="flex justify-between text-[12px] tracking-widest text-paper">
          <span>PRINT HEAD MK-IV</span>
          <span>
            80MM <span className="text-mint">● READY</span>
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between border-2 border-sun bg-sun/10 px-2 py-1 text-[12px] text-sun">
          <span>⚠ RECEIPT #{currentIdx + 1}/{featuredReceipts.length}</span>
          <div className="flex gap-1">
            <button
              onClick={() => onSelectIndex((currentIdx - 1 + featuredReceipts.length) % featuredReceipts.length)}
              className="border border-sun bg-sun/20 px-1 text-[11px] font-bold text-sun hover:bg-sun hover:text-ink transition"
              aria-label="Previous receipt"
            >
              ◄ PREV
            </button>
            <button
              onClick={() => onSelectIndex((currentIdx + 1) % featuredReceipts.length)}
              className="border border-sun bg-sun/20 px-1 text-[11px] font-bold text-sun hover:bg-sun hover:text-ink transition"
              aria-label="Next receipt"
            >
              NEXT ►
            </button>
          </div>
        </div>

        <div className="mt-2 h-2 border border-paper/30 bg-black" />
      </div>

      <div className="relative z-10 mx-3 overflow-hidden px-2 pb-3">
        <div key={`${printKey}-${currentIdx}`} className="printing">
          <Receipt receipt={currentReceipt} />
        </div>
      </div>
    </div>
  )
}

function Tile({ label, icon, value, suffix = '', caption, bg, text = 'text-ink', rotate, delay, onClick }) {
  const shown = useCountUp(value)
  return (
    <motion.button
      onClick={onClick}
      aria-label={`Inspect ${label}`}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1, rotate }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay }}
      whileHover={{ scale: 1.03, rotate: 0, transition: { duration: 0.15 } }}
      className={`border-[3px] border-ink p-4 shadow-brut ${bg} ${text} cursor-pointer text-left w-full`}
    >
      <div className="flex items-start justify-between">
        <span className="border-2 border-ink bg-white px-1.5 py-0.5 text-[12px] font-bold tracking-widest text-ink">{label}</span>
        <span className="text-lg" aria-hidden="true">{icon}</span>
      </div>
      <div className="mt-3 min-w-[4ch] font-display text-4xl font-bold leading-none tracking-tight tabular-nums md:text-5xl">
        {shown.toLocaleString('en-US')}
        {suffix && <span className="ml-1 text-2xl md:text-3xl">{suffix}</span>}
      </div>
      <div className="mt-2 text-[12px] font-bold tracking-widest">{caption}</div>
    </motion.button>
  )
}

export default function Hero({ stats, printKey, onReprint, beepOn }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const [startISO, endISO] = stats.spotify_range
  const spanDays = Math.round((new Date(endISO) - new Date(startISO)) / 86400000)
  const years = Math.floor(spanDays / 365.25)
  const yearRange = `${startISO.slice(0, 4)}-${endISO.slice(0, 4)}`

  const handleSelectIndex = (idx) => {
    setActiveIndex(idx)
    if (beepOn) playBeep()
  }

  return (
    <main className="relative flex-1 max-w-full overflow-x-hidden">
      <svg
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="thread" d="M 380 250 C 500 110, 640 110, 760 250" />
        <path className="thread" d="M 300 640 C 520 600, 720 420, 850 240" />
      </svg>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <motion.span
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1, rotate: -1 }}
            className="inline-block border-[3px] border-ink bg-hot px-3 py-1 text-[12px] font-bold tracking-widest shadow-brut-sm"
          >
            ✱ THE {years}-YEAR DIGITAL AUTOPSY · {yearRange}
          </motion.span>

          <h1 className="mt-5 block w-fit border-[3px] border-ink bg-sun px-4 py-2 font-display text-5xl font-bold leading-[0.95] tracking-tight shadow-brut sm:text-6xl xl:text-7xl">
            YOUR LIFE,
            <br />
            IN RECEIPTS.
          </h1>

          <div className="mt-8 max-w-xl border-[3px] border-ink bg-white p-4 shadow-brut-sm">
            <p className="text-sm leading-relaxed">
              {years} years of late-night playlists, milk runs, new subscriptions and first paycheques —
              forensically audited on{' '}
              <mark className="bg-sun px-1">80mm thermal receipt paper</mark>.
            </p>
            <div className="mt-3 border-t-2 border-dashed border-ink/40 pt-2 text-[12px] tracking-widest text-ink font-bold">
              AUDIT SPAN: {num(spanDays)} CALENDAR DAYS · SOURCE: SPOTIFY + HOUSEHOLD LEDGER
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onReprint}
              aria-label="Print next story receipt"
              className="flex min-h-[44px] items-center gap-2 border-[3px] border-ink bg-sun px-5 py-3 font-display text-sm font-bold tracking-wide shadow-brut transition hover:-translate-y-0.5 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
            >
              <PrinterIcon /> PRINT MY STORY
            </button>
            <button
              onClick={scrollToAudit}
              aria-label="Read the audit – scroll down"
              className="min-h-[44px] border-[3px] border-ink bg-white px-4 py-3 text-[12px] font-bold tracking-wider shadow-brut-sm transition hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              READ THE AUDIT ↓
            </button>
          </div>

          <button
            onClick={scrollToAudit}
            aria-label={`Unroll ${years} years of memory cassettes`}
            className="mt-6 flex min-h-[44px] items-center gap-2 text-left"
          >
            <span className="text-xl" aria-hidden="true">→</span>
            <span className="border-2 border-ink bg-[#ffd3e3] px-2 py-1 text-[12px] font-bold tracking-widest text-[#880e4f]">
              CLICK TO UNROLL {years} YEARS OF MEMORY CASSETTES
            </span>
          </button>
        </div>

        <Printer
          stats={stats}
          printKey={printKey}
          activeIndex={activeIndex}
          onSelectIndex={handleSelectIndex}
        />
      </section>

      <section id="audit" className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pb-12 pt-4 md:px-8 lg:grid-cols-4 lg:gap-6">
        <Tile
          label="MUSIC AUDIT"
          icon="♪"
          value={stats.plays}
          caption="TRACKS PLAYED"
          bg="bg-sun"
          rotate={-1}
          delay={0.3}
          onClick={() => handleSelectIndex(2)}
        />
        <Tile
          label="TIME LOST"
          icon="◔"
          value={Math.floor(stats.hours)}
          suffix="hrs"
          caption="ACOUSTIC SPAN"
          bg="bg-hot"
          rotate={1}
          delay={0.4}
          onClick={() => handleSelectIndex(4)}
        />
        <Tile
          label="PURCHASE LEDGER"
          icon="₹"
          value={stats.purchases}
          caption="PURCHASES"
          bg="bg-white"
          rotate={-0.5}
          delay={0.5}
          onClick={() => handleSelectIndex(3)}
        />
        <Tile
          label="TIMELINE"
          icon="▣"
          value={years}
          suffix="Years"
          caption="ARCHIVE HISTORY"
          bg="bg-volt"
          text="text-white"
          rotate={1}
          delay={0.6}
          onClick={() => handleSelectIndex(6)}
        />
      </section>
    </main>
  )
}
