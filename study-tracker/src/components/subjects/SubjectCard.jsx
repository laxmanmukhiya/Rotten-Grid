import { FiMoreVertical, FiCalendar } from 'react-icons/fi'
import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'

export default function SubjectCard({ subject, onClick, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const topics = subject.units?.flatMap((u) => u.topics || []) || []
  const completed = topics.filter((t) => t.completed).length
  const total = topics.length
  const pct = total ? (completed / total) * 100 : 0

  return (
    <Card
      onClick={onClick}
      className="group relative cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{subject.name}</h3>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((o) => !o)
            }}
            className="rounded-lg p-1 text-zinc-400 opacity-0 hover:bg-zinc-100 group-hover:opacity-100 dark:hover:bg-zinc-800"
          >
            <FiMoreVertical size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false) }} />
              <div className="absolute right-0 z-20 mt-1 w-32 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit() }}
                  className="block w-full rounded-md px-3 py-1.5 text-left text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete() }}
                  className="block w-full rounded-md px-3 py-1.5 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {subject.exam_date && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
          <FiCalendar size={12} />
          {format(parseISO(subject.exam_date), 'MMM d, yyyy')}
        </div>
      )}

      <div className="mt-4">
        <ProgressBar value={pct} color={subject.color} height={6} />
        <p className="mt-1.5 text-xs text-zinc-400">
          {completed}/{total} topics completed
        </p>
      </div>
    </Card>
  )
}
