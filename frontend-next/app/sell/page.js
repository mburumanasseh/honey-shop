'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

function SellDashboardInner() {
  const { currentUser } = useAuth()
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get('registered') === '1'
  const name = currentUser?.farm_name || currentUser?.name || 'Farmer'
  const canList = currentUser?.seller_active !== false

  return (
    <div className="sell-page">
      {justRegistered && !canList && (
        <div className="sell-banner sell-banner--warn" role="status">
          Registration received. Your account is <strong>pending verification</strong>.
          Mercy Gold will review your details and contact you. You can explore the
          console, but you cannot list products until you are verified.
        </div>
      )}

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

export default function SellDashboardPage() {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <SellDashboardInner />
    </Suspense>
  )
}
