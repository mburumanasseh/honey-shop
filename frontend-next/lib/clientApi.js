'use client'

import { getApiBaseUrl } from './apiBase'

const API_URL = getApiBaseUrl()

let refreshInFlight = null

async function tryRefreshSession() {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Session expired')
        return true
      })
      .finally(() => {
        refreshInFlight = null
      })
  }
  return refreshInFlight
}

export async function apiRequest(path, options = {}, _retried = false) {
  const headers = { ...(options.headers || {}) }
  if (options.body && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  })

  let data = null
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  }

  if (response.status === 401 && !_retried && !path.includes('/auth/')) {
    try {
      await tryRefreshSession()
      return apiRequest(path, options, true)
    } catch {
      /* fall through */
    }
  }

  if (!response.ok) {
    let message = 'Something went wrong'
    if (typeof data?.detail === 'string') message = data.detail
    else if (Array.isArray(data?.detail)) message = data.detail[0]?.msg || message
    else if (data?.message) message = data.message
    if (response.status === 401) message = 'Please log in again.'
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return data
}

export async function loginRequest(email, password) {
  return apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function registerRequest(payload) {
  return apiRequest('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function logoutRequest() {
  try {
    await apiRequest('/api/v1/auth/logout', { method: 'POST' })
  } catch {
    /* ignore */
  }
}

export async function meRequest() {
  return apiRequest('/api/v1/auth/me')
}

export async function createOrder(payload) {
  return apiRequest('/api/v1/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function listMyOrders() {
  return apiRequest('/api/v1/orders')
}

export async function lookupOrder({ order_id, phone }) {
  return apiRequest('/api/v1/orders/lookup', {
    method: 'POST',
    body: JSON.stringify({
      order_id: Number(order_id),
      phone: String(phone || '').trim(),
    }),
  })
}

export async function getProductClient(id) {
  return apiRequest(`/api/v1/products/${id}`)
}

export function getApiUrl() {
  return API_URL
}

export function normalizeProduct(product) {
  if (!product) return product
  let image = product.image_url || product.image || ''
  if (image.startsWith('/src/')) image = '/honeyjar.jpg'
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
  return apiRequest(`/api/v1/products/${id}`, { method: 'DELETE' })
}

export async function uploadProductImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const doUpload = async () => {
    const response = await fetch(`${API_URL}/api/v1/uploads/image`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    let data = null
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    }
    return { response, data }
  }
  let { response, data } = await doUpload()
  if (response.status === 401) {
    try {
      await tryRefreshSession()
      ;({ response, data } = await doUpload())
    } catch {
      /* fall through */
    }
  }
  if (!response.ok) {
    let message =
      (typeof data?.detail === 'string' && data.detail) ||
      data?.message ||
      'Image upload failed'
    if (response.status === 401) message = 'Session expired. Unlock again on /nas.'
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  return data
}

export async function adminListOrders(options = {}) {
  const params = new URLSearchParams()
  if (options.skip != null) params.set('skip', String(options.skip))
  if (options.limit != null) params.set('limit', String(options.limit))
  const qs = params.toString()
  return apiRequest(`/api/v1/admin/orders${qs ? `?${qs}` : ''}`)
}

export async function adminUpdateOrder(id, payload) {
  return apiRequest(`/api/v1/admin/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function listCustomers(options = {}) {
  const params = new URLSearchParams()
  if (options.limit) params.set('limit', String(options.limit))
  if (options.skip) params.set('skip', String(options.skip))
  const qs = params.toString()
  return apiRequest(`/api/v1/admin/customers${qs ? `?${qs}` : ''}`)
}

export async function getStoreSettings() {
  return apiRequest('/api/v1/admin/settings')
}

export async function updateStoreSettings(payload) {
  return apiRequest('/api/v1/admin/settings', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function getAdminPresence() {
  return apiRequest('/api/v1/admin/presence')
}

/* ——— Seller (farmer) products ——— */

export async function listSellerProducts() {
  return apiRequest('/api/v1/seller/products')
}

export async function createSellerProduct(payload) {
  return apiRequest('/api/v1/seller/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateSellerProduct(id, payload) {
  return apiRequest(`/api/v1/seller/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteSellerProduct(id) {
  return apiRequest(`/api/v1/seller/products/${id}`, {
    method: 'DELETE',
  })
}

/* ——— Admin farmers & approvals ——— */

export async function listAdminFarmers() {
  return apiRequest('/api/v1/admin/farmers')
}

export async function setFarmerSellerActive(id, seller_active) {
  return apiRequest(`/api/v1/admin/farmers/${id}/seller-active`, {
    method: 'PATCH',
    body: JSON.stringify({ seller_active }),
  })
}

export async function listProductApprovals(status = 'pending') {
  const q = status ? `?status=${encodeURIComponent(status)}` : ''
  return apiRequest(`/api/v1/admin/product-approvals${q}`)
}

export async function setProductApproval(id, approval_status) {
  return apiRequest(`/api/v1/admin/product-approvals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ approval_status }),
  })
}

export async function listSellerOrders() {
  return apiRequest('/api/v1/seller/orders')
}

export async function updateMyProfile(payload) {
  return apiRequest('/api/v1/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

