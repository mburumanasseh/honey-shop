'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

const UNLOCK_KEY = 'mercy_gold_nas_unlocked'

function isUnlocked() {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === '1'
  } catch {
    return false
  }
}

function setUnlockedFlag(value) {
  try {
    if (value) sessionStorage.setItem(UNLOCK_KEY, '1')
    else sessionStorage.removeItem(UNLOCK_KEY)
  } catch {
    /* ignore */
  }
}

export default function NasGate({ children }) {
  const { currentUser, isAuthenticated, loading, login, logout } = useAuth()
  const [unlocked, setUnlocked] = useState(false)
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setUnlocked(isUnlocked())
    setReady(true)
  }, [])

  const alreadyAdmin = isAuthenticated && Boolean(currentUser?.is_admin)

  useEffect(() => {
    if (unlocked && !loading && !alreadyAdmin) {
      setUnlockedFlag(false)
      setUnlocked(false)
    }
  }, [unlocked, loading, alreadyAdmin])

  if (!ready || loading) {
    return (
      <div className="nas-gate">
        <div className="nas-gate__card">
          <p>Checking access…</p>
        </div>
      </div>
    )
  }

  if (unlocked && alreadyAdmin) {
    return children
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const result = await login(email.trim(), password)
      if (!result.success) {
        setError(result.message || 'Invalid email or password')
        return
      }
      if (!result.user?.is_admin) {
        setError('This account does not have access.')
        setUnlockedFlag(false)
        setUnlocked(false)
        await logout()
        return
      }
      setUnlockedFlag(true)
      setUnlocked(true)
      setPassword('')
    } catch (err) {
      setError(err.message || 'Could not verify credentials')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="nas-gate">
      <div className="nas-gate__card">
        <span className="nas-gate__eyebrow">Private</span>
        <h1>Sign in</h1>
        <p className="nas-gate__hint">
          Enter your credentials to continue.
        </p>
        {error && (
          <p className="nas-gate__error" role="alert">
            {error}
          </p>
        )}
        <form className="nas-gate__form" onSubmit={handleSubmit}>
          <label htmlFor="nas-email">Email</label>
          <input
            id="nas-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="nas-password">Password</label>
          <input
            id="nas-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Verifying…' : 'Continue'}
          </button>
        </form>
        <p className="nas-gate__footer">
          <Link href="/">← Back to store</Link>
        </p>
      </div>
    </div>
  )
}
