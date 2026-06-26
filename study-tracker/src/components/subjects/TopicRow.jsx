import { useState } from 'react'
import { FiTrash2, FiClock } from 'react-icons/fi'

export default function TopicRow({ topic, onUpdate, onDelete }) {
  const [notesOpen, setNotesOpen] = useState(false)
  const [notes, setNotes] = useState(topic.notes || '')

  const saveNotes = () => {
    if (notes !== topic.notes) onUpdate({ notes })
    setNotesOpen(false)
  }

  return (
    <div className="rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/50">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={topic.completed}
          onChange={(e) => onUpdate({ completed: e.target.checked })}
          className="h-4 w-4 shrink-0 rounded accent-zinc-900 dark:accent-white"
        />
        <span
          className={`flex-1 text-sm ${
            topic.completed ? 'text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-300'
          }`}
        >
          {topic.name}
        </span>

        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <FiClock size={12} />
          <input
            type="number"
            min="0"
            value={topic.estimated_minutes ?? ''}
            onChange={(e) => onUpdate({ estimated_minutes: Number(e.target.value) || 0 })}
            className="w-12 rounded-md bg-transparent text-center outline-none"
            placeholder="0"
          />
          <span>min</span>
        </div>

        <button
          onClick={() => setNotesOpen((o) => !o)}
          className="text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          Notes
        </button>

        <button onClick={onDelete} className="text-zinc-400 hover:text-red-500">
          <FiTrash2 size={14} />
        </button>
      </div>

      {notesOpen && (
        <div className="mt-2 pl-7">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveNotes}
            rows={2}
            placeholder="Add notes for this topic..."
            className="w-full rounded-lg border border-zinc-200 bg-white p-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
      )}
    </div>
  )
}
