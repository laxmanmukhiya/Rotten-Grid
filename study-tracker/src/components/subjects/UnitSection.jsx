import { useState } from 'react'
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'
import TopicRow from './TopicRow'

export default function UnitSection({ unit, color, onAddTopic, onUpdateTopic, onDeleteTopic, onDeleteUnit }) {
  const [open, setOpen] = useState(true)
  const [newTopic, setNewTopic] = useState('')

  const topics = unit.topics || []
  const completed = topics.filter((t) => t.completed).length
  const pct = topics.length ? (completed / topics.length) * 100 : 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newTopic.trim()) return
    onAddTopic(unit.id, { name: newTopic, completed: false, estimated_minutes: 30, notes: '' })
    setNewTopic('')
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 text-left">
          {open ? <FiChevronUp size={16} className="text-zinc-400" /> : <FiChevronDown size={16} className="text-zinc-400" />}
          <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{unit.name}</h4>
          <span className="text-xs text-zinc-400">
            {completed}/{topics.length}
          </span>
        </button>
        <button onClick={onDeleteUnit} className="text-zinc-400 hover:text-red-500">
          <FiTrash2 size={14} />
        </button>
      </div>

      <div className="mt-2">
        <ProgressBar value={pct} color={color} height={5} />
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-2">
          {topics.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              onUpdate={(updates) => onUpdateTopic(unit.id, topic.id, updates)}
              onDelete={() => onDeleteTopic(unit.id, topic.id)}
            />
          ))}

          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add a topic..."
              className="flex-1 rounded-lg border border-dashed border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700"
            />
            <button
              type="submit"
              className="rounded-lg bg-zinc-100 px-3 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <FiPlus size={16} />
            </button>
          </form>
        </div>
      )}
    </Card>
  )
}
