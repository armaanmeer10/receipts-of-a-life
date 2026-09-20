import PropTypes from 'prop-types'
import Sticker from './Sticker'
import Receipt from './Receipt'
import { num } from '../utils/format'

/**
 * Thermal Printer Hardware visualizer component with sticker badges and print slot.
 */
export default function Printer({ printKey, yearStats }) {
  if (!yearStats) return null

  return (
    <div className="relative mx-auto w-full max-w-[440px] pt-6">
      <Sticker
        label="MUSIC AUDIT"
        value={
          yearStats.plays != null
            ? `${num(yearStats.plays)} TRACKS`
            : 'No records'
        }
        bg="bg-sun"
        className="-left-2 top-0 sm:-left-6"
        rotate={-5}
        delay={0.3}
      />
      <Sticker
        label="ACOUSTIC SPAN"
        value={
          yearStats.hours != null
            ? `${num(yearStats.hours)} HOURS`
            : 'No records'
        }
        bg="bg-hot"
        className="-right-2 top-24 sm:-right-8"
        rotate={4}
        delay={0.4}
      />
      <Sticker
        label="AUDITED SLIPS"
        value={
          yearStats.purchases != null
            ? `${num(yearStats.purchases)} PURCHASES`
            : 'No records'
        }
        bg="bg-volt"
        textClass="text-white"
        className="-left-2 bottom-10 sm:-left-8"
        rotate={-3}
        delay={0.5}
      />

      <div className="relative z-20 border-[3px] border-ink bg-ink px-3 pb-3 pt-2 text-paper shadow-brut">
        <div className="flex justify-between text-[12px] tracking-widest text-paper">
          <span>PRINT HEAD MK-IV</span>
          <span>
            80MM <span className="font-bold text-mint">● READY</span>
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between border-2 border-sun bg-sun/10 px-2 py-1 text-[12px] font-bold text-sun">
          <span>⚠ ACTIVE AUDIT YEAR: {yearStats.year}</span>
          <span className="opacity-80">203 DPI THERMAL</span>
        </div>
        <div className="mt-2 h-2 border border-paper/30 bg-black" />
      </div>

      <div className="relative z-10 mx-3 overflow-hidden px-2 pb-3">
        <div key={`${printKey}-${yearStats.year}`} className="printing">
          <Receipt yearStats={yearStats} />
        </div>
      </div>
    </div>
  )
}

Printer.propTypes = {
  printKey: PropTypes.number.isRequired,
  yearStats: PropTypes.object,
}
