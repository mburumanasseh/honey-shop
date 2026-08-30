import { apiRequest } from './api'

export function normalizeProduct(product) {
  if (!product) return product
  return {
    ...product,
    price: Number(product.price),
    image: product.image_url || product.image || '',
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
