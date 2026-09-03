import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import './ProtectedAdminRoute.css'

const ADMIN_UNLOCK_KEY = 'honey_shop_admin_unlocked'

function isAdminUnlocked() {
  try {
    return sessionStorage.getItem(ADMIN_UNLOCK_KEY) === '1'
  } catch {
    return false
  }
}

function setAdminUnlocked(value) {
  try {
    if (value) {
      sessionStorage.setItem(ADMIN_UNLOCK_KEY, '1')
    } else {
      sessionStorage.removeItem(ADMIN_UNLOCK_KEY)
    }
  } catch {
    // ignore storage errors
  }
}

/**
 * Admin UI gate: requires password entry and is_admin.
 * Backend APIs remain the real security boundary.
 */
function ProtectedAdminRoute({ children }) {
  const { currentUser, isAuthenticated, loading, login, logout } = useAuth()
  const [unlocked, setUnlocked] = useState(() => isAdminUnlocked())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="admin-gate">
        <div className="admin-gate__card">
          <p>Checking access…</p>
        </div>
      </div>
    )
  }

  const alreadyAdmin = isAuthenticated && currentUser?.is_admin

  // Allow through only after password unlock this browser session
  if (unlocked && alreadyAdmin) {
    return children
  }

  // If unlocked flag is stale (not admin), clear it
  if (unlocked && !alreadyAdmin) {
    setAdminUnlocked(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      // Always verify password (step-up), even if already logged in as customer
      const result = await login(email.trim(), password)

      if (!result.success) {
        setError(result.message || 'Invalid email or password')
        return
      }

      if (!result.user?.is_admin) {
        setError('This account does not have admin access.')
        setAdminUnlocked(false)
        // Do not leave a non-admin session looking like admin access
        await logout()
        return
      }

      setAdminUnlocked(true)
      setUnlocked(true)
      setPassword('')
    } catch (err) {
      setError(err.message || 'Could not verify credentials')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-gate">
      <div className="admin-gate__card">
        <span className="admin-gate__eyebrow">Admin access</span>
        <h1>Enter admin password</h1>
        <p className="admin-gate__hint">
          Sign in with an administrator account to open the dashboard.
        </p>

        {error && (
          <p className="admin-gate__error" role="alert">
            {error}
          </p>
        )}

        <form className="admin-gate__form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Verifying…' : 'Unlock admin'}
          </button>
        </form>

        <p className="admin-gate__footer">
          <Link to="/">← Back to store</Link>
        </p>
      </div>
    </div>
  )
}

export default ProtectedAdminRoute
