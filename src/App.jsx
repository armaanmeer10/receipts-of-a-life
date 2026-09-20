import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/* =====================================================================
   HELPERS
   ===================================================================== */
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function fmtDate(iso) {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d} ${MONTHS[Number(m) - 1]} ${y}`
}

function fmtTime(ts) {
  const clock = ts.replace('T', ' ').split(' ')[1] || '00:00'
  const [h, m] = clock.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ap}`
}

const num = (n) => Number(n).toLocaleString('en-US')

/* zig-zag "torn paper" bottom edge for the receipt */
function zigzag(teeth = 22, depth = 8) {
  const pts = ['0 0', '100% 0']
  for (let i = teeth; i >= 0; i--) {
    pts.push(`${((i * 100) / teeth).toFixed(2)}% ${i % 2 === 0 ? '100%' : `calc(100% - ${depth}px)`}`)
  }
  return `polygon(${pts.join(', ')})`
}
const ZIGZAG = zigzag()

/* black outline + hard shadow that follows the torn edge */
const OUTLINE =
  'drop-shadow(2px 0 0 #111) drop-shadow(-2px 0 0 #111) drop-shadow(0 2px 0 #111) drop-shadow(0 -2px 0 #111) drop-shadow(5px 5px 0 #111)'

const BARCODE =
  'repeating-linear-gradient(90deg,#111 0 2px,transparent 2px 4px,#111 4px 5px,transparent 5px 8px,#111 8px 11px,transparent 11px 12px)'

/* tiny printer "beep" made with the browser's audio - no file needed */
function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.value = 880
    gain.gain.value = 0.04
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.09)
  } catch {
    /* audio blocked - ignore */
  }
}

/* numbers count up from 0 when they appear */
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

/* =====================================================================
   SMALL PIECES
   ===================================================================== */
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
    <div className="flex justify-between gap-3">
      <span className="text-ink/70">{k}</span>
      <span className="text-right font-bold">{v}</span>
    </div>
  )
}

function Sticker({ label, value, bg, textClass = 'text-ink', className, rotate, delay }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{ scale: 1, rotate, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14, delay }}
      className={`absolute z-30 border-[3px] border-ink px-3 py-1.5 shadow-brut-sm ${bg} ${textClass} ${className}`}
    >
      <div className="text-[8px] font-bold tracking-widest">{label}</div>
      <div className="font-display text-sm font-bold leading-tight">{value}</div>
    </motion.div>
  )
}

/* =====================================================================
   NAVIGATION
   ===================================================================== */
