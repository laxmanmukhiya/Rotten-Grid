import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

const COLORS = ['#6366f1', '#ef4444', '#22c55e', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6', '#64748b']

export default function SubjectFormModal({ open, onClose, onSubmit, initial }) {
  const [name, setName] = useState(initial?.name || '')
  const [color, setColor] = useState(initial?.color || COLORS[0])
  const [examDate, setExamDate] = useState(initial?.exam_date || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    setError('')
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    const { error } = await onSubmit({ name, color, exam_date: examDate || null })
    setSaving(false)
    if (error) setError(error.message)
    else {
      setName('')
      setExamDate('')
      handleClose()
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={initial ? 'Edit Subject' : 'New Subject'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Subject name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Organic Chemistry" />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                className="h-8 w-8 rounded-full ring-offset-2 transition-transform"
                style={{ backgroundColor: c, outline: color === c ? `2px solid ${c}` : 'none', transform: color === c ? 'scale(1.1)' : 'none' }}
              />
            ))}
          </div>
        </div>

        <Input
          label="Exam date (optional)"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" loading={saving} className="w-full">
          {initial ? 'Save changes' : 'Create subject'}
        </Button>
      </form>
    </Modal>
  )
}
