import { apiRequest, getApiUrl } from './api'

export function normalizeProduct(product) {
  if (!product) return product
  let image = product.image_url || product.image || ''
  if (image.startsWith('/src/')) {
    image = '/honeyjar.jpg'
  }
  return {
    ...product,
    price: Number(product.price),
    image,
    stock: product.stock ?? 0,
    is_active: product.is_active !== false,
  }
}

export async function listProducts(options = {}) {
  const params = new URLSearchParams()
  if (options.includeInactive) params.set('include_inactive', 'true')
  if (options.limit) params.set('limit', String(options.limit))
  const qs = params.toString()
  const products = await apiRequest(`/api/v1/products${qs ? `?${qs}` : ''}`)
  return (products || []).map(normalizeProduct)
}

export async function getProduct(id) {
  const product = await apiRequest(`/api/v1/products/${id}`)
  return normalizeProduct(product)
}

export async function createProduct(payload) {
  const product = await apiRequest('/api/v1/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return normalizeProduct(product)
}

export async function updateProduct(id, payload) {
  const product = await apiRequest(`/api/v1/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return normalizeProduct(product)
}

export async function deleteProduct(id) {
  return apiRequest(`/api/v1/products/${id}`, {
    method: 'DELETE',
  })
}

export async function uploadProductImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch(`${getApiUrl()}/api/v1/uploads/image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  let data = null
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  }
  if (!response.ok) {
    const message =
      (typeof data?.detail === 'string' && data.detail) ||
      data?.message ||
      'Image upload failed'
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  return data
}
