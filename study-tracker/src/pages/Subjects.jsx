import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiBook } from 'react-icons/fi'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { PageLoader } from '../components/ui/Spinner'
import SubjectCard from '../components/subjects/SubjectCard'
import SubjectFormModal from '../components/subjects/SubjectFormModal'
import { useSubjects } from '../hooks/useSubjects'

export default function Subjects() {
  const navigate = useNavigate()
  const { subjects, loading, addSubject, updateSubject, deleteSubject } = useSubjects()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (subject) => {
    setEditing(subject)
    setModalOpen(true)
  }

  const handleSubmit = (values) => {
    if (editing) return updateSubject(editing.id, values)
    return addSubject(values)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this subject and all its units/topics?')) deleteSubject(id)
  }

  if (loading) return <PageLoader />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Subjects</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Organize your syllabus by subject.</p>
        </div>
        <Button icon={<FiPlus size={16} />} onClick={openCreate}>
          New Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          icon={<FiBook size={20} />}
          title="No subjects yet"
          description="Create your first subject to start tracking your syllabus."
          action={
            <Button size="sm" onClick={openCreate} icon={<FiPlus size={14} />}>
              Add Subject
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <SubjectCard
              key={s.id}
              subject={s}
              onClick={() => navigate(`/subjects/${s.id}`)}
              onEdit={() => openEdit(s)}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </div>
      )}

      <SubjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  )
}