function Nav({ years, paper, beepOn, onBeep, onPrint }) {
  const links = ['STORY ROLL', 'STRING BOARD', 'EXPLORE', 'INSIGHTS']
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-paper">
      <div className="flex items-center gap-3 px-4 py-3 md:px-8">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-ink bg-white shadow-brut-sm">
          <PrinterIcon />
        </div>
        <span className="font-display text-sm font-bold leading-4">
          RECEIPTS OF A<br />LIFE
        </span>

        <span className="hidden items-center gap-1 border-2 border-ink bg-sun px-2 py-1 text-[9px] font-bold tracking-wider xl:inline-flex">
          <span className="text-hot">●</span> LIVE THERMAL DISK: {years}
        </span>

        <nav className="ml-auto hidden items-center gap-2 lg:flex">
          <span className="border-[3px] border-ink bg-sun px-3 py-1.5 text-[10px] font-bold tracking-wider shadow-brut-sm">HERO</span>
          {links.map((l) => (
            <span
              key={l}
              className="cursor-default border-2 border-dashed border-volt px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-ink/80 transition hover:bg-white"
              title="Coming in the next screen"
            >
              {l}
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <span className="hidden border-2 border-ink bg-white px-2 py-1 text-[9px] font-bold tracking-wider sm:inline-block">
            PAPER: {paper}%
          </span>
          <button
            onClick={onBeep}
            className={`border-2 border-ink px-2 py-1 text-[9px] font-bold tracking-wider transition active:translate-y-0.5 ${beepOn ? 'bg-mint' : 'bg-white'}`}
            aria-pressed={beepOn}
          >
            {beepOn ? '🔊 BEEP ON' : '🔇 BEEP'}
          </button>
          <button
            onClick={onPrint}
            className="border-[3px] border-ink bg-hot px-3 py-1.5 text-[10px] font-bold tracking-wider shadow-brut-sm transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            PRINT STORY
          </button>
        </div>
      </div>
    </header>
  )
}

/* =====================================================================
   THE RECEIPT (real first record from the data)
   ===================================================================== */
function Receipt({ stats }) {
  const fp = stats.first_play
  const date = fmtDate(fp.ts)
  const time = fmtTime(fp.ts)
  const stamp = fp.ts.replace('T', ' ').split(' ')[1].slice(0, 5).replace(':', '')
  const yyyymmdd = fp.ts.slice(0, 10).replace(/-/g, '')
  const slug = fp.artist.toUpperCase().replace(/^THE\s+/, '').replace(/[^A-Z]/g, '')

  return (
    <div style={{ filter: OUTLINE }}>
      <div
        className="bg-[#fffdf5] px-4 pb-8 pt-4 font-mono text-[10px] leading-relaxed text-ink"
        style={{ clipPath: ZIGZAG }}
      >
        <div className="text-center">
          <div className="font-display text-base font-bold tracking-wide">RECEIPTS OF A LIFE</div>
          <div className="text-[9px] text-ink/70">TERMINAL #001 · ARCHIVE INCEPTION · 203 DPI</div>
        </div>

        <Dash />
        <Row k="DATE:" v={date} />
        <Row k="TIME:" v={`${time} UTC`} />
        <Row k="SOURCE:" v={fp.platform} />
        <Dash />

        <div className="font-bold">01. {fp.track}</div>
        <div className="text-ink/70">ARTIST: {fp.artist} [Track #1]</div>

        <div className="my-2 text-center">
          <span className="inline-block border-2 border-ink bg-hot px-2 py-0.5 text-[9px] font-bold">
            ★ FIRST RECORDED DIGITAL EVENT ★
          </span>
        </div>

        <Dash />
        <Row k="SUBTOTAL (ITEM COUNT):" v="1 SONG PLAYED" />

        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-sm font-bold">TOTAL:</span>
          <span className="border-2 border-ink bg-sun px-2 py-0.5 text-xs font-bold">1 song, 1 life.</span>
        </div>

        <div className="mt-4 h-9" style={{ background: BARCODE }} />
        <div className="mt-1 text-center text-[8px] tracking-widest">
          *{yyyymmdd}-{stamp}-{slug}*
        </div>
      </div>
    </div>
  )
}

function Printer({ stats, printKey }) {
  return (
    <div className="relative mx-auto w-full max-w-[440px] pt-6">
      <Sticker
        label="MUSIC AUDIT"
        value={`${num(stats.plays)} TRACKS`}
        bg="bg-sun"
        className="-left-2 top-0 sm:-left-6"
        rotate={-5}
        delay={0.9}
      />
      <Sticker
        label="ACOUSTIC SPAN"
        value={`${num(Math.floor(stats.hours))} HOURS`}
        bg="bg-hot"
        className="-right-2 top-24 sm:-right-8"
        rotate={4}
        delay={1.1}
      />
      <Sticker
        label="AUDITED SLIPS"
        value={`${num(stats.purchases)} PURCHASES`}
        bg="bg-volt"
        textClass="text-white"
        className="-left-2 bottom-10 sm:-left-8"
        rotate={-3}
        delay={1.3}
      />

      {/* printer body */}
      <div className="relative z-20 border-[3px] border-ink bg-ink px-3 pb-3 pt-2 text-paper shadow-brut">
        <div className="flex justify-between text-[9px] tracking-widest text-paper/80">
          <span>PRINT HEAD MK-IV</span>
          <span>
            80MM <span className="text-mint">● READY</span>
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between border-2 border-sun bg-sun/10 px-2 py-1 text-[9px] text-sun">
          <span>⚠ HOT THERMAL HEAD [203 DPI]</span>
          <span className="opacity-70">DO NOT OBSTRUCT</span>
        </div>
        <div className="mt-2 h-2 border border-paper/30 bg-black" />
      </div>

      {/* paper slot: the receipt slides out of here */}
      <div className="relative z-10 mx-3 overflow-hidden px-2 pb-3">
        <div key={printKey} className="printing">
          <Receipt stats={stats} />
        </div>
      </div>
    </div>
  )
}

/* =====================================================================
   STAT TILES
   ===================================================================== */
function Tile({ label, icon, value, suffix = '', caption, bg, text = 'text-ink', rotate, delay }) {
  const shown = useCountUp(value)
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1, rotate }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay }}
      className={`border-[3px] border-ink p-4 shadow-brut ${bg} ${text}`}
    >
      <div className="flex items-start justify-between">
        <span className="border-2 border-ink bg-white px-1.5 py-0.5 text-[8px] font-bold tracking-widest text-ink">{label}</span>
        <span className="text-lg" aria-hidden="true">{icon}</span>
      </div>
      <div className="mt-3 font-display text-4xl font-bold leading-none tracking-tight md:text-5xl">
        {shown.toLocaleString('en-US')}
        {suffix && <span className="ml-1 text-2xl md:text-3xl">{suffix}</span>}
      </div>
      <div className="mt-2 text-[10px] font-bold tracking-widest">{caption}</div>
    </motion.div>
  )
}

