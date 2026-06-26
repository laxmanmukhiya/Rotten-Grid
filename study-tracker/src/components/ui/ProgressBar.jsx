export default function ProgressBar({ value = 0, color = '#6366f1', height = 8, showLabel = false }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className="w-full">
      <div
        className="w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs text-zinc-500 dark:text-zinc-400">
          {pct.toFixed(0)}%
        </div>
      )}
    </div>
  )
}
