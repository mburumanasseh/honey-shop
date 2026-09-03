import './AdminHeader.css'

function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="admin-header__title">
        <span>Zabe Honey Shop</span>

        <h1>Admin Dashboard</h1>
      </div>

      <div className="admin-header__user">
        <div className="admin-header__avatar">
          A
        </div>

        <div className="admin-header__user-info">
          <strong>Administrator</strong>
          <span>Store Manager</span>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader