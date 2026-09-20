/**
 * Neo-brutalist themed loading view shown during initial dataset fetch.
 */
export default function ThermalLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-6 font-mono text-ink">
      <div className="w-full max-w-sm border-[3px] border-ink bg-white p-6 shadow-brut text-center space-y-4">
        <div className="inline-block border-2 border-ink bg-sun px-3 py-1 text-xs font-bold tracking-widest text-ink animate-pulse">
          CITIZEN THERMAL PRINT HEAD: INITIALIZING ///
        </div>
        <div className="my-2 border-t-2 border-dashed border-ink/40" />
        <div className="font-display text-xl font-bold text-ink">
          FEEDING ARCHIVE ROLL...
        </div>
        <p className="text-xs text-ink/75 leading-relaxed">
          Parsing 149,860 Spotify scrobbles, 2,461 bank ledger transactions, and
          11 years of digital exhaust.
        </p>
        <div className="my-2 border-t-2 border-dashed border-ink/40" />
        <div className="flex justify-between text-xs text-ink/70 font-bold">
          <span>STATUS: AUDITING</span>
          <span>2013 – 2024</span>
        </div>
      </div>
    </div>
  )
}
