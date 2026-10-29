'use client'

import { useCallback, useEffect, useState } from 'react'
import { listSellerOrders } from '../../../lib/clientApi'

export default function SellOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const data = await listSellerOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Could not load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="sell-page">
      <header className="sell-page__header">
        <span className="page-eyebrow">Fulfillment</span>
        <h1>Orders</h1>
        <p className="muted">
          Orders that include your products. Mercy Gold collects payment and pays
          you after delivery is confirmed.
        </p>
      </header>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="muted">Loading orders…</p>}

      {!loading && orders.length === 0 && (
        <div className="sell-card">
          <p className="muted">No orders for your products yet.</p>
        </div>
      )}

      {!loading &&
        orders.map((o) => (
          <article key={o.order_id} className="sell-card sell-order">
            <div className="sell-order__head">
              <div>
                <strong>Order #{o.order_id}</strong>
                <span className="muted">
                  {' '}
                  · {o.created_at ? new Date(o.created_at).toLocaleString() : ''}
                </span>
              </div>
              <span className="sell-badge sell-badge--pending">{o.status}</span>
            </div>
            <p className="muted">
              Ship to: {o.shipping_name} · {o.shipping_phone}
              <br />
              {o.shipping_address}
            </p>
            <ul className="sell-order__items">
              {o.my_items?.map((item) => (
                <li key={item.id}>
                  {item.quantity}× {item.product_name} — KSh{' '}
                  {Number(item.line_total).toLocaleString()}
                </li>
              ))}
            </ul>
            <p>
              <strong>Your subtotal:</strong> KSh{' '}
              {Number(o.my_subtotal).toLocaleString()}
            </p>
          </article>
        ))}
    </div>
  )
}
