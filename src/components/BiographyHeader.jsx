import PropTypes from 'prop-types'
import { num } from '../utils/format'

/**
 * Biography tape header component for Story Roll.
 */
export default function BiographyHeader({ stats, yearStats }) {
  const [startISO] = stats.spotify_range
  const startY = startISO.slice(0, 4)

  const playsText =
    yearStats.plays != null ? `${num(yearStats.plays)} plays` : 'No plays'
  const purchasesText =
    yearStats.purchases != null
      ? `${num(yearStats.purchases)} purchases`
      : 'No bank receipts'

  return (
    <div className="border-b-[3px] border-ink/40 pb-5 text-center">
      <div className="mb-3 inline-flex items-center gap-2 border-[2px] border-paper/60 px-4 py-1">
        <span className="text-[12px] text-mint">●</span>
        <span className="font-mono text-[12px] font-bold tracking-widest text-paper">
          OFFICIAL BIOGRAPHY TAPE · {yearStats.year}
        </span>
        <span className="text-[12px] text-mint">●</span>
      </div>

      <h1 className="font-display text-3xl font-bold leading-tight text-paper sm:text-4xl md:text-5xl">
        STORY ROLL: RECEIPTS OF A LIFE
      </h1>
      <p className="mx-auto mt-3 max-w-sm font-mono text-[12px] font-bold leading-relaxed text-paper/80">
        {playsText} of Spotify browsing, {purchasesText} bank statements,
        digital exhaust.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 font-mono text-[12px] font-bold text-paper/70">
        {[
          `TERMINAL ID: POS-${startY}-07`,
          `PRINTER: THERMAL BUILT-BEGIN`,
          `ACTIVE AUDIT YEAR: ${yearStats.year}`,
        ].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  )
}

BiographyHeader.propTypes = {
  stats: PropTypes.shape({
    spotify_range: PropTypes.array.isRequired,
  }).isRequired,
  yearStats: PropTypes.shape({
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    plays: PropTypes.number,
    purchases: PropTypes.number,
  }).isRequired,
}
