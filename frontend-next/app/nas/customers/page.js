'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { listCustomers } from '../../../lib/clientApi'

export default function NasCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setCustomers((await listCustomers({ limit: 200 })) || [])
    } catch (err) {
      setError(err.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return customers
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q),
    )
  }, [customers, search])

  return (
    <div className="nas-page">
      <div className="nas-page__header">
        <div>
          <span className="nas-eyebrow">People</span>
          <h1>Customers</h1>
        </div>
      </div>
      <div className="nas-toolbar">
        <input
          type="search"
          placeholder="Search name, email, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="nas-muted">
          {loading ? 'Loading…' : `${filtered.length} customers`}
        </span>
      </div>
      {error && <p className="nas-error" role="alert">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="nas-table-wrap">
          <table className="nas-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Spent</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.orders_count}</td>
                  <td>
                    KSh {Number(c.total_spent || 0).toLocaleString()}
                  </td>
                  <td>{c.is_admin ? 'Admin' : 'Customer'}</td>
                  <td>
                    {c.created_at
                      ? new Date(c.created_at).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
