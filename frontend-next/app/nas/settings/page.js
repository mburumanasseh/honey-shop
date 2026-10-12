'use client'

import { useEffect, useState } from 'react'
import { getStoreSettings, updateStoreSettings } from '../../../lib/clientApi'

export default function NasSettingsPage() {
  const [form, setForm] = useState({
    storeName: 'Mercy Gold Honey',
    email: '',
    phone: '',
    currency: 'KES',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getStoreSettings()
        if (!cancelled) {
          setForm({
            storeName: data.store_name || 'Mercy Gold Honey',
            email: data.email || '',
            phone: data.phone || '',
            currency: data.currency || 'KES',
            address: data.address || '',
          })
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load settings')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const data = await updateStoreSettings({
        store_name: form.storeName,
        email: form.email || null,
        phone: form.phone || null,
        currency: form.currency || 'KES',
        address: form.address || null,
      })
      setForm({
        storeName: data.store_name,
        email: data.email || '',
        phone: data.phone || '',
        currency: data.currency || 'KES',
        address: data.address || '',
      })
      setMessage('Settings saved.')
    } catch (err) {
      setError(err.message || 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading settings…</p>

  return (
    <div className="nas-page">
      <div className="nas-page__header">
        <div>
          <span className="nas-eyebrow">Store</span>
          <h1>Settings</h1>
        </div>
      </div>
      {message && <p role="status">{message}</p>}
      {error && <p className="nas-error" role="alert">{error}</p>}
      <form className="nas-form" onSubmit={onSubmit}>
        <label>
          Store name
          <input name="storeName" value={form.storeName} onChange={onChange} required />
        </label>
        <label>
          Contact email
          <input name="email" type="email" value={form.email} onChange={onChange} />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={onChange} />
        </label>
        <label>
          Currency
          <input name="currency" value={form.currency} onChange={onChange} />
        </label>
        <label>
          Address
          <textarea name="address" rows={3} value={form.address} onChange={onChange} />
        </label>
        <button type="submit" className="nas-btn" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  )
}
