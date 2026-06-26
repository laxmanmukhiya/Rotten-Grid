import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

const TYPE_OPTIONS = [
  { value: 'exam', label: 'Exam' },
  { value: 'study', label: 'Study Task' },
  { value: 'revision', label: 'Revision Task' },
]

export default function EventFormModal({ open, onClose, date, subjects, onCreateExam, onCreateTask }) {
  const [type, setType] = useState('study')
  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const reset = () => {
    setType('study')
    setTitle('')
    setSubjectId('')
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError('')
    let result
    if (type === 'exam') {
      result = await onCreateExam({ title, exam_date: date, subject_id: subjectId || null })
    } else {
      result = await onCreateTask({
        title,
        due_date: date,
        task_type: type,
        subject_id: subjectId || null,
        completed: false,
      })
    }
    setSaving(false)
    if (result?.error) setError(result.error.message)
    else handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Add to ${date || ''}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Type
          </label>
          <div className="flex gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  type === opt.value
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={type === 'exam' ? 'Physics Final Exam' : 'Revise Unit 3'}
        />

        {subjects?.length > 0 && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Subject (optional)
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="">No subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" loading={saving} className="w-full">
          Add
        </Button>
      </form>
    </Modal>
  )
}
