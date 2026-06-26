import { useEffect, useRef, useState } from 'react'

export function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const startedAtRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const start = () => {
    if (!startedAtRef.current) startedAtRef.current = new Date().toISOString()
    setRunning(true)
  }

  const pause = () => setRunning(false)

  const reset = () => {
    setRunning(false)
    setSeconds(0)
    startedAtRef.current = null
  }

  return { seconds, running, start, pause, reset, startedAt: startedAtRef }
}
