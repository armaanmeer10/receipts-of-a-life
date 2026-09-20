import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'

import Nav     from './components/Nav'
import Ticker  from './components/Ticker'
import Hero        from './pages/Hero'
import StoryRoll   from './pages/StoryRoll'
import StringBoard from './pages/StringBoard'
import Explore     from './pages/Explore'
import Insights    from './pages/Insights'

/* ── scroll-to-top on every route change ── */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

/* ── tiny beep helper (lives here so Nav can call it) ── */
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
    /* audio blocked */
  }
}

/* ── loading skeleton that mirrors the real page layout ── */
function Skeleton() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden" aria-busy="true" aria-label="Loading your receipts">
      <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-paper">
        <div className="flex items-center gap-3 px-4 py-3 md:px-8">
          <div className="h-9 w-9 shrink-0 border-[3px] border-ink bg-white" />
          <div className="h-5 w-32 animate-pulse rounded bg-ink/20" />
          <div className="ml-auto h-9 w-28 animate-pulse rounded bg-ink/20" />
        </div>
      </header>
      <main className="relative flex-1">
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="space-y-6">
            <div className="h-6 w-48 animate-pulse rounded bg-ink/20" />
            <div className="h-24 w-72 animate-pulse rounded bg-ink/20" />
            <div className="h-32 w-full max-w-xl animate-pulse rounded bg-ink/20" />
            <div className="flex gap-4">
              <div className="h-12 w-40 animate-pulse rounded bg-ink/20" />
              <div className="h-12 w-36 animate-pulse rounded bg-ink/20" />
            </div>
          </div>
          <div className="mx-auto h-[460px] w-full max-w-[440px] animate-pulse rounded bg-ink/20" />
        </section>
        <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pb-12 pt-4 md:px-8 lg:grid-cols-4 lg:gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded border-[3px] border-ink/20 bg-ink/10" />
          ))}
        </section>
      </main>
      <footer className="border-t-[3px] border-ink bg-ink">
        <div className="h-10 animate-pulse bg-ink/80" />
      </footer>
    </div>
  )
}

/* ── root app shell ── */
function AppShell() {
  const [stats,    setStats]    = useState(null)
  const [events,   setEvents]   = useState([])
  const [error,    setError]    = useState(null)
  const [printKey, setPrintKey] = useState(0)
  const [beepOn,   setBeepOn]   = useState(false)

  useEffect(() => {
    const get = (name) =>
      fetch(`/data/${name}.json`).then((r) => {
        if (!r.ok) throw new Error(`${name}.json not found (status ${r.status})`)
        return r.json()
      })
    Promise.all([get('stats'), get('events')])
      .then(([s, e]) => { setStats(s); setEvents(e) })
      .catch((e) => setError(e.message))
  }, [])

  if (error)  return <p className="p-8 font-mono text-red-600">Error: {error}</p>
  if (!stats) return <Skeleton />

  const [startISO, endISO] = stats.spotify_range
  const spanDays = Math.round((new Date(endISO) - new Date(startISO)) / 86400000)
  const years    = Math.floor(spanDays / 365.25)
  const yearRange = `${startISO.slice(0, 4)}-${endISO.slice(0, 4)}`
  const paper    = Math.max(10, 84 - printKey * 2)

  const reprint = () => {
    if (beepOn) beep()
    setPrintKey((k) => k + 1)
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <ScrollToTop />
      <Nav
        years={yearRange}
        paper={paper}
        beepOn={beepOn}
        onBeep={() => setBeepOn((b) => !b)}
        onPrint={reprint}
      />

      <Routes>
        <Route path="/"        element={<Hero        stats={stats} printKey={printKey} onReprint={reprint} beepOn={beepOn} />} />
        <Route path="/story"   element={<StoryRoll   stats={stats} events={events} />} />
        <Route path="/board"   element={<StringBoard stats={stats} events={events} />} />
        <Route path="/explore" element={<Explore     stats={stats} events={events} />} />
        <Route path="/insights"element={<Insights    stats={stats} events={events} />} />
      </Routes>

      <Ticker events={events} stats={stats} />
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  )
}