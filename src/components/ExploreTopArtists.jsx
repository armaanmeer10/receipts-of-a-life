import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { num } from '../utils/format'

/**
 * Top Artists Exhibit A panel component.
 */
export default function ExploreTopArtists({
  selectedYear,
  artistAudit,
  maxArtistPlays,
  eventCount,
}) {
  return (
    <div className="flex flex-col justify-between border-[3px] border-ink bg-white p-5 shadow-brut">
      <div>
        <div className="mb-4 flex items-center justify-between border-b-[2px] border-ink pb-3">
          <div>
            <div className="text-[12px] font-bold tracking-widest text-ink/75">
              EXHIBIT A // {selectedYear} AUDIT REPORT
            </div>
            <h2 className="font-display text-xl font-bold text-ink">
              TOP ARTISTS AUDIT ({selectedYear})
            </h2>
          </div>
          {selectedYear === 2017 && (
            <span className="border-2 border-ink bg-sun px-2 py-0.5 text-[12px] font-bold text-ink">
              ★ PEAK YEAR
            </span>
          )}
        </div>

        {artistAudit.length > 0 ? (
          <div className="space-y-4">
            {artistAudit.map((item, idx) => {
              const pct = Math.round((item.plays / maxArtistPlays) * 100)
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-ink">
                      {String(idx + 1).padStart(2, '0')}. {item.name}
                    </span>
                    <span className="font-bold text-[#9c0d46]">
                      {num(item.plays)} PLAYS
                    </span>
                  </div>
                  <div className="relative h-6 w-full border-2 border-ink bg-paper p-0.5">
                    <motion.div
                      className="flex h-full items-center border-r-2 border-ink bg-sun px-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.08 }}
                    >
                      {pct > 35 && (
                        <span className="truncate text-[12px] font-bold text-ink">
                          {item.track}
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="my-6 border-2 border-dashed border-ink/40 bg-paper p-6 text-center font-mono">
            <div className="mb-2 text-3xl" aria-hidden="true">
              🎵
            </div>
            <div className="font-display text-sm font-bold text-ink">
              NO ARTIST SCROBBLES RECORDED IN {selectedYear}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t-2 border-dashed border-ink/30 pt-3 text-[12px] font-bold text-ink/75">
        AUDITED LOGS FOR {selectedYear}: {eventCount} EVENTS
      </div>
    </div>
  )
}

ExploreTopArtists.propTypes = {
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  artistAudit: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      plays: PropTypes.number.isRequired,
      track: PropTypes.string,
    })
  ).isRequired,
  maxArtistPlays: PropTypes.number.isRequired,
  eventCount: PropTypes.number.isRequired,
}
