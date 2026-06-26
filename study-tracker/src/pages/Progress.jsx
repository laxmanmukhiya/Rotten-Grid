import { useMemo } from 'react'
import { FiClock, FiCheckCircle, FiCircle, FiTrendingUp } from 'react-icons/fi'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import { PageLoader } from '../components/ui/Spinner'
import { useSubjects } from '../hooks/useSubjects'
import { useStudySessions } from '../hooks/useStudySessions'

function StatCard({ icon, label, value }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        {icon}
      </div>
      <div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
      </div>
    </Card>
  )
}

export default function Progress() {
  const { subjects, loading: subjectsLoading } = useSubjects()
  const { totalSeconds, sessions, loading: sessionsLoading } = useStudySessions()

  const subjectStats = useMemo(() => {
    return subjects.map((s) => {
      const topics = s.units?.flatMap((u) => u.topics || []) || []
      const completed = topics.filter((t) => t.completed).length
      const total = topics.length
      const hours = sessions
        .filter((sess) => sess.subject_id === s.id)
        .reduce((acc, sess) => acc + sess.duration_seconds, 0) / 3600
      return { ...s, completed, total, pct: total ? (completed / total) * 100 : 0, hours }
    })
  }, [subjects, sessions])

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

  if (subjectsLoading || sessionsLoading) return <PageLoader />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Progress</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">A complete picture of your exam preparation.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<FiClock size={18} />} label="Total Study Hours" value={`${(totalSeconds / 3600).toFixed(1)}h`} />
        <StatCard icon={<FiCheckCircle size={18} />} label="Completed Topics" value={completed} />
        <StatCard icon={<FiCircle size={18} />} label="Remaining Topics" value={total - completed} />
        <StatCard icon={<FiTrendingUp size={18} />} label="Overall Completion" value={`${pct.toFixed(0)}%`} />
      </div>

      <Card className="p-5">
        <h3 className="mb-4 font-medium text-zinc-900 dark:text-zinc-100">Subject-wise Progress</h3>
        {subjectStats.length === 0 ? (
          <p className="text-sm text-zinc-400">Add subjects to see progress breakdown.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {subjectStats.map((s) => (
              <div key={s.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{s.name}</span>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {s.completed}/{s.total} topics &middot; {s.hours.toFixed(1)}h
                  </span>
                </div>
                <ProgressBar value={s.pct} color={s.color} height={6} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
