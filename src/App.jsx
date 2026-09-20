import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { YearProvider, useYear } from './context/YearContext'
import Nav from './components/Nav'
import Ticker from './components/Ticker'
import Hero from './pages/Hero'
import StoryRoll from './pages/StoryRoll'
import StringBoard from './pages/StringBoard'
import Explore from './pages/Explore'
import Insights from './pages/Insights'
import { playBeep } from './lib/helpers'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function ThermalLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-6 font-mono text-ink">
      <div className="w-full max-w-sm border-[3px] border-ink bg-white p-6 shadow-brut text-center space-y-4">
        <div className="inline-block border-2 border-ink bg-sun px-3 py-1 text-xs font-bold tracking-widest text-ink animate-pulse">
          CITIZEN THERMAL PRINT HEAD: INITIALIZING ///
        </div>
        <div className="my-2 border-t-2 border-dashed border-ink/40" />
        <div className="font-display text-xl font-bold text-ink">
          FEEDING ARCHIVE ROLL...
        </div>
        <p className="text-xs text-ink/75 leading-relaxed">
          Parsing 149,860 Spotify scrobbles, 2,461 bank ledger transactions, and 11 years of digital exhaust.
        </p>
        <div className="my-2 border-t-2 border-dashed border-ink/40" />
        <div className="flex justify-between text-xs text-ink/70 font-bold">
          <span>STATUS: AUDITING</span>
          <span>2013 – 2024</span>
        </div>
      </div>
    </div>
  )
}

function ThermalError({ message }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-6 font-mono text-ink">
      <div className="w-full max-w-sm border-[3px] border-ink bg-hot/10 p-6 shadow-brut text-center space-y-4 border-hot">
        <div className="inline-block border-2 border-ink bg-hot px-3 py-1 text-xs font-bold tracking-widest text-ink">
          ⚠️ THERMAL PAPER JAM / ERROR
        </div>
        <div className="my-2 border-t-2 border-dashed border-hot/40" />
        <div className="font-display text-xl font-bold text-ink">
          FEED INTERRUPTED
        </div>
        <p className="text-xs text-ink/80 leading-relaxed">
          {message || 'Unable to load dataset files. Please verify stats.json and events.json.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 border-2 border-ink bg-sun px-4 py-2 font-display text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_#111] hover:bg-sun/80"
        >
          RETRY FEED 🔄
        </button>
      </div>
    </div>
  )
}

function MainApp() {
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [printKey, setPrintKey] = useState(0)
  const [beepOn, setBeepOn] = useState(true)
  const { selectedYear } = useYear()

  useEffect(() => {
    let isMounted = true
    Promise.all([
      fetch('./data/stats.json').then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stats.json')
        return res.json()
      }),
      fetch('./data/events.json').then((res) => {
        if (!res.ok) throw new Error('Failed to fetch events.json')
        return res.json()
      }),
    ])
      .then(([statsData, eventsData]) => {
        if (isMounted) {
          setStats(statsData)
          setEvents(eventsData)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Re-trigger print key when selected year changes
  useEffect(() => {
    setPrintKey((k) => k + 1)
  }, [selectedYear])

  const handlePrint = () => {
    setPrintKey((k) => k + 1)
  }

  const handleToggleBeep = () => {
    setBeepOn((b) => !b)
  }

  if (loading) return <ThermalLoading />
  if (error || !stats || !events) return <ThermalError message={error} />

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-paper font-sans text-ink selection:bg-hot selection:text-ink max-w-full overflow-x-hidden">
        <Nav
          years={stats.years}
          paper={100}
          beepOn={beepOn}
          onBeep={handleToggleBeep}
          onPrint={handlePrint}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Hero
                stats={stats}
                events={events}
                printKey={printKey}
                onReprint={() => {
                  handlePrint()
                  if (beepOn) playBeep()
                }}
                beepOn={beepOn}
                setBeepOn={setBeepOn}
              />
            }
          />
          <Route path="/story" element={<StoryRoll stats={stats} events={events} />} />
          <Route path="/board" element={<StringBoard stats={stats} events={events} />} />
          <Route path="/explore" element={<Explore stats={stats} events={events} />} />
          <Route path="/insights" element={<Insights stats={stats} events={events} />} />
        </Routes>
        <Ticker stats={stats} events={events} />
      </div>
    </HashRouter>
  )
}

export default function App() {
  return (
    <YearProvider>
      <MainApp />
    </YearProvider>
  )
}