import { apiRequest } from './api'

export async function createOrder({
  items,
  shipping_name,
  shipping_phone,
  shipping_address,
  notes,
}) {
  return apiRequest('/api/v1/orders', {
    method: 'POST',
    body: JSON.stringify({
      items,
      shipping_name,
      shipping_phone,
      shipping_address,
      notes,
    }),
  })
}

export async function listMyOrders() {
  return apiRequest('/api/v1/orders')
}

export async function getOrder(id) {
  return apiRequest(`/api/v1/orders/${id}`)
}
