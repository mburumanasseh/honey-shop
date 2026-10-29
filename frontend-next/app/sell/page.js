'use client'

import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

export default function SellDashboardPage() {
  const { currentUser } = useAuth()
  const name = currentUser?.farm_name || currentUser?.name || 'Farmer'
  const canList = currentUser?.seller_active !== false

  return (
    <div className="sell-page">
      <header className="sell-page__header">
        <span className="page-eyebrow">Seller console</span>
        <h1>Welcome, {name}</h1>
        <p className="muted">
          List farm products on Mercy Gold. We handle checkout and only release
          payment after delivery is confirmed.
        </p>
      </header>

      <div className="sell-stat-grid">
        <div className="sell-stat">
          <span className="sell-stat__label">Account</span>
          <strong>{canList ? 'Active' : 'Inactive'}</strong>
        </div>
        <div className="sell-stat">
          <span className="sell-stat__label">Role</span>
          <strong>Farmer</strong>
        </div>
        <div className="sell-stat">
          <span className="sell-stat__label">County</span>
          <strong>{currentUser?.county || '—'}</strong>
        </div>
      </div>

      <div className="sell-actions">
        <Link
          href="/sell/products"
          className={`btn-primary${canList ? '' : ' is-disabled'}`}
          aria-disabled={!canList}
        >
          Manage products
        </Link>
        <Link href="/sell/orders" className="btn-secondary">
          View orders
        </Link>
        <Link href="/sell/profile" className="btn-secondary">
          Edit profile
        </Link>
      </div>

      <section className="sell-card">
        <h2>Getting started</h2>
        <ol className="sell-steps">
          <li>Complete your farm profile (name, county, M-Pesa).</li>
          <li>Add products — they stay <strong>pending</strong> until Mercy Gold approves them.</li>
          <li>When a customer buys, we collect payment and notify you to deliver.</li>
          <li>After delivery is confirmed, you get paid.</li>
        </ol>
      </section>
    </div>
  )
}
