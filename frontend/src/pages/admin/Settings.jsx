import { useEffect, useState } from 'react'
import { getStoreSettings, updateStoreSettings } from '../../services/adminService'
import './Settings.css'

function Settings() {
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
    async function load() {
      setLoading(true)
      setError('')
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
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
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
      setError(err.message || 'Could not save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-settings">
        <p>Loading settings…</p>
      </div>
    )
  }

  return (
    <div className="admin-settings">
      <div className="admin-settings__header">
        <h1>Settings</h1>
        <p>Store details saved to the database.</p>
      </div>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit} className="admin-settings__form">
        <label>
          Store name
          <input name="storeName" value={form.storeName} onChange={handleChange} required />
        </label>
        <label>
          Contact email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <label>
          Currency
          <input name="currency" value={form.currency} onChange={handleChange} />
        </label>
        <label>
          Address
          <textarea name="address" rows="3" value={form.address} onChange={handleChange} />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  )
}

export default Settings
