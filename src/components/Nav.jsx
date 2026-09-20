import { NavLink, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { playBeep } from '../utils/audio'

const NAV_LINKS = [
  { label: 'HERO', to: '/' },
  { label: 'STORY ROLL', to: '/story' },
  { label: 'STRING BOARD', to: '/board' },
  { label: 'EXPLORE', to: '/explore' },
  { label: 'INSIGHTS', to: '/insights' },
]

/**
 * Global Header Navigation bar component.
 * Mobile: two rows — logo+actions on row 1, scrollable nav strip on row 2.
 * Desktop (lg+): single row with nav links inline.
 */
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
      {/* ── Row 1: logo + optional badges + action buttons ── */}
      <div className="flex items-center gap-3 px-4 py-3 md:px-8">
        <img
          src="/favicon.svg"
          alt="Receipts of a Life logo"
          className="h-9 w-9 shrink-0 shadow-brut-sm"
        />
        <NavLink to="/" className="font-display text-sm font-bold leading-4">
          RECEIPTS OF A<br />
          LIFE
        </NavLink>

        {years && (
          <span className="hidden items-center gap-1 border-2 border-ink bg-sun px-2 py-1 text-[12px] font-bold tracking-wider xl:inline-flex">
            <span className="text-hot" aria-hidden="true">
              ●
            </span>{' '}
            LIVE THERMAL DISK: {years}
          </span>
        )}

        {/* Desktop nav — inline in row 1 */}
        <nav
          className="ml-auto hidden items-center gap-2 lg:flex"
          aria-label="Page sections"
        >
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
            aria-label={
              beepOn
                ? 'Beep sound enabled – click to mute'
                : 'Beep sound muted – click to enable'
            }
          >
            {beepOn ? '🔊' : '🔇'}
            <span className="hidden sm:inline">
              {' '}
              {beepOn ? 'BEEP ON' : 'BEEP OFF'}
            </span>
          </button>
          <button
            onClick={handlePrintClick}
            aria-label="Print story receipt and unroll thermal paper"
            className="min-h-[44px] border-[3px] border-ink bg-hot px-3.5 py-1.5 text-[12px] font-bold tracking-wider shadow-brut-sm transition hover:bg-hot/80 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            🖨️
            <span className="hidden sm:inline"> PRINT STORY</span>
          </button>
        </div>
      </div>

      {/* ── Row 2: scrollable nav strip — mobile only, hidden lg+ ── */}
      <nav
        className="flex overflow-x-auto border-t-2 border-ink/20 lg:hidden"
        aria-label="Page sections"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {NAV_LINKS.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `shrink-0 flex min-h-[44px] items-center border-r-2 border-ink/20 px-4 text-[12px] font-bold tracking-wider transition ${
                isActive
                  ? 'bg-sun text-ink'
                  : 'bg-paper text-ink/80 hover:bg-sun/30'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

Nav.propTypes = {
  years: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paper: PropTypes.number,
  beepOn: PropTypes.bool.isRequired,
  onBeep: PropTypes.func.isRequired,
  onPrint: PropTypes.func,
}

