/**
 * Shared API base URL for browser + server.
 * Production falls back to Render if NEXT_PUBLIC_API_URL is missing at build time
 * (avoids silent localhost:8000 in deployed builds).
 */
const RENDER_API = 'https://honey-shop-260z.onrender.com'

export function getApiBaseUrl() {
  const fromEnv = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV === 'production') return RENDER_API
  return 'http://localhost:8000'
}
