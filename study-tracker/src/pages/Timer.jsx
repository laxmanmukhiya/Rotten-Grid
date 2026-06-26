import { useState } from 'react'
import { FiPlay, FiPause, FiRotateCcw } from 'react-icons/fi'
import { format, parseISO } from 'date-fns'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { useTimer } from '../hooks/useTimer'
import { useSubjects } from '../hooks/useSubjects'
import { useStudySessions } from '../hooks/useStudySessions'

function formatTime(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function Timer() {
  const { subjects } = useSubjects()
  const { sessions, addSession } = useStudySessions()
  const { seconds, running, start, pause, reset, startedAt } = useTimer()
  const [subjectId, setSubjectId] = useState('')
  const [saving, setSaving] = useState(false)

  const handlePauseAndSave = async () => {
    pause()
    if (seconds > 0 && startedAt.current) {
      setSaving(true)
      await addSession({ subjectId, durationSeconds: seconds, startedAt: startedAt.current })
      setSaving(false)
    }
    reset()
  }

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const progress = (seconds % 3600) / 3600
  const dashoffset = circumference * (1 - progress)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Study Timer</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Track focused study sessions. Stopping the timer automatically saves your session.
        </p>
      </div>

      <Card className="flex flex-col items-center gap-6 p-8">
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          disabled={running}
          className="w-full max-w-xs rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
        >
          <option value="">No subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <div className="relative flex h-56 w-56 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} className="stroke-zinc-100 dark:stroke-zinc-800" strokeWidth="10" fill="none" />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              className="text-zinc-900 dark:text-white transition-all duration-500"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="text-4xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {formatTime(seconds)}
          </span>
        </div>

        <div className="flex gap-3">
          {!running ? (
            <Button size="lg" icon={<FiPlay size={16} />} onClick={start}>
              {seconds > 0 ? 'Resume' : 'Start'}
            </Button>
          ) : (
            <Button size="lg" variant="secondary" icon={<FiPause size={16} />} onClick={handlePauseAndSave} loading={saving}>
              Stop & Save
            </Button>
          )}
          <Button size="lg" variant="ghost" icon={<FiRotateCcw size={16} />} onClick={reset} disabled={running}>
            Reset
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 font-medium text-zinc-900 dark:text-zinc-100">Recent Sessions</h3>
        {sessions.length === 0 ? (
          <EmptyState title="No sessions yet" description="Your saved study sessions will appear here." />
        ) : (
          <ul className="flex flex-col gap-2">
            {sessions.slice(0, 8).map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.subjects?.color || '#a1a1aa' }} />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {s.subjects?.name || 'General study'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {formatTime(s.duration_seconds)}
                  </p>
                  <p className="text-xs text-zinc-400">{format(parseISO(s.started_at), 'MMM d, h:mm a')}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
