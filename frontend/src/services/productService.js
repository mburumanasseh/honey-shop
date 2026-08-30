import { apiRequest } from './api'

export function normalizeProduct(product) {
  if (!product) return product
  let image = product.image_url || product.image || ''
  // Legacy seed paths are not valid in production builds
  if (image.startsWith('/src/')) {
    image = '/honeyjar.jpg'
  }
  return {
    ...product,
    price: Number(product.price),
    image,
    stock: product.stock ?? 0,
  }
}

export async function listProducts() {
  const products = await apiRequest('/api/v1/products')
  return (products || []).map(normalizeProduct)
}

export async function getProduct(id) {
  const product = await apiRequest(`/api/v1/products/${id}`)
  return normalizeProduct(product)
}
