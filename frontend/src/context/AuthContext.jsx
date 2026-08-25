import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext(null)

const USERS_STORAGE_KEY = 'honey_shop_users'
const CURRENT_USER_STORAGE_KEY = 'honey_shop_current_user'

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem(
      CURRENT_USER_STORAGE_KEY,
    )

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(
          CURRENT_USER_STORAGE_KEY,
        )
      }
    }

    setLoading(false)
  }, [])

  const getUsers = () => {
    const storedUsers = localStorage.getItem(
      USERS_STORAGE_KEY,
    )

    if (!storedUsers) {
      return []
    }

    try {
      return JSON.parse(storedUsers)
    } catch {
      return []
    }
  }

  const saveUsers = (users) => {
    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(users),
    )
  }

  const register = (userData) => {
    const users = getUsers()

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() ===
        userData.email.toLowerCase(),
    )

    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists.',
      }
    }

    const newUser = {
      id: Date.now(),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone.trim(),
      password: userData.password,
      createdAt: new Date().toISOString(),
    }

    saveUsers([...users, newUser])

    const userWithoutPassword = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      createdAt: newUser.createdAt,
    }

    localStorage.setItem(
      CURRENT_USER_STORAGE_KEY,
      JSON.stringify(userWithoutPassword),
    )

    setCurrentUser(userWithoutPassword)

    return {
      success: true,
      user: userWithoutPassword,
    }
  }

  const login = (email, password) => {
    const users = getUsers()

    const user = users.find(
      (item) =>
        item.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        item.password === password,
    )

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password.',
      }
    }

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    }

    localStorage.setItem(
      CURRENT_USER_STORAGE_KEY,
      JSON.stringify(userWithoutPassword),
    )

    setCurrentUser(userWithoutPassword)

    return {
      success: true,
      user: userWithoutPassword,
    }
  }

  const logout = () => {
    localStorage.removeItem(
      CURRENT_USER_STORAGE_KEY,
    )

    setCurrentUser(null)
  }

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loading,
    register,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider