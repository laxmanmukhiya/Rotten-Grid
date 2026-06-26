import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useStudySessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*, subjects(name, color)')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
    if (!error) setSessions(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const addSession = async ({ subjectId, durationSeconds, startedAt }) => {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: user.id,
        subject_id: subjectId || null,
        duration_seconds: durationSeconds,
        started_at: startedAt,
        ended_at: new Date().toISOString(),
      })
      .select('*, subjects(name, color)')
      .single()
    if (!error) setSessions((prev) => [data, ...prev])
    return { data, error }
  }

  const totalSeconds = sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0)

  return { sessions, loading, addSession, totalSeconds, refetch: fetchSessions }
}
