import PropTypes from 'prop-types'
import { num } from '../utils/format'
import {
  RECEIPT_ZIGZAG_TEETH,
  RECEIPT_ZIGZAG_DEPTH,
  BARCODE_GRADIENT,
} from '../constants'

function zigzag(teeth = RECEIPT_ZIGZAG_TEETH, depth = RECEIPT_ZIGZAG_DEPTH) {
  const pts = ['0 0', '100% 0']
  for (let i = teeth; i >= 0; i--) {
    pts.push(
      `${((i * 100) / teeth).toFixed(2)}% ${
        i % 2 === 0 ? '100%' : `calc(100% - ${depth}px)`
      }`
    )
  }
  return `polygon(${pts.join(', ')})`
}

const ZIGZAG = zigzag()

function Dash() {
  return <div className="my-2 border-t-2 border-dashed border-ink/40" />
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-3 font-mono text-[12px]">
      <span className="text-ink/80">{k}</span>
      <span className="text-right font-bold text-ink">{v}</span>
    </div>
  )
}

Row.propTypes = {
  k: PropTypes.string.isRequired,
  v: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

/**
 * Thermal Paper Receipt layout component.
 */
export default function Receipt({ yearStats }) {
  if (!yearStats) return null

  const yLabel =
    yearStats.year === 'ALL'
      ? 'ALL YEARS (2013-2024)'
      : `YEAR ${yearStats.year}`

  return (
    <div
      id="printable-receipt"
      style={{ boxShadow: '5px 5px 0 #111, 0 0 0 2px #111' }}
    >
      <div
        className="bg-[#fffdf5] px-4 pb-8 pt-4 font-mono text-[12px] leading-relaxed text-ink"
        style={{ clipPath: ZIGZAG }}
      >
        <div className="text-center">
          <div className="font-display text-base font-bold tracking-wide">
            RECEIPTS OF A LIFE
          </div>
          <div className="text-[12px] font-bold text-ink">
            TERMINAL #001 · {yLabel} · 203 DPI
          </div>
        </div>

        <Dash />
        <Row k="DATE RANGE:" v={yearStats.dateRange} />
        <Row k="STATUS:" v="VERIFIED AUDIT" />
        <Dash />

        {yearStats.topArtist ? (
          <div className="mb-1.5">
            <div className="font-bold text-ink">01. TOP ARTIST</div>
            <div className="text-ink/80 font-bold">
              {yearStats.topArtist.artist} ({num(yearStats.topArtist.plays)}{' '}
              PLAYS)
            </div>
          </div>
        ) : (
          <Row k="TOP ARTIST:" v="No records" />
        )}

        {yearStats.plays != null ? (
          <Row k="MUSIC SCROBBLES:" v={`${num(yearStats.plays)} PLAYS`} />
        ) : (
          <Row k="MUSIC SCROBBLES:" v="No records" />
        )}

        {yearStats.hours != null ? (
          <Row k="ACOUSTIC TIME:" v={`${num(yearStats.hours)} HOURS`} />
        ) : (
          <Row k="ACOUSTIC TIME:" v="No records" />
        )}

        {yearStats.salary != null ? (
          <Row k="SALARY INFLOW:" v={`₹${num(yearStats.salary)}`} />
        ) : (
          <Row k="SALARY INFLOW:" v="No records" />
        )}

        {yearStats.totalSpend != null ? (
          <Row
            k="OUTFLOW SPEND:"
            v={`₹${num(Math.round(yearStats.totalSpend))}`}
          />
        ) : (
          <Row k="OUTFLOW SPEND:" v="No records" />
        )}

        {yearStats.investmentsCount > 0 ? (
          <Row
            k="INVESTMENTS:"
            v={
              yearStats.investmentsTotal
                ? `₹${num(yearStats.investmentsTotal)} (${yearStats.investmentsCount})`
                : `${yearStats.investmentsCount} MOVES`
            }
          />
        ) : (
          <Row k="INVESTMENTS:" v="No records" />
        )}

        {yearStats.subscriptionsCount > 0 ? (
          <Row
            k="SUBSCRIPTIONS:"
            v={`${yearStats.subscriptionsCount} ACTIVE`}
          />
        ) : (
          <Row k="SUBSCRIPTIONS:" v="No records" />
        )}

        {yearStats.busiestMonth && (
          <Row k="PEAK MONTH:" v={yearStats.busiestMonth} />
        )}

        <Dash />
        <Row k="SUBTOTAL (LOGS):" v={`${yearStats.events.length} EVENTS`} />

        <div className="mt-3 flex items-center justify-between border-2 border-ink bg-sun px-3 py-1.5 font-bold">
          <span className="font-display text-sm">TOTAL:</span>
          <span className="text-xs">
            {yearStats.totalSpend
              ? `₹${num(Math.round(yearStats.totalSpend))} spent`
              : yearStats.plays
                ? `${num(yearStats.plays)} plays`
                : '0 items'}
          </span>
        </div>

        <div className="mt-4 h-9" style={{ background: BARCODE_GRADIENT }} />
        <div className="mt-1 text-center text-[12px] font-bold tracking-widest">
          *POS-{yearStats.year}-AUDITED*
        </div>
      </div>
    </div>
  )
}

Receipt.propTypes = {
  yearStats: PropTypes.shape({
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dateRange: PropTypes.string,
    plays: PropTypes.number,
    hours: PropTypes.number,
    purchases: PropTypes.number,
    salary: PropTypes.number,
    totalSpend: PropTypes.number,
    investmentsCount: PropTypes.number,
    investmentsTotal: PropTypes.number,
    subscriptionsCount: PropTypes.number,
    busiestMonth: PropTypes.string,
    events: PropTypes.array,
    topArtist: PropTypes.shape({
      artist: PropTypes.string,
      plays: PropTypes.number,
    }),
  }),
}
