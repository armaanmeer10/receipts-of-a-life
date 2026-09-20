import PropTypes from 'prop-types'
import DonutChart from './DonutChart'
import { num } from '../utils/format'
import { DONUT_COLORS } from '../constants'

/**
 * Purchase Ledger Exhibit B panel component.
 */
export default function ExplorePurchaseLedger({
  selectedYear,
  ledgerBreakdown,
  purchases,
}) {
  return (
    <div className="flex flex-col justify-between border-[3px] border-ink bg-white p-5 shadow-brut">
      <div>
        <div className="mb-4 flex items-center justify-between border-b-[2px] border-ink pb-3">
          <div>
            <div className="text-[12px] font-bold tracking-widest text-ink/75">
              EXHIBIT B // {selectedYear} EXPENSE DISSECTION
            </div>
            <h2 className="font-display text-xl font-bold text-ink">
              PURCHASE LEDGER BREAKDOWN
            </h2>
          </div>
          <span className="border-2 border-ink bg-mint px-2 py-0.5 text-[12px] font-bold text-ink">
            {selectedYear} AUDITED
          </span>
        </div>

        {ledgerBreakdown.total > 0 ? (
          <div className="flex flex-col items-center gap-6 py-2 sm:flex-row sm:items-center sm:justify-around">
            <DonutChart
              data={ledgerBreakdown.categories}
              total={ledgerBreakdown.total}
            />

            <div className="w-full max-w-xs space-y-2">
              {ledgerBreakdown.categories.map((cat, idx) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between border-b border-dashed border-ink/30 pb-1 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 border border-ink"
                      style={{
                        backgroundColor:
                          DONUT_COLORS[idx % DONUT_COLORS.length],
                      }}
                    />
                    <span className="font-bold text-ink">{cat.name}</span>
                  </div>
                  <span className="font-mono font-bold text-ink/80">
                    ₹{num(Math.round(cat.amount))} ({cat.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="my-6 border-2 border-dashed border-ink/40 bg-paper p-6 text-center">
            <div className="mb-2 text-3xl" aria-hidden="true">
              🧾
            </div>
            <div className="font-display text-sm font-bold text-ink">
              NO FINANCIAL RECEIPTS RECORDED IN {selectedYear}
            </div>
            <p className="mt-1 text-xs text-ink/75">
              Bank statements overlap primary window (2015-2018). Music stream
              logs remain active.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 border-t-2 border-dashed border-ink/30 pt-3 text-[12px] font-bold text-ink/75">
        BANK AUDIT WINDOW: 2015 – 2018 /// LEDGER ENTRIES IN {selectedYear}:{' '}
        {purchases != null ? num(purchases) : 'No records'}
      </div>
    </div>
  )
}

ExplorePurchaseLedger.propTypes = {
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  ledgerBreakdown: PropTypes.shape({
    total: PropTypes.number.isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        pct: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  purchases: PropTypes.number,
}
