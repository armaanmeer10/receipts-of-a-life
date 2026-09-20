import { fmtDate, num } from '../lib/helpers'

const KINDS = ['first_play', 'salary_first', 'investment', 'subscription', 'discovery', 'double_day', 'binge', 'peak_month', 'last_receipt']

export default function Ticker({ events, stats }) {
  const text =
    events
      .filter((e) => KINDS.includes(e.kind))
      .slice(0, 18)
      .map((e) => `${fmtDate(e.date)} · ${e.title}`)
      .join('   |   ') + `   |   ${num(stats.plays)} PLAYS / ${num(stats.purchases)} PURCHASES   |   `

  return (
    <footer className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="flex items-center">
        <span className="shrink-0 border-r-[3px] border-ink bg-hot px-3 py-2 text-[12px] font-bold tracking-widest text-ink">
          ● LIVE FEED
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="marquee py-2 text-[12px] tracking-wider">
            <span className="whitespace-nowrap pr-10">{text}</span>
            <span className="whitespace-nowrap pr-10" aria-hidden="true">{text}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
