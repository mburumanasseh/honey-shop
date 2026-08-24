import { NavLink } from 'react-router-dom'
import './AdminSidebar.css'

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div className="admin-sidebar__brand">
        <NavLink to="/admin">
          Honey Shop
        </NavLink>

        <span>Admin</span>
      </div>

      {/* Main Navigation */}
      <nav
        className="admin-sidebar__nav"
        aria-label="Admin navigation"
      >
        {/* Dashboard */}
        <NavLink
          to="/admin"
          end
          className="admin-sidebar__link"
        >
          <span>▦</span>
          Dashboard
        </NavLink>

        {/* Products */}
        <NavLink
          to="/admin/products"
          className="admin-sidebar__link"
        >
          <span>🍯</span>
          Products
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/admin/orders"
          className="admin-sidebar__link"
        >
          <span>▤</span>
          Orders
        </NavLink>

        {/* Customers */}
        <NavLink
          to="/admin/customers"
          className="admin-sidebar__link"
        >
          <span>♙</span>
          Customers
        </NavLink>

        {/* Inventory */}
        <NavLink
          to="/admin/inventory"
          className="admin-sidebar__link"
        >
          <span>◫</span>
          Inventory
        </NavLink>

        {/* Payments */}
        <NavLink
          to="/admin/payments"
          className="admin-sidebar__link"
        >
          <span>▣</span>
          Payments
        </NavLink>
      </nav>

      {/* Bottom Navigation */}
      <div className="admin-sidebar__bottom">
        {/* Settings */}
        <NavLink
          to="/admin/settings"
          className="admin-sidebar__link"
        >
          <span>⚙</span>
          Settings
        </NavLink>

        {/* Back to Store */}
        <NavLink
          to="/"
          className="admin-sidebar__link"
        >
          <span>←</span>
          Back to Shop
        </NavLink>
      </div>
    </aside>
  )
}

export default AdminSidebar