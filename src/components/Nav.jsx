import { NavLink, useNavigate } from 'react-router-dom'
import { playBeep } from '../lib/helpers'

function PrinterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 9V3h10v6" />
      <rect x="3" y="9" width="18" height="8" rx="1" />
      <path d="M7 14h10v7H7z" fill="#ffe500" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'HERO', to: '/' },
  { label: 'STORY ROLL', to: '/story' },
  { label: 'STRING BOARD', to: '/board' },
  { label: 'EXPLORE', to: '/explore' },
  { label: 'INSIGHTS', to: '/insights' },
]

export default function Nav({ years, paper, beepOn, onBeep, onPrint }) {
  const navigate = useNavigate()

  const handlePrintClick = () => {
    if (beepOn) playBeep()
    if (onPrint) onPrint()
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBeepClick = () => {
    if (onBeep) onBeep()
    if (!beepOn) playBeep()
  }

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-paper">
      <div className="flex items-center gap-3 px-4 py-3 md:px-8">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-ink bg-white shadow-brut-sm" aria-hidden="true">
          <PrinterIcon />
        </div>
        <NavLink to="/" className="font-display text-sm font-bold leading-4">
          RECEIPTS OF A<br />LIFE
        </NavLink>

        {years && (
          <span className="hidden items-center gap-1 border-2 border-ink bg-sun px-2 py-1 text-[12px] font-bold tracking-wider xl:inline-flex">
            <span className="text-hot" aria-hidden="true">●</span> LIVE THERMAL DISK: {years}
          </span>
        )}

        <nav className="ml-auto hidden items-center gap-2 lg:flex" aria-label="Page sections">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'border-[3px] border-ink bg-sun px-3 py-1.5 text-[12px] font-bold tracking-wider shadow-brut-sm'
                  : 'border-2 border-dashed border-volt px-2.5 py-1.5 text-[12px] font-bold tracking-wider text-ink transition hover:bg-white'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          {paper != null && (
            <span className="hidden border-2 border-ink bg-white px-2 py-1 text-[12px] font-bold tracking-wider sm:inline-block">
              PAPER: {paper}%
            </span>
          )}
          <button
            onClick={handleBeepClick}
            className={`min-h-[44px] border-2 border-ink px-3 py-1 text-[12px] font-bold tracking-wider transition active:translate-y-0.5 ${
              beepOn ? 'bg-mint text-ink' : 'bg-white text-ink/75'
            }`}
            aria-pressed={beepOn}
            aria-label={beepOn ? 'Beep sound enabled – click to mute' : 'Beep sound muted – click to enable'}
          >
            {beepOn ? '🔊 BEEP ON' : '🔇 BEEP OFF'}
          </button>
          <button
            onClick={handlePrintClick}
            aria-label="Print story receipt and unroll thermal paper"
            className="min-h-[44px] border-[3px] border-ink bg-hot px-3.5 py-1.5 text-[12px] font-bold tracking-wider shadow-brut-sm transition hover:bg-hot/80 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            🖨️ PRINT STORY
          </button>
        </div>
      </div>
    </header>
  )
}
