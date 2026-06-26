import { useState } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { FiPlus, FiTrash2, FiChevronLeft, FiChevronRight, FiCheckSquare } from 'react-icons/fi'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { PageLoader } from '../components/ui/Spinner'
import { useDailyTasks } from '../hooks/useDailyTasks'
import { useSubjects } from '../hooks/useSubjects'

export default function Planner() {
  const [date, setDate] = useState(new Date())
  const dateKey = format(date, 'yyyy-MM-dd')
  const { tasks, loading, addTask, toggleTask, deleteTask } = useDailyTasks(dateKey)
  const { subjects } = useSubjects()
  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await addTask({ title, due_date: dateKey, task_type: 'task', subject_id: subjectId || null, completed: false })
    setTitle('')
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Daily Planner</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Plan and track what you'll study today.</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setDate((d) => subDays(d, 1))} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <FiChevronLeft size={18} />
          </button>
          <span className="px-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {format(date, 'EEE, MMM d')}
          </span>
          <button onClick={() => setDate((d) => addDays(d, 1))} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      <Card className="p-5">
        <form onSubmit={handleAdd} className="mb-5 flex flex-col gap-2 sm:flex-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Study SQL, Revise Unit 2, Solve PYQs"
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          />
          {subjects.length > 0 && (
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="">No subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}
          <Button type="submit" icon={<FiPlus size={16} />}>
            Add Task
          </Button>
        </form>

        {loading ? (
          <PageLoader />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<FiCheckSquare size={20} />}
            title="No tasks for this day"
            description="Add a task above to get started."
          />
        ) : (
          <>
            <div className="mb-3 text-sm text-zinc-400">
              {completedCount} of {tasks.length} completed
            </div>
            <ul className="flex flex-col gap-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => toggleTask(task.id, e.target.checked)}
                      className="h-4 w-4 rounded accent-zinc-900 dark:accent-white"
                    />
                    <div>
                      <p className={`text-sm ${task.completed ? 'text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {task.title}
                      </p>
                      {task.subjects && (
                        <p className="text-xs text-zinc-400">{task.subjects.name}</p>
                      )}
                    </div>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="text-zinc-400 hover:text-red-500">
                    <FiTrash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  )
}
