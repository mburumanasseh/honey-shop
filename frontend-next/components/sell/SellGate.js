'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

const PUBLIC_PATHS = ['/sell/login', '/sell/register']

export default function SellGate({ children }) {
  const { currentUser, loading, isAuthenticated } = useAuth()
  const pathname = usePathname() || ''
  const router = useRouter()
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

  useEffect(() => {
    if (loading || isPublic) return
    if (!isAuthenticated) {
      router.replace(`/sell/login?next=${encodeURIComponent(pathname)}`)
      return
    }
    const role = currentUser?.role
    const isFarmer = role === 'farmer' || currentUser?.is_admin
    if (!isFarmer) {
      router.replace('/sell/login?error=farmer')
    }
  }, [loading, isAuthenticated, currentUser, isPublic, pathname, router])

  if (isPublic) return children

  if (loading) {
    return (
      <div className="sell-gate sell-gate--loading">
        <p>Loading seller console…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="sell-gate sell-gate--loading">
        <p>Redirecting to login…</p>
      </div>
    )
  }

  const role = currentUser?.role
  if (role !== 'farmer' && !currentUser?.is_admin) {
    return (
      <div className="sell-gate sell-gate--denied">
        <h1>Seller access only</h1>
        <p className="muted">
          This area is for Mercy Gold farmers. Customer accounts use{' '}
          <Link href="/account">My account</Link>.
        </p>
        <p>
          <Link href="/sell/register" className="btn-primary">
            Register as a farmer
          </Link>
        </p>
      </div>
    )
  }

  return children
}
