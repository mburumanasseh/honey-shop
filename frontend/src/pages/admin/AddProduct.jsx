import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AddProduct.css'

function AddProduct() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    status: 'In Stock',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter a product name.'
    }

    if (!formData.description.trim()) {
      newErrors.description =
        'Please enter a product description.'
    }

    if (!formData.size.trim()) {
      newErrors.size = 'Please enter the product size.'
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price.'
    }

    if (
      formData.stock === '' ||
      Number(formData.stock) < 0
    ) {
      newErrors.stock =
        'Please enter a valid stock quantity.'
    }

    if (!formData.category.trim()) {
      newErrors.category =
        'Please enter a product category.'
    }

    if (!formData.image.trim()) {
      newErrors.image =
        'Please enter an image URL.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    const newProduct = {
      id: Date.now(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      size: formData.size.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category.trim(),
      image: formData.image.trim(),
      status: formData.status,
    }

    console.log('New product:', newProduct)

    alert('Product created successfully.')

    navigate('/admin/products')
  }

  return (
    <div className="admin-add-product">
      <div className="admin-add-product__header">
        <div>
          <span className="admin-add-product__eyebrow">
            Store Management
          </span>

          <h1>Add Product</h1>

          <p>
            Add a new honey product to your store.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="admin-add-product__back"
        >
          ← Back to Products
        </Link>
      </div>

      <form
        className="admin-add-product__form"
        onSubmit={handleSubmit}
      >
        <section className="admin-add-product__card">
          <div className="admin-add-product__card-header">
            <span>Product Information</span>

            <h2>Basic Details</h2>

            <p>
              Enter the information customers will see
              when browsing your product.
            </p>
          </div>

          <div className="admin-add-product__fields">
            <div className="admin-add-product__field admin-add-product__field--full">
              <label htmlFor="name">
                Product Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Pure Mountain Honey"
              />

              {errors.name && (
                <small>{errors.name}</small>
              )}
            </div>

            <div className="admin-add-product__field admin-add-product__field--full">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your honey product..."
                rows="5"
              />

              {errors.description && (
                <small>{errors.description}</small>
              )}
            </div>

            <div className="admin-add-product__field">
              <label htmlFor="size">
                Size
              </label>

              <input
                id="size"
                name="size"
                type="text"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g. 500g"
              />

              {errors.size && (
                <small>{errors.size}</small>
              )}
            </div>

            <div className="admin-add-product__field">
              <label htmlFor="category">
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Natural Honey"
              />

              {errors.category && (
                <small>{errors.category}</small>
              )}
            </div>

            <div className="admin-add-product__field">
              <label htmlFor="price">
                Price (KSh)
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 1500"
              />

              {errors.price && (
                <small>{errors.price}</small>
              )}
            </div>

            <div className="admin-add-product__field">
              <label htmlFor="stock">
                Stock Quantity
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g. 25"
              />

              {errors.stock && (
                <small>{errors.stock}</small>
              )}
            </div>

            <div className="admin-add-product__field admin-add-product__field--full">
              <label htmlFor="image">
                Product Image URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/honey.jpg"
              />

              {errors.image && (
                <small>{errors.image}</small>
              )}
            </div>

            <div className="admin-add-product__field">
              <label htmlFor="status">
                Product Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="In Stock">
                  In Stock
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>
        </section>

        <div className="admin-add-product__actions">
          <Link
            to="/admin/products"
            className="admin-add-product__cancel"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-add-product__submit"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct