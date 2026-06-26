import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiLayers } from 'react-icons/fi'
import { format, parseISO } from 'date-fns'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import EmptyState from '../components/ui/EmptyState'
import { PageLoader } from '../components/ui/Spinner'
import UnitSection from '../components/subjects/UnitSection'
import { useSubjects } from '../hooks/useSubjects'
import { useSyllabus } from '../hooks/useSyllabus'

export default function SubjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { subjects, loading: subjectsLoading } = useSubjects()
  const { units, loading: unitsLoading, addUnit, deleteUnit, addTopic, updateTopic, deleteTopic } = useSyllabus(id)
  const [newUnit, setNewUnit] = useState('')

  const subject = subjects.find((s) => s.id === id)

  const { completed, total, pct } = useMemo(() => {
    let completed = 0
    let total = 0
    units.forEach((u) =>
      u.topics?.forEach((t) => {
        total += 1
        if (t.completed) completed += 1
      })
    )
    return { completed, total, pct: total ? (completed / total) * 100 : 0 }
  }, [units])

  const handleAddUnit = (e) => {
    e.preventDefault()
    if (!newUnit.trim()) return
    addUnit(newUnit)
    setNewUnit('')
  }

  if (subjectsLoading || unitsLoading) return <PageLoader />

  if (!subject) {
    return (
      <EmptyState
        title="Subject not found"
        action={<Button onClick={() => navigate('/subjects')}>Back to subjects</Button>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => navigate('/subjects')}
        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <FiArrowLeft size={14} /> Back to subjects
      </button>

      <div className="flex items-center gap-3">
        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: subject.color }} />
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{subject.name}</h2>
        {subject.exam_date && (
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800">
            Exam: {format(parseISO(subject.exam_date), 'MMM d, yyyy')}
          </span>
        )}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Syllabus progress</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{pct.toFixed(0)}%</p>
          </div>
          <div className="text-right text-sm text-zinc-500">
            <p>{completed} completed</p>
            <p>{total - completed} remaining</p>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={pct} color={subject.color} />
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        {units.length === 0 ? (
          <EmptyState
            icon={<FiLayers size={20} />}
            title="No units yet"
            description="Add a unit to start breaking down your syllabus."
          />
        ) : (
          units.map((unit) => (
            <UnitSection
              key={unit.id}
              unit={unit}
              color={subject.color}
              onAddTopic={addTopic}
              onUpdateTopic={updateTopic}
              onDeleteTopic={deleteTopic}
              onDeleteUnit={() => {
                if (confirm('Delete this unit and all its topics?')) deleteUnit(unit.id)
              }}
            />
          ))
        )}

        <form onSubmit={handleAddUnit} className="flex gap-2">
          <input
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            placeholder="Add a new unit..."
            className="flex-1 rounded-xl border border-dashed border-zinc-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700"
          />
          <Button type="submit" icon={<FiPlus size={16} />}>
            Add Unit
          </Button>
        </form>
      </div>
    </div>
  )
}
