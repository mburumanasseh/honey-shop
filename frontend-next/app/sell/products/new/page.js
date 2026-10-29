'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../context/AuthContext'
import {
  createSellerProduct,
  uploadProductImage,
} from '../../../../lib/clientApi'

const CATEGORIES = [
  { value: 'honey', label: 'Honey' },
  { value: 'milk', label: 'Milk' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'produce', label: 'Produce' },
  { value: 'other', label: 'Other' },
]

export default function NewSellerProductPage() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const canList = currentUser?.seller_active !== false

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    stock: '0',
    category: 'honey',
    image_url: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  if (!canList) {
    return (
      <div className="sell-page">
        <h1>Add product</h1>
        <p className="error">Your seller account is inactive.</p>
        <Link href="/sell/products">← Back to products</Link>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const result = await uploadProductImage(file)
      const url = result.url || result.secure_url
      if (!url) throw new Error('No image URL returned')
      setForm((f) => ({ ...f, image_url: url }))
    } catch (err) {
      setError(err.message || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const price = Number(form.price)
    if (!form.name.trim() || !(price > 0)) {
      setError('Name and a price greater than 0 are required.')
      return
    }
    setSubmitting(true)
    try {
      await createSellerProduct({
        name: form.name.trim(),
        description: form.description.trim() || null,
        price,
        size: form.size.trim() || null,
        stock: Math.max(0, parseInt(form.stock, 10) || 0),
        category: form.category,
        image_url: form.image_url.trim() || null,
      })
      router.push('/sell/products')
    } catch (err) {
      setError(err.message || 'Could not create product')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="sell-page">
      <header className="sell-page__header">
        <span className="page-eyebrow">New listing</span>
        <h1>Add product</h1>
        <p className="muted">
          Submitted as <strong>pending</strong> — visible in the shop after Mercy
          Gold approves it.
        </p>
      </header>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <form className="form sell-card" onSubmit={handleSubmit}>
        <label>
          Product name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
          />
        </label>
        <div className="sell-form-grid">
          <label>
            Price (KSh)
            <input
              name="price"
              type="number"
              min="1"
              step="1"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Size / unit
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="e.g. 500g, 1 litre"
            />
          </label>
          <label>
            Stock
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
            />
          </label>
        </div>
        <label>
          Product image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
        {uploading && <p className="muted">Uploading image…</p>}
        {form.image_url ? (
          <div className="sell-image-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image_url} alt="" />
          </div>
        ) : null}
        <label>
          Or image URL
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://…"
          />
        </label>
        <div className="sell-actions">
          <button type="submit" className="btn-primary" disabled={submitting || uploading}>
            {submitting ? 'Saving…' : 'Submit for approval'}
          </button>
          <Link href="/sell/products" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
