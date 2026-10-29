const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
).replace(/\/$/, '')

export function getApiUrl() {
  return API_URL
}

/** Server components: no cookies */
export async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    next: options.next ?? { revalidate: 60 },
  })
  if (!res.ok) {
    let message = `API ${res.status}`
    try {
      const data = await res.json()
      if (typeof data?.detail === 'string') message = data.detail
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }
  return res.json()
}

export async function listProducts(params = {}) {
  const qs = new URLSearchParams()
  if (params.category) qs.set('category', params.category)
  if (params.seller_id != null) qs.set('seller_id', String(params.seller_id))
  const q = qs.toString()
  return apiFetch(`/api/v1/products${q ? `?${q}` : ''}`)
}

export async function getProduct(id) {
  return apiFetch(`/api/v1/products/${id}`)
}

function normalizeImage(product) {
  if (!product) return product
  let image = product.image_url || product.image || ''
  if (image.startsWith('/src/')) image = '/honeyjar.jpg'
  return {
    ...product,
    price: Number(product.price),
    image: image || '/honeyjar.jpg',
    stock: product.stock ?? 0,
    is_active: product.is_active !== false,
    category: product.category || 'honey',
    seller_id: product.seller_id ?? null,
  }
}

export function normalizeProduct(product) {
  return normalizeImage(product)
}
