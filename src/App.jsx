import { Suspense, lazy, useState, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { YearProvider } from './context/YearContext'
import Nav from './components/Nav'
import Ticker from './components/Ticker'
import Hero from './pages/Hero'
import ErrorBoundary from './components/ErrorBoundary'
import ThermalLoading from './components/ThermalLoading'
import ThermalError from './components/ThermalError'
import PageLoader from './components/PageLoader'
import { useData } from './hooks/useData'
import { playBeep } from './utils/audio'

// Lazy-load secondary pages — Hero stays eagerly loaded for fast first paint
const StoryRoll = lazy(() => import('./pages/StoryRoll'))
const StringBoard = lazy(() => import('./pages/StringBoard'))
const Explore = lazy(() => import('./pages/Explore'))
const Insights = lazy(() => import('./pages/Insights'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function MainApp() {
  const { stats, events, loading, error } = useData()
  const [manualPrintCount, setManualPrintCount] = useState(0)
  const [beepOn, setBeepOn] = useState(true)

  const handlePrint = () => {
    setManualPrintCount((c) => c + 1)
  }

  const handleToggleBeep = () => {
    setBeepOn((b) => !b)
  }

  if (loading) return <ThermalLoading />
  if (error || !stats || !events) return <ThermalError message={error} />

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex min-h-screen max-w-full flex-col overflow-x-hidden bg-paper font-sans text-ink selection:bg-hot selection:text-ink">
        <Nav
          years={stats.years}
          paper={100}
          beepOn={beepOn}
          onBeep={handleToggleBeep}
          onPrint={handlePrint}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                <Hero
                  stats={stats}
                  events={events}
                  printKey={manualPrintCount}
                  onReprint={() => {
                    handlePrint()
                    if (beepOn) playBeep()
                  }}
                  beepOn={beepOn}
                  setBeepOn={setBeepOn}
                />
              }
            />
            <Route
              path="/story"
              element={<StoryRoll stats={stats} events={events} />}
            />
            <Route
              path="/board"
              element={<StringBoard stats={stats} events={events} />}
            />
            <Route
              path="/explore"
              element={<Explore stats={stats} events={events} />}
            />
            <Route
              path="/insights"
              element={<Insights stats={stats} events={events} />}
            />
          </Routes>
        </Suspense>
        <Ticker stats={stats} events={events} />
      </div>
    </HashRouter>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <YearProvider>
        <MainApp />
      </YearProvider>
    </ErrorBoundary>
  )
}
