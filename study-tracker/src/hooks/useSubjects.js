import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useSubjects() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSubjects = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('subjects')
      .select('*, units(*, topics(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    if (error) setError(error.message)
    else setSubjects(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  const addSubject = async (subject) => {
    const { data, error } = await supabase
      .from('subjects')
      .insert({ ...subject, user_id: user.id })
      .select()
      .single()
    if (!error) setSubjects((prev) => [...prev, { ...data, units: [] }])
    return { data, error }
  }

  const updateSubject = async (id, updates) => {
    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error)
      setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))
    return { data, error }
  }

  const deleteSubject = async (id) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (!error) setSubjects((prev) => prev.filter((s) => s.id !== id))
    return { error }
  }

  return { subjects, loading, error, addSubject, updateSubject, deleteSubject, refetch: fetchSubjects }
}
