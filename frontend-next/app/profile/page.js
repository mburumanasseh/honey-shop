'use client'

import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

export default function ProfilePage() {
  const { currentUser, isAuthenticated, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="account-page">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="account-gate">
        <span className="account-hero__eyebrow">Profile</span>
        <h1>Sign in to view your profile</h1>
        <p>See your name, email, and phone on file.</p>
        <div className="account-hero__actions" style={{ justifyContent: 'center' }}>
          <Link href="/login?next=/profile" className="btn-secondary">
            Log in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="account-page">
      <header className="account-hero">
        <div>
          <span className="account-hero__eyebrow">Profile</span>
          <h1>Your details</h1>
          <p>Information linked to your Mercy Gold account.</p>
        </div>
        <div className="account-hero__actions">
          <Link href="/account" className="btn-ghost">
            Dashboard
          </Link>
          <button type="button" className="btn-ghost" onClick={() => logout()}>
            Log out
          </button>
        </div>
      </header>

      <nav className="account-nav" aria-label="Account">
        <Link href="/account">Dashboard</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/profile" className="active">
          Profile
        </Link>
        <Link href="/track">Track</Link>
      </nav>

      <div className="account-profile-card">
        <dl>
          <div>
            <dt>Name</dt>
            <dd>{currentUser.name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{currentUser.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{currentUser.phone || '—'}</dd>
          </div>
        </dl>
        <p className="muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
          Need a change? Contact us via WhatsApp or email and we&apos;ll update
          your account.
        </p>
        <Link href="/shop" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
