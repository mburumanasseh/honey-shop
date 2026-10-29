'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { IconEye, IconEyeOff } from '../../components/Icons'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.role === 'farmer') {
      router.push('/sell/register')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!acceptedTerms) {
      setError('Please accept the Terms and Conditions to continue.')
      return
    }
    setSubmitting(true)
    const result = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      password: form.password,
      role: 'customer',
      accepted_terms: true,
    })
    setSubmitting(false)
    if (!result.success) {
      setError(result.message)
      return
    }
    router.push('/account')
  }

  return (
    <div className="container page auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="page-eyebrow">Join Us</span>
          <h1>Create account</h1>
          <p className="muted">
            Choose whether you are a customer or a farmer. Seller tools are only
            available to verified farmer accounts.
          </p>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <form className="form" onSubmit={handleSubmit}>
          <fieldset className="role-choice">
            <legend>I am a…</legend>
            <label className="role-choice__option">
              <input
                type="radio"
                name="role"
                value="customer"
                checked={form.role === 'customer'}
                onChange={handleChange}
              />
              <span>
                <strong>Customer</strong>
                <span className="muted"> — browse and order farm products</span>
              </span>
            </label>
            <label className="role-choice__option">
              <input
                type="radio"
                name="role"
                value="farmer"
                checked={form.role === 'farmer'}
                onChange={handleChange}
              />
              <span>
                <strong>Farmer / seller</strong>
                <span className="muted">
                  {' '}
                  — list products (admin verification required)
                </span>
              </span>
            </label>
          </fieldset>

          {form.role === 'farmer' ? (
            <p className="muted">
              Farmer signup collects farm location and goods you want to sell.
              Continue on the seller form.
            </p>
          ) : (
            <>
              <label>
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Phone
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  placeholder="07XX XXX XXX"
                />
              </label>
              <label>
                Password
                <div className="password-wrap">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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
              <label>
                Confirm password
                <div className="password-wrap">
                  <input
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </label>
            </>
          )}

          <label className="terms-check">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" target="_blank">
                Terms and Conditions
              </Link>
              , including processing of my information for verification,
              security, and improving Mercy Gold services under Kenyan law.
            </span>
          </label>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {form.role === 'farmer'
              ? 'Continue to farmer registration'
              : submitting
                ? 'Creating…'
                : 'Create account'}
          </button>
        </form>
        <p className="auth-card__footer muted">
          Already have an account? <Link href="/login">Login</Link>
          <br />
          Farmers can also go directly to{' '}
          <Link href="/sell/register">seller registration</Link>.
        </p>
      </div>
    </div>
  )
}
