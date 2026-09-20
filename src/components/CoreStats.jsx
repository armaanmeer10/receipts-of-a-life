import PropTypes from 'prop-types'
import { num } from '../utils/format'

function Dash() {
  return <div className="my-2 border-t-2 border-dashed border-ink/40" />
}

function SectionHead({ icon, title, badge }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {icon && (
        <span className="text-base" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="font-display text-[12px] font-bold tracking-widest text-ink">
        {title}
      </span>
      {badge && (
        <span className="ml-auto border border-hot bg-hot/20 px-2 py-0.5 text-[12px] font-bold tracking-widest text-[#880e4f]">
          {badge}
        </span>
      )}
    </div>
  )
}

SectionHead.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  badge: PropTypes.string,
}

/**
 * Core Spindle Stats sidebar widget for Story Roll.
 */
export default function CoreStats({ yearStats }) {
  const playsText =
    yearStats.plays != null ? `${num(yearStats.plays)} PLAYS` : 'No records'
  const hoursText =
    yearStats.hours != null ? `${num(yearStats.hours)} HOURS` : 'No records'
  const purchasesText =
    yearStats.purchases != null
      ? `${num(yearStats.purchases)} PURCHASES`
      : 'No records'

  const rows = [
    { k: 'ACTIVE AUDIT:', v: `${yearStats.dateRange}` },
    { k: 'MUSIC PLAYS:', v: playsText },
    { k: 'ACOUSTIC HOURS:', v: hoursText },
    { k: 'LEDGER ENTRIES:', v: purchasesText },
  ]

  return (
    <div className="border-[3px] border-ink bg-white p-4 shadow-brut-sm">
      <SectionHead icon="◉" title="CORE SPINDLE STATS" badge="LIVE" />
      <Dash />
      {rows.map((r) => (
        <div
          key={r.k}
          className="flex justify-between gap-3 py-0.5 font-mono text-[12px]"
        >
          <span className="text-ink/75">{r.k}</span>
          <span className="font-bold">{r.v}</span>
        </div>
      ))}
      <Dash />
      <div className="mt-1 border-2 border-dashed border-ink/40 bg-paper px-3 py-2 font-mono text-[12px] font-bold text-ink/75">
        MOTION PARAMETERS OK · THERMAL HEAD: 203 DPI ARCHIVAL GRADE
      </div>
    </div>
  )
}

CoreStats.propTypes = {
  yearStats: PropTypes.shape({
    dateRange: PropTypes.string.isRequired,
    plays: PropTypes.number,
    hours: PropTypes.number,
    purchases: PropTypes.number,
  }).isRequired,
}
