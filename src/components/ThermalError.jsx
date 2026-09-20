import PropTypes from 'prop-types'

/**
 * Neo-brutalist themed error view shown when dataset fetch fails.
 */
export default function ThermalError({ message }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-6 font-mono text-ink">
      <div className="w-full max-w-sm border-[3px] border-ink bg-hot/10 p-6 shadow-brut text-center space-y-4 border-hot">
        <div className="inline-block border-2 border-ink bg-hot px-3 py-1 text-xs font-bold tracking-widest text-ink">
          ⚠️ THERMAL PAPER JAM / ERROR
        </div>
        <div className="my-2 border-t-2 border-dashed border-hot/40" />
        <div className="font-display text-xl font-bold text-ink">
          FEED INTERRUPTED
        </div>
        <p className="text-xs text-ink/80 leading-relaxed">
          {message ||
            'Unable to load dataset files. Please verify stats.json and events.json.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 border-2 border-ink bg-sun px-4 py-2 font-display text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_#111] hover:bg-sun/80"
        >
          RETRY FEED 🔄
        </button>
      </div>
    </div>
  )
}

ThermalError.propTypes = {
  message: PropTypes.string,
}
