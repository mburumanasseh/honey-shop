import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

/**
 * Blocks /admin/* unless the user is logged in and is_admin.
 * Backend APIs remain the real security boundary; this only protects the UI.
 */
function ProtectedAdminRoute({ children }) {
  const { currentUser, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Checking access…
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (!currentUser?.is_admin) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return children
}

export default ProtectedAdminRoute
