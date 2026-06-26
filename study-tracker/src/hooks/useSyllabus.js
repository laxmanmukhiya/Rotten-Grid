import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSyllabus(subjectId) {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUnits = useCallback(async () => {
    if (!subjectId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('units')
      .select('*, topics(*)')
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: true })
    if (error) setError(error.message)
    else setUnits(data || [])
    setLoading(false)
  }, [subjectId])

  useEffect(() => {
    fetchUnits()
  }, [fetchUnits])

  const addUnit = async (name) => {
    const { data, error } = await supabase
      .from('units')
      .insert({ subject_id: subjectId, name })
      .select()
      .single()
    if (!error) setUnits((prev) => [...prev, { ...data, topics: [] }])
    return { data, error }
  }

  const deleteUnit = async (unitId) => {
    const { error } = await supabase.from('units').delete().eq('id', unitId)
    if (!error) setUnits((prev) => prev.filter((u) => u.id !== unitId))
    return { error }
  }

  const addTopic = async (unitId, topic) => {
    const { data, error } = await supabase
      .from('topics')
      .insert({ unit_id: unitId, ...topic })
      .select()
      .single()
    if (!error)
      setUnits((prev) =>
        prev.map((u) => (u.id === unitId ? { ...u, topics: [...u.topics, data] } : u))
      )
    return { data, error }
  }

  const updateTopic = async (unitId, topicId, updates) => {
    const { data, error } = await supabase
      .from('topics')
      .update(updates)
      .eq('id', topicId)
      .select()
      .single()
    if (!error)
      setUnits((prev) =>
        prev.map((u) =>
          u.id === unitId
            ? { ...u, topics: u.topics.map((t) => (t.id === topicId ? data : t)) }
            : u
        )
      )
    return { data, error }
  }

  const deleteTopic = async (unitId, topicId) => {
    const { error } = await supabase.from('topics').delete().eq('id', topicId)
    if (!error)
      setUnits((prev) =>
        prev.map((u) =>
          u.id === unitId ? { ...u, topics: u.topics.filter((t) => t.id !== topicId) } : u
        )
      )
    return { error }
  }

  return { units, loading, error, addUnit, deleteUnit, addTopic, updateTopic, deleteTopic, refetch: fetchUnits }
}
