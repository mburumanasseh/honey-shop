'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { IconEye, IconEyeOff } from '../../../components/Icons'
import BrandLockup from '../../../components/BrandLockup'

function SellLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(
    searchParams.get('error') === 'farmer'
      ? 'Please sign in with a farmer account.'
      : '',
  )
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await login(email, password)
    setSubmitting(false)
    if (!result.success) {
      setError(result.message)
      return
    }
    const user = result.user
    if (user?.role !== 'farmer' && !user?.is_admin) {
      setError('This login is for farmers. Customers should use the main login.')
      return
    }
    const next = searchParams.get('next') || '/sell'
    router.push(next)
  }

  return (
    <div className="sell-auth">
      <div className="sell-auth__card">
        <BrandLockup className="sell-auth__logo" />
        <span className="page-eyebrow">Sell on Mercy Gold</span>
        <h1>Farmer login</h1>
        <p className="muted">
          Sign in to manage your listings. Mercy Gold handles checkout and pays
          you after confirmed delivery.
        </p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </label>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className="muted sell-auth__foot">
          New farmer? <Link href="/sell/register">Create a seller account</Link>
          <br />
          <Link href="/login">Customer login</Link> · <Link href="/">Store</Link>
        </p>
      </div>
    </div>
  )
}

export default function SellLoginPage() {
  return (
    <Suspense fallback={<p className="sell-auth">Loading…</p>}>
      <SellLoginForm />
    </Suspense>
  )
}
