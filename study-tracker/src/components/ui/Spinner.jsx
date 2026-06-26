export default function Spinner({ size = 24, className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-500 dark:border-zinc-700 dark:border-t-zinc-300"
        style={{ width: size, height: size }}
      />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center">
      <Spinner size={32} />
    </div>
  )
}
