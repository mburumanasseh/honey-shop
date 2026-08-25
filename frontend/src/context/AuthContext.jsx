import { createContext, useCallback, useEffect, useState } from 'react'
import * as authService from '../services/authService'

export const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const clearUser = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const fetchCurrentUser = useCallback(async () => {
    try {
      const user = await authService.getMe()
      setCurrentUser(user)
      return user
    } catch {
      // Try refresh once
      try {
        await authService.refresh()
        const user = await authService.getMe()
        setCurrentUser(user)
        return user
      } catch {
        clearUser()
        return null
      }
    }
  }, [clearUser])

  useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      try {
        if (!cancelled) {
          await fetchCurrentUser()
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [fetchCurrentUser])

  const register = async (userData) => {
    try {
      const user = await authService.register({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      })
      setCurrentUser(user)
      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed',
      }
    }
  }

  const login = async (email, password) => {
    try {
      const user = await authService.login({ email, password })
      setCurrentUser(user)
      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Invalid email or password',
      }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Still clear local state even if the request fails
    } finally {
      clearUser()
    }
  }

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loading,
    register,
    login,
    logout,
    refreshUser: fetchCurrentUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
