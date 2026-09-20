/**
 * Themed neo-brutalist loading fallback shown while a lazy page chunk loads.
 */
export default function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-6 font-mono text-ink">
      <div className="w-full max-w-sm border-[3px] border-ink bg-white p-6 shadow-brut text-center space-y-4">
        <div className="inline-block border-2 border-ink bg-sun px-3 py-1 text-xs font-bold tracking-widest text-ink animate-pulse">
          LOADING ARCHIVE ROLL ///
        </div>
        <div className="my-2 border-t-2 border-dashed border-ink/40" />
        <div className="font-display text-xl font-bold text-ink">
          FEEDING THERMAL PAPER…
        </div>
        <div className="my-2 border-t-2 border-dashed border-ink/40" />
        <div className="flex justify-between text-xs text-ink/70 font-bold">
          <span>STATUS: BUFFERING</span>
          <span>203 DPI</span>
        </div>
      </div>
    </div>
  )
}
