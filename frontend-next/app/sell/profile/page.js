'use client'

import { useAuth } from '../../../context/AuthContext'

export default function SellProfilePage() {
  const { currentUser } = useAuth()
  return (
    <div className="sell-page">
      <header className="sell-page__header">
        <span className="page-eyebrow">Seller profile</span>
        <h1>Your farm details</h1>
        <p className="muted">Editing will be enabled in a later task.</p>
      </header>
      <div className="sell-card">
        <p>
          <strong>Name:</strong> {currentUser?.name || '—'}
        </p>
        <p>
          <strong>Farm:</strong> {currentUser?.farm_name || '—'}
        </p>
        <p>
          <strong>Email:</strong> {currentUser?.email || '—'}
        </p>
        <p>
          <strong>Phone:</strong> {currentUser?.phone || '—'}
        </p>
        <p>
          <strong>County:</strong> {currentUser?.county || '—'}
        </p>
        <p>
          <strong>M-Pesa:</strong> {currentUser?.mpesa_number || '—'}
        </p>
        <p>
          <strong>Seller status:</strong>{' '}
          {currentUser?.seller_active === false ? 'Inactive' : 'Active'}
        </p>
      </div>
    </div>
  )
}
