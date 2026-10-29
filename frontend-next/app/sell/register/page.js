'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { IconEye, IconEyeOff } from '../../../components/Icons'
import BrandLockup from '../../../components/BrandLockup'

export default function SellRegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    farm_name: '',
    county: '',
    mpesa_number: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setSubmitting(true)
    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      password: form.password,
      role: 'farmer',
      farm_name: form.farm_name || undefined,
      county: form.county || undefined,
      mpesa_number: form.mpesa_number || undefined,
    })
    setSubmitting(false)
    if (!result.success) {
      setError(result.message)
      return
    }
    router.push('/sell')
  }

  return (
    <div className="sell-auth">
      <div className="sell-auth__card sell-auth__card--wide">
        <BrandLockup className="sell-auth__logo" />
        <span className="page-eyebrow">Sell on Mercy Gold</span>
        <h1>Register as a farmer</h1>
        <p className="muted">
          Open signup. Your products will need Mercy Gold approval before they
          appear in the shop.
        </p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <form className="form" onSubmit={handleSubmit}>
          <div className="sell-form-grid">
            <label>
              Your name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Farm / business name
              <input
                name="farm_name"
                value={form.farm_name}
                onChange={handleChange}
                placeholder="e.g. Hillside Apiary"
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} />
            </label>
            <label>
              County
              <input
                name="county"
                value={form.county}
                onChange={handleChange}
                placeholder="e.g. Baringo"
              />
            </label>
            <label>
              M-Pesa number
              <input
                name="mpesa_number"
                value={form.mpesa_number}
                onChange={handleChange}
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
              <input
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create seller account'}
          </button>
        </form>
        <p className="muted sell-auth__foot">
          Already selling? <Link href="/sell/login">Farmer login</Link>
          <br />
          <Link href="/">Back to store</Link>
        </p>
      </div>
    </div>
  )
}
