# Current Task

## Task name
Frontend auth integration

## Goal
Replace localStorage auth with real FastAPI endpoints using httpOnly cookies.

## Completed in this PR
- Created `src/services/authService.js` (register, login, logout, refresh, getMe)
- Rewrote AuthProvider to call the API and restore session via /me + refresh
- Made Login, Register, and Navbar async-compatible
- Added frontend `.env.example` with VITE_API_URL

## Out of scope
- Product CRUD
- Protected admin routes
- UI redesign
