import PropTypes from 'prop-types'
import { fmtDate, num } from '../utils/format'
import { useYear } from '../hooks/useYear'
import { getYearStats } from '../utils/yearStats'

const KINDS = [
  'first_play',
  'salary_first',
  'investment',
  'subscription',
  'discovery',
  'double_day',
  'binge',
  'peak_month',
  'last_receipt',
]

/**
 * Bottom Marquee Ticker tape component displaying live event feeds and year metrics.
 */
export default function Ticker({ events, stats }) {
  const { selectedYear } = useYear()
  const yearStats = getYearStats(events, stats, selectedYear)

  const activeEvents = yearStats ? yearStats.events : events

  const eventItems = activeEvents
    .filter((e) => KINDS.includes(e.kind))
    .slice(0, 18)
    .map((e) => `${fmtDate(e.date)} · ${e.title}`)
    .join('   |   ')

  const statsText = yearStats
    ? `YEAR ${selectedYear}: ${
        yearStats.plays != null ? `${num(yearStats.plays)} PLAYS` : 'NO PLAYS'
      } / ${
        yearStats.purchases != null
          ? `${num(yearStats.purchases)} PURCHASES`
          : 'NO LEDGER RECEIPTS'
      }`
    : `${num(stats.plays)} PLAYS / ${num(stats.purchases)} PURCHASES`

  const text = `${eventItems ? eventItems + '   |   ' : ''}${statsText}   |   `

  return (
    <footer className="no-print border-t-[3px] border-ink bg-ink text-paper">
      <div className="flex items-center">
        <span className="shrink-0 border-r-[3px] border-ink bg-hot px-3 py-2 text-[12px] font-bold tracking-widest text-ink">
          ● LIVE FEED ({selectedYear})
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="marquee py-2 text-[12px] tracking-wider">
            <span className="whitespace-nowrap pr-10">{text}</span>
            <span className="whitespace-nowrap pr-10" aria-hidden="true">
              {text}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

Ticker.propTypes = {
  events: PropTypes.array.isRequired,
  stats: PropTypes.object.isRequired,
}
