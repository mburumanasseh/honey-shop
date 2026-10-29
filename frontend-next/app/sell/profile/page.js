'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { updateMyProfile } from '../../../lib/clientApi'

export default function SellProfilePage() {
  const { currentUser, refreshUser } = useAuth()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    farm_name: '',
    county: '',
    mpesa_number: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!currentUser) return
    setForm({
      name: currentUser.name || '',
      phone: currentUser.phone || '',
      farm_name: currentUser.farm_name || '',
      county: currentUser.county || '',
      mpesa_number: currentUser.mpesa_number || '',
    })
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      await updateMyProfile({
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        farm_name: form.farm_name.trim() || null,
        county: form.county.trim() || null,
        mpesa_number: form.mpesa_number.trim() || null,
      })
      await refreshUser()
      setSuccess('Profile saved.')
    } catch (err) {
      setError(err.message || 'Could not save profile')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="sell-page">
      <header className="sell-page__header">
        <span className="page-eyebrow">Seller profile</span>
        <h1>Your farm details</h1>
        <p className="muted">
          Keep your contact and M-Pesa details up to date so Mercy Gold can pay
          you after delivery.
        </p>
      </header>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="sell-banner sell-banner--ok" role="status">
          {success}
        </p>
      )}

      <form className="form sell-card" onSubmit={handleSubmit}>
        <div className="sell-form-grid">
          <label>
            Your name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Farm / business name
            <input name="farm_name" value={form.farm_name} onChange={handleChange} />
          </label>
          <label>
            Email
            <input value={currentUser?.email || ''} disabled readOnly />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            County
            <input name="county" value={form.county} onChange={handleChange} />
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
        </div>
        <p className="muted">
          Seller status:{' '}
          <strong>
            {currentUser?.seller_active === false ? 'Inactive' : 'Active'}
          </strong>
        </p>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}
