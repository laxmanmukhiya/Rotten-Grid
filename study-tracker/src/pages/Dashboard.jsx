import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiClock, FiBookOpen, FiCalendar, FiPlay } from 'react-icons/fi'
import { differenceInCalendarDays, format, isToday, parseISO } from 'date-fns'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { PageLoader } from '../components/ui/Spinner'
import { useSubjects } from '../hooks/useSubjects'
import { useExams } from '../hooks/useExams'
import { useDailyTasks } from '../hooks/useDailyTasks'
import { useStudySessions } from '../hooks/useStudySessions'

function StatCard({ icon, label, value, sub }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
          {sub && <p className="mt-1 text-xs text-zinc-400">{sub}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {icon}
        </div>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { subjects, loading: subjectsLoading } = useSubjects()
  const { exams, loading: examsLoading } = useExams()
  const today = format(new Date(), 'yyyy-MM-dd')
  const { tasks, loading: tasksLoading, toggleTask } = useDailyTasks(today)
  const { totalSeconds, loading: sessionsLoading } = useStudySessions()

  const loading = subjectsLoading || examsLoading || tasksLoading || sessionsLoading

  const { completed, total, pct } = useMemo(() => {
    let completed = 0
    let total = 0
    subjects.forEach((s) =>
      s.units?.forEach((u) =>
        u.topics?.forEach((t) => {
          total += 1
          if (t.completed) completed += 1
        })
      )
    )
    return { completed, total, pct: total ? (completed / total) * 100 : 0 }
  }, [subjects])

  const upcomingExams = exams.filter((e) => differenceInCalendarDays(parseISO(e.exam_date), new Date()) >= 0).slice(0, 4)
  const totalHours = (totalSeconds / 3600).toFixed(1)

  if (loading) return <PageLoader />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Welcome back 👋
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Here's where your exam prep stands today.
          </p>
        </div>
        <Button icon={<FiPlay size={16} />} onClick={() => navigate('/timer')}>
          Start Studying
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<FiClock size={18} />} label="Total Study Hours" value={`${totalHours}h`} />
        <StatCard
          icon={<FiBookOpen size={18} />}
          label="Syllabus Completion"
          value={`${pct.toFixed(0)}%`}
          sub={`${completed} / ${total} topics`}
        />
        <StatCard
          icon={<FiCalendar size={18} />}
          label="Upcoming Exams"
          value={upcomingExams.length}
        />
        <StatCard
          icon={<FiBookOpen size={18} />}
          label="Today's Tasks"
          value={`${tasks.filter((t) => t.completed).length}/${tasks.length}`}
        />
      </div>

      <Card className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Overall Syllabus Progress</h3>
          <span className="text-sm text-zinc-500">{pct.toFixed(0)}%</span>
        </div>
        <ProgressBar value={pct} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-medium text-zinc-900 dark:text-zinc-100">Upcoming Exams</h3>
          {upcomingExams.length === 0 ? (
            <EmptyState
              icon={<FiCalendar size={20} />}
              title="No upcoming exams"
              description="Add an exam date from the Calendar page."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {upcomingExams.map((exam) => {
                const days = differenceInCalendarDays(parseISO(exam.exam_date), new Date())
                return (
                  <li key={exam.id} className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: exam.subjects?.color || '#6366f1' }}
                      />
                      <div>
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {exam.title}
                        </p>
                        <p className="text-xs text-zinc-400">{format(parseISO(exam.exam_date), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-zinc-500">
                      {days === 0 ? 'Today' : `${days}d left`}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-medium text-zinc-900 dark:text-zinc-100">Today's Tasks</h3>
          {tasks.length === 0 ? (
            <EmptyState
              icon={<FiBookOpen size={20} />}
              title="No tasks for today"
              description="Add tasks from the Daily Planner."
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => toggleTask(task.id, e.target.checked)}
                    className="h-4 w-4 rounded accent-zinc-900 dark:accent-white"
                  />
                  <span
                    className={`text-sm ${
                      task.completed
                        ? 'text-zinc-400 line-through'
                        : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
