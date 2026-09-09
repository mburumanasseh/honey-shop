import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createProduct, uploadProductImage } from '../../services/productService'
import './AddProduct.css'

function AddProduct() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: '',
    price: '',
    stock: '',
    image_url: '',
    is_active: true,
  })
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!formData.name.trim()) next.name = 'Name is required'
    if (!formData.price || Number(formData.price) <= 0) next.price = 'Enter a valid price'
    if (formData.stock === '' || Number(formData.stock) < 0) next.stock = 'Enter stock (0 or more)'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      let imageUrl = formData.image_url.trim() || null
      if (file) {
        const uploaded = await uploadProductImage(file)
        imageUrl = uploaded.url
      }

      const created = await createProduct({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        size: formData.size.trim() || null,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image_url: imageUrl,
        is_active: Boolean(formData.is_active),
      })
      // Go to list; product id helps confirm it saved
      navigate('/admin/products', { state: { createdId: created?.id } })
    } catch (err) {
      setSubmitError(err.message || 'Could not create product')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-add-product">
      <div className="admin-add-product__header">
        <Link to="/admin/products">← Back to products</Link>
        <h1>Add product</h1>
        <p>Create a new honey product for the storefront.</p>
      </div>

      {submitError && (
        <p className="admin-add-product__error" role="alert">
          {submitError}
        </p>
      )}

      <form className="admin-add-product__form" onSubmit={handleSubmit}>
        <div className="admin-add-product__field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <small>{errors.name}</small>}
        </div>

        <div className="admin-add-product__field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="admin-add-product__field">
          <label htmlFor="size">Size</label>
          <input
            id="size"
            name="size"
            placeholder="e.g. 500g"
            value={formData.size}
            onChange={handleChange}
          />
        </div>

        <div className="admin-add-product__field">
          <label htmlFor="price">Price (KSh)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <small>{errors.price}</small>}
        </div>

        <div className="admin-add-product__field">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
          />
          {errors.stock && <small>{errors.stock}</small>}
        </div>

        <div className="admin-add-product__field">
          <label htmlFor="image_file">Image upload (Cloudinary)</label>
          <input
            id="image_file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="admin-add-product__field">
          <label htmlFor="image_url">Or image URL</label>
          <input
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://res.cloudinary.com/..."
          />
        </div>

        <div className="admin-add-product__field">
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />{' '}
            Active on storefront
          </label>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save product'}
        </button>
      </form>
    </div>
  )
}

export default AddProduct
