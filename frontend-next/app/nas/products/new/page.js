'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createProduct, uploadProductImage } from '../../../../lib/clientApi'

export default function NasAddProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    description: '',
    size: '',
    price: '',
    stock: '',
    image_url: '',
    is_active: true,
  })
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.price || Number(form.price) <= 0) {
      setError('Name and a valid price are required.')
      return
    }
    setSubmitting(true)
    try {
      let imageUrl = form.image_url.trim() || null
      if (file) {
        const uploaded = await uploadProductImage(file)
        imageUrl = uploaded.url
      }
      await createProduct({
        name: form.name.trim(),
        description: form.description.trim() || null,
        size: form.size.trim() || null,
        price: Number(form.price),
        stock: Number(form.stock || 0),
        image_url: imageUrl,
        is_active: Boolean(form.is_active),
      })
      router.push('/nas/products')
    } catch (err) {
      setError(err.message || 'Could not create product')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="nas-page">
      <Link href="/nas/products" className="nas-back">
        ← Products
      </Link>
      <h1>Add product</h1>
      {error && <p className="nas-error" role="alert">{error}</p>}
      <form className="nas-form" onSubmit={onSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={onChange} required />
        </label>
        <label>
          Description
          <textarea name="description" rows={3} value={form.description} onChange={onChange} />
        </label>
        <label>
          Size
          <input name="size" placeholder="e.g. 500g" value={form.size} onChange={onChange} />
        </label>
        <label>
          Price (KSh)
          <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} required />
        </label>
        <label>
          Stock
          <input name="stock" type="number" min="0" value={form.stock} onChange={onChange} />
        </label>
        <label>
          Image upload
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <label>
          Or image URL
          <input name="image_url" value={form.image_url} onChange={onChange} />
        </label>
        <label className="nas-check">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={onChange}
          />
          Active on storefront
        </label>
        <button type="submit" className="nas-btn" disabled={submitting}>
          {submitting ? 'Saving…' : 'Create product'}
        </button>
      </form>
    </div>
  )
}
