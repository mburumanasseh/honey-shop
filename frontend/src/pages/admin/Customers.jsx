import { useCallback, useEffect, useMemo, useState } from 'react'
import { listCustomers } from '../../services/adminService'
import './Customers.css'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listCustomers({ limit: 200 })
      setCustomers(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim()
    if (!search) return customers
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(search) ||
        c.email?.toLowerCase().includes(search) ||
        (c.phone || '').toLowerCase().includes(search),
    )
  }, [customers, searchTerm])

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(amount || 0)

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Customers</h1>
          <p>Registered accounts on Mercy Gold Honey.</p>
        </div>
      </div>

      <div className="customers-toolbar">
        <input
          type="search"
          placeholder="Search name, email, phone…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span>
          {loading
            ? 'Loading…'
            : `${filteredCustomers.length} customer${filteredCustomers.length === 1 ? '' : 's'}`}
        </span>
      </div>

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p>Loading customers…</p>
      ) : filteredCustomers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total spent</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                    {!c.is_active && <span> (inactive)</span>}
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.orders_count}</td>
                  <td>{formatCurrency(c.total_spent)}</td>
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

export default Customers
