'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { IconEye, IconEyeOff } from '../../../components/Icons'
import BrandLockup from '../../../components/BrandLockup'

const GOODS_OPTIONS = [
  'Honey',
  'Milk',
  'Eggs',
  'Dairy (yoghurt, cheese, ghee)',
  'Fresh produce',
  'Poultry',
  'Other farm products',
]

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
    farm_location: '',
    goods_to_sell: [],
    goods_other: '',
    mpesa_number: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const toggleGood = (label) => {
    setForm((f) => {
      const has = f.goods_to_sell.includes(label)
      return {
        ...f,
        goods_to_sell: has
          ? f.goods_to_sell.filter((g) => g !== label)
          : [...f.goods_to_sell, label],
      }
    })
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
    if (!form.farm_location.trim()) {
      setError('Please enter your farm or commodity location')
      return
    }
    const goodsParts = [...form.goods_to_sell]
    if (form.goods_other.trim()) goodsParts.push(form.goods_other.trim())
    if (goodsParts.length === 0) {
      setError('Select or describe the goods you want to sell')
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
      farm_location: form.farm_location.trim(),
      goods_to_sell: goodsParts.join(', '),
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
          Tell us where you farm and what you want to sell. Your listings still
          need Mercy Gold approval before they appear in the shop.
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
              Farm / commodity location
              <input
                name="farm_location"
                value={form.farm_location}
                onChange={handleChange}
                placeholder="Market, village, ward, or exact area"
                required
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

          <fieldset className="sell-goods">
            <legend>Goods you want to sell</legend>
            <p className="muted sell-goods__hint">Select all that apply</p>
            <div className="sell-goods__list">
              {GOODS_OPTIONS.map((label) => (
                <label key={label} className="sell-goods__item">
                  <input
                    type="checkbox"
                    checked={form.goods_to_sell.includes(label)}
                    onChange={() => toggleGood(label)}
                  />
                  {label}
                </label>
              ))}
            </div>
            <label>
              Other (optional)
              <input
                name="goods_other"
                value={form.goods_other}
                onChange={handleChange}
                placeholder="Anything not listed above"
              />
            </label>
          </fieldset>

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