/* =====================================================================
   BOTTOM TICKER (real moments from events.json)
   ===================================================================== */
function Ticker({ events, stats }) {
  const kinds = ['first_play', 'salary_first', 'investment', 'subscription', 'discovery', 'double_day', 'binge', 'peak_month', 'last_receipt']
  const text =
    events
      .filter((e) => kinds.includes(e.kind))
      .slice(0, 18)
      .map((e) => `${fmtDate(e.date)} · ${e.title}`)
      .join('   |   ') + `   |   ${num(stats.plays)} PLAYS / ${num(stats.purchases)} PURCHASES   |   `

  return (
    <footer className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="flex items-center">
        <span className="shrink-0 border-r-[3px] border-ink bg-hot px-3 py-2 text-[10px] font-bold tracking-widest text-ink">
          ● LIVE FEED
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="marquee py-2 text-[10px] tracking-wider">
            <span className="whitespace-nowrap pr-10">{text}</span>
            <span className="whitespace-nowrap pr-10" aria-hidden="true">{text}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* =====================================================================
   PAGE
   ===================================================================== */
export default function App() {
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
  const [printKey, setPrintKey] = useState(0)
  const [beepOn, setBeepOn] = useState(false)

  useEffect(() => {
    const get = (name) =>
      fetch(`/data/${name}.json`).then((r) => {
        if (!r.ok) throw new Error(`${name}.json not found (status ${r.status})`)
        return r.json()
      })
    Promise.all([get('stats'), get('events')])
      .then(([s, e]) => {
        setStats(s)
        setEvents(e)
      })
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <p className="p-8 font-mono text-red-600">Error: {error}</p>
  if (!stats) return <p className="p-8 font-mono">printing...</p>

  const [startISO, endISO] = stats.spotify_range
  const spanDays = Math.round((new Date(endISO) - new Date(startISO)) / 86400000)
  const years = Math.floor(spanDays / 365.25)
  const yearRange = `${startISO.slice(0, 4)}-${endISO.slice(0, 4)}`
  const paper = Math.max(10, 84 - printKey * 2)

  const reprint = () => {
    if (beepOn) beep()
    setPrintKey((k) => k + 1)
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Nav
        years={yearRange}
        paper={paper}
        beepOn={beepOn}
        onBeep={() => setBeepOn((b) => !b)}
        onPrint={reprint}
      />

      <main className="relative flex-1">
        {/* red dotted strings */}
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
          {/* ---------- left: the pitch ---------- */}
          <div>
            <motion.span
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1, rotate: -1 }}
              className="inline-block border-[3px] border-ink bg-hot px-3 py-1 text-[10px] font-bold tracking-widest shadow-brut-sm"
            >
              ✱ THE {years}-YEAR DIGITAL AUTOPSY · {yearRange}
            </motion.span>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1, rotate: -1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 120, damping: 14 }}
              className="mt-5 block w-fit border-[3px] border-ink bg-sun px-4 py-2 font-display text-5xl font-bold leading-[0.95] tracking-tight shadow-brut sm:text-6xl xl:text-7xl"
            >
              YOUR LIFE,
              <br />
              IN RECEIPTS.
            </motion.h1>

            <div className="mt-8 max-w-xl border-[3px] border-ink bg-white p-4 shadow-brut-sm">
              <p className="text-sm leading-relaxed">
                {years} years of late-night playlists, milk runs, new subscriptions and first paycheques —
                forensically audited on{' '}
                <mark className="bg-sun px-1">80mm thermal receipt paper</mark>.
              </p>
              <div className="mt-3 border-t-2 border-dashed border-ink/40 pt-2 text-[9px] tracking-widest text-ink/70">
                AUDIT SPAN: {num(spanDays)} CALENDAR DAYS · SOURCE: SPOTIFY + HOUSEHOLD LEDGER
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={reprint}
                className="flex items-center gap-2 border-[3px] border-ink bg-sun px-5 py-3 font-display text-sm font-bold tracking-wide shadow-brut transition hover:-translate-y-0.5 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
              >
                <PrinterIcon /> PRINT MY STORY
              </button>
              <button
                onClick={scrollToAudit}
                className="border-[3px] border-ink bg-white px-4 py-3 text-[11px] font-bold tracking-wider shadow-brut-sm transition hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                READ THE AUDIT ↓
              </button>
            </div>

            <button
              onClick={scrollToAudit}
              className="mt-6 flex items-center gap-2 text-left"
            >
              <span className="text-xl" aria-hidden="true">→</span>
              <span className="border-2 border-ink bg-[#ffd3e3] px-2 py-1 text-[10px] font-bold tracking-widest text-[#c2185b]">
                CLICK TO UNROLL {years} YEARS OF MEMORY CASSETTES
              </span>
            </button>
          </div>

          {/* ---------- right: the printer ---------- */}
          <Printer stats={stats} printKey={printKey} />
        </section>

        {/* ---------- stat tiles ---------- */}
        <section id="audit" className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pb-12 pt-4 md:px-8 lg:grid-cols-4 lg:gap-6">
          <Tile label="MUSIC AUDIT" icon="♪" value={stats.plays} caption="TRACKS PLAYED" bg="bg-sun" rotate={-1} delay={0.3} />
          <Tile label="TIME LOST" icon="◔" value={Math.floor(stats.hours)} suffix="hrs" caption="ACOUSTIC SPAN" bg="bg-hot" rotate={1} delay={0.4} />
          <Tile label="PURCHASE LEDGER" icon="₹" value={stats.purchases} caption="PURCHASES" bg="bg-white" rotate={-0.5} delay={0.5} />
          <Tile label="TIMELINE" icon="▣" value={years} suffix="Years" caption="ARCHIVE HISTORY" bg="bg-volt" text="text-white" rotate={1} delay={0.6} />
        </section>
      </main>

      <Ticker events={events} stats={stats} />
    </div>
  )
}