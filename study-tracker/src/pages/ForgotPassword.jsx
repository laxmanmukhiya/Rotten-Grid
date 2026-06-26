import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthShell } from './Login'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a link to reset it."
    >
      {sent ? (
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Check your inbox for a password reset link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            Send reset link
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-zinc-500">
        <Link to="/login" className="font-medium text-zinc-900 dark:text-zinc-100">
          Back to login
        </Link>
      </p>
    </AuthShell>
  )
}
