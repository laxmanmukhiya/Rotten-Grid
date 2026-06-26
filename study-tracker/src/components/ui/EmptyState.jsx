export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
          {icon}
        </div>
      )}
      <div>
        <p className="font-medium text-zinc-700 dark:text-zinc-300">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
