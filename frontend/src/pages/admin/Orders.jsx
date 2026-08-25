import { useState } from 'react'
import './Orders.css'

const orders = [
  {
    id: 'ORD-001',
    customer: 'John Kamau',
    phone: '0712345678',
    date: '22 Aug 2026',
    items: 2,
    total: 2500,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
  },
  {
    id: 'ORD-002',
    customer: 'Mary Wanjiku',
    phone: '0723456789',
    date: '21 Aug 2026',
    items: 1,
    total: 1800,
    paymentStatus: 'Pending',
    orderStatus: 'Processing',
  },
  {
    id: 'ORD-003',
    customer: 'David Mwangi',
    phone: '0734567890',
    date: '20 Aug 2026',
    items: 3,
    total: 3200,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
  },
  {
    id: 'ORD-004',
    customer: 'Grace Njeri',
    phone: '0745678901',
    date: '19 Aug 2026',
    items: 2,
    total: 2100,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
  },
  {
    id: 'ORD-005',
    customer: 'Peter Otieno',
    phone: '0756789012',
    date: '18 Aug 2026',
    items: 1,
    total: 1200,
    paymentStatus: 'Failed',
    orderStatus: 'Cancelled',
  },
]

function Orders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customer
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm)

    const matchesStatus =
      statusFilter === 'All' ||
      order.orderStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="admin-orders">
      <div className="admin-orders__header">
        <div>
          <span className="admin-orders__eyebrow">
            Store Management
          </span>

          <h1>Orders</h1>

          <p>
            Manage customer orders and track their delivery
            status.
          </p>
        </div>
      </div>

      <div className="admin-orders__stats">
        <div className="admin-orders__stat">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="admin-orders__stat">
          <span>Pending</span>
          <strong>
            {
              orders.filter(
                (order) =>
                  order.orderStatus === 'Processing',
              ).length
            }
          </strong>
        </div>

        <div className="admin-orders__stat">
          <span>Shipped</span>
          <strong>
            {
              orders.filter(
                (order) =>
                  order.orderStatus === 'Shipped',
              ).length
            }
          </strong>
        </div>

        <div className="admin-orders__stat">
          <span>Delivered</span>
          <strong>
            {
              orders.filter(
                (order) =>
                  order.orderStatus === 'Delivered',
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="admin-orders__card">
        <div className="admin-orders__toolbar">
          <div className="admin-orders__search">
            <span>⌕</span>

            <input
              type="search"
              placeholder="Search orders or customers..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="admin-orders__filter"
          >
            <option value="All">All Orders</option>
            <option value="Processing">
              Processing
            </option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">
              Delivered
            </option>
            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="admin-orders__empty">
            <h2>No orders found</h2>

            <p>
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="admin-orders__table-wrapper">
            <table className="admin-orders__table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>
                        #{order.id}
                      </strong>
                    </td>

                    <td>
                      <div className="admin-order__customer">
                        <strong>
                          {order.customer}
                        </strong>

                        <span>{order.phone}</span>
                      </div>
                    </td>

                    <td>{order.date}</td>

                    <td>
                      {order.items}{' '}
                      {order.items === 1
                        ? 'item'
                        : 'items'}
                    </td>

                    <td>
                      <strong>
                        KSh{' '}
                        {order.total.toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`admin-order__payment admin-order__payment--${order.paymentStatus.toLowerCase()}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-order__status admin-order__status--${order.orderStatus.toLowerCase()}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="admin-order__view"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders