import { useMemo, useState } from 'react'
import { addMonths, subMonths, format } from 'date-fns'
import { FiChevronLeft, FiChevronRight, FiPlus, FiTrash2, FiBookOpen, FiRepeat, FiAward } from 'react-icons/fi'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { PageLoader } from '../components/ui/Spinner'
import CalendarGrid from '../components/calendar/CalendarGrid'
import EventFormModal from '../components/calendar/EventFormModal'
import { useExams } from '../hooks/useExams'
import { useDailyTasks } from '../hooks/useDailyTasks'
import { useSubjects } from '../hooks/useSubjects'

const TYPE_META = {
  exam: { icon: FiAward, label: 'Exam', color: 'text-red-500' },
  study: { icon: FiBookOpen, label: 'Study', color: 'text-indigo-500' },
  revision: { icon: FiRepeat, label: 'Revision', color: 'text-amber-500' },
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)

  const { subjects } = useSubjects()
  const { exams, loading: examsLoading, addExam, deleteExam } = useExams()
  const { tasks, loading: tasksLoading, addTask, deleteTask, toggleTask } = useDailyTasks()

  const loading = examsLoading || tasksLoading

  const eventsByDate = useMemo(() => {
    const map = {}
    exams.forEach((ex) => {
      const key = ex.exam_date
      map[key] = map[key] || []
      map[key].push({ id: `exam-${ex.id}`, color: ex.subjects?.color || '#ef4444' })
    })
    tasks.forEach((t) => {
      const key = t.due_date
      map[key] = map[key] || []
      map[key].push({ id: `task-${t.id}`, color: t.subjects?.color || (t.task_type === 'revision' ? '#f59e0b' : '#6366f1') })
    })
    return map
  }, [exams, tasks])

  const selectedKey = format(selectedDate, 'yyyy-MM-dd')
  const dayExams = exams.filter((e) => e.exam_date === selectedKey)
  const dayTasks = tasks.filter((t) => t.due_date === selectedKey)

  if (loading) return <PageLoader />

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <Card className="flex-1 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
        <CalendarGrid
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          eventsByDate={eventsByDate}
        />
      </Card>

      <Card className="w-full p-5 lg:w-80">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
            {format(selectedDate, 'EEEE, MMM d')}
          </h3>
          <Button size="sm" icon={<FiPlus size={14} />} onClick={() => setModalOpen(true)}>
            Add
          </Button>
        </div>

        {dayExams.length === 0 && dayTasks.length === 0 ? (
          <EmptyState
            icon={<FiBookOpen size={18} />}
            title="Nothing planned"
            description="Add an exam or study task for this day."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {dayExams.map((exam) => {
              const Meta = TYPE_META.exam
              return (
                <li
                  key={`exam-${exam.id}`}
                  className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-2.5">
                    <Meta.icon className={Meta.color} size={16} />
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{exam.title}</p>
                      <p className="text-xs text-zinc-400">Exam{exam.subjects ? ` · ${exam.subjects.name}` : ''}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteExam(exam.id)} className="text-zinc-400 hover:text-red-500">
                    <FiTrash2 size={14} />
                  </button>
                </li>
              )
            })}
            {dayTasks.map((task) => {
              const Meta = TYPE_META[task.task_type] || TYPE_META.study
              return (
                <li
                  key={`task-${task.id}`}
                  className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => toggleTask(task.id, e.target.checked)}
                      className="h-4 w-4 rounded accent-zinc-900 dark:accent-white"
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          task.completed ? 'text-zinc-400 line-through' : 'text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {Meta.label}
                        {task.subjects ? ` · ${task.subjects.name}` : ''}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="text-zinc-400 hover:text-red-500">
                    <FiTrash2 size={14} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <EventFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedKey}
        subjects={subjects}
        onCreateExam={addExam}
        onCreateTask={addTask}
      />
    </div>
  )
}
