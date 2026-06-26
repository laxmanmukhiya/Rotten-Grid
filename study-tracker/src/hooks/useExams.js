import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useExams() {
  const { user } = useAuth()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchExams = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('exams')
      .select('*, subjects(name, color)')
      .eq('user_id', user.id)
      .order('exam_date', { ascending: true })
    if (!error) setExams(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  const addExam = async (exam) => {
    const { data, error } = await supabase
      .from('exams')
      .insert({ ...exam, user_id: user.id })
      .select('*, subjects(name, color)')
      .single()
    if (!error) setExams((prev) => [...prev, data].sort((a, b) => a.exam_date.localeCompare(b.exam_date)))
    return { data, error }
  }

  const deleteExam = async (id) => {
    const { error } = await supabase.from('exams').delete().eq('id', id)
    if (!error) setExams((prev) => prev.filter((e) => e.id !== id))
    return { error }
  }

  return { exams, loading, addExam, deleteExam, refetch: fetchExams }
}
