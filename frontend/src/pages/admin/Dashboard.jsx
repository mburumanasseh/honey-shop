import { Link } from 'react-router-dom'
import StatCard from '../../components/admin/StatCard'
import './Admin.css'

function Dashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__intro">
        <div>
          <span>Overview</span>

          <h2>Welcome back 👋</h2>

          <p>
            Here's what's happening with Zabe Honey Shop.
          </p>
        </div>
      </div>

      <div className="admin-dashboard__stats">
        <StatCard
          title="Orders"
          value="24"
          description="Orders received"
          icon="▤"
        />

        <StatCard
          title="Revenue"
          value="KSh 48,500"
          description="Total sales"
          icon="KSh"
        />

        <StatCard
          title="Products"
          value="12"
          description="Products available"
          icon="🍯"
        />

        <StatCard
          title="Customers"
          value="38"
          description="Registered customers"
          icon="♙"
        />
      </div>

      <section className="admin-dashboard__section">
        <div className="admin-dashboard__section-header">
          <div>
            <span>Latest Activity</span>

            <h2>Recent Orders</h2>
          </div>

          <Link to="/admin/orders">
            View All
          </Link>
        </div>

        <div className="admin-dashboard__orders">
          <div className="admin-dashboard__order">
            <div>
              <strong>#ORD-001</strong>
              <span>John Kamau</span>
            </div>

            <strong>KSh 2,500</strong>

            <span className="order-status order-status--paid">
              Paid
            </span>
          </div>

          <div className="admin-dashboard__order">
            <div>
              <strong>#ORD-002</strong>
              <span>Mary Wanjiku</span>
            </div>

            <strong>KSh 1,800</strong>

            <span className="order-status order-status--pending">
              Pending
            </span>
          </div>

          <div className="admin-dashboard__order">
            <div>
              <strong>#ORD-003</strong>
              <span>David Mwangi</span>
            </div>

            <strong>KSh 3,200</strong>

            <span className="order-status order-status--paid">
              Paid
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard