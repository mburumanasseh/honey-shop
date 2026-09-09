const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

let refreshInFlight = null

async function tryRefreshSession() {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Session expired')
        }
        return true
      })
      .finally(() => {
        refreshInFlight = null
      })
  }
  return refreshInFlight
}

export async function apiRequest(path, options = {}, _retried = false) {
  const headers = {
    ...(options.headers || {}),
  }

  // Only set JSON content-type when there is a body and caller didn't override
  if (options.body && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  })

  let data = null
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  }

  // Access token expired — try refresh once, then retry
  if (response.status === 401 && !_retried && !path.includes('/auth/')) {
    try {
      await tryRefreshSession()
      return apiRequest(path, options, true)
    } catch {
      // fall through to normal error
    }
  }

  if (!response.ok) {
    let message = 'Something went wrong'
    if (typeof data?.detail === 'string') {
      message = data.detail
    } else if (Array.isArray(data?.detail)) {
      message = data.detail[0]?.msg || message
    } else if (data?.message) {
      message = data.message
    }
    if (response.status === 401) {
      message = 'Session expired. Please unlock admin again (enter password on /admin).'
    } else if (response.status === 403) {
      message = message || 'Admin privileges required'
    }
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export function getApiUrl() {
  return API_URL
}
