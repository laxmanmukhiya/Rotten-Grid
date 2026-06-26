import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// task_type: 'task' | 'study' | 'revision'
export function useDailyTasks(date) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    let query = supabase.from('daily_tasks').select('*, subjects(name, color)').eq('user_id', user.id)
    if (date) query = query.eq('due_date', date)
    const { data, error } = await query.order('created_at', { ascending: true })
    if (!error) setTasks(data || [])
    setLoading(false)
  }, [user, date])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = async (task) => {
    const { data, error } = await supabase
      .from('daily_tasks')
      .insert({ ...task, user_id: user.id })
      .select('*, subjects(name, color)')
      .single()
    if (!error) setTasks((prev) => [...prev, data])
    return { data, error }
  }

  const toggleTask = async (id, completed) => {
    const { data, error } = await supabase
      .from('daily_tasks')
      .update({ completed })
      .eq('id', id)
      .select('*, subjects(name, color)')
      .single()
    if (!error) setTasks((prev) => prev.map((t) => (t.id === id ? data : t)))
    return { data, error }
  }

  const deleteTask = async (id) => {
    const { error } = await supabase.from('daily_tasks').delete().eq('id', id)
    if (!error) setTasks((prev) => prev.filter((t) => t.id !== id))
    return { error }
  }

  return { tasks, loading, addTask, toggleTask, deleteTask, refetch: fetchTasks }
}
