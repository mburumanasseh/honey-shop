import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import './Login.css'

function Profile() {
  const { currentUser, isAuthenticated, loading, logout } = useAuth()

  if (loading) {
    return (
      <main className="login-page">
        <div className="login-page__card">
          <p>Loading…</p>
        </div>
      </main>
    )
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <main className="login-page">
        <div className="login-page__card">
          <h1>Profile</h1>
          <p>Please log in to view your account.</p>
          <Link to="/login">Login</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="login-page">
      <div className="login-page__card">
        <div className="login-page__header">
          <span>Your account</span>
          <h1>{currentUser.name}</h1>
        </div>
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        {currentUser.phone && (
          <p>
            <strong>Phone:</strong> {currentUser.phone}
          </p>
        )}
        <p>
          <strong>Role:</strong> {currentUser.is_admin ? 'Admin' : 'Customer'}
        </p>
        <p style={{ marginTop: '1.5rem' }}>
          <Link to="/orders">View my orders →</Link>
        </p>
        <p>
          <button type="button" onClick={() => logout()}>
            Logout
          </button>
        </p>
        <p>
          <Link to="/">← Back to store</Link>
        </p>
      </div>
    </main>
  )
}

export default Profile
