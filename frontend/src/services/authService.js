const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = null
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      (typeof data?.detail === 'string' ? data.detail : null) ||
      data?.message ||
      'Something went wrong'
    const error = new Error(Array.isArray(message) ? message[0]?.msg || 'Request failed' : message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export async function register({ name, email, phone, password }) {
  return request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password }),
  })
}

export async function login({ email, password }) {
  return request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function logout() {
  return request('/api/v1/auth/logout', {
    method: 'POST',
  })
}

export async function refresh() {
  return request('/api/v1/auth/refresh', {
    method: 'POST',
  })
}

export async function getMe() {
  return request('/api/v1/auth/me', {
    method: 'GET',
  })
}
