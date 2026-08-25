# Current Task

## Task name
User authentication with httpOnly cookies

## Goal
Implement registration, login, logout, refresh and /me using JWT stored in httpOnly cookies.

## Completed in this PR
- User SQLAlchemy model
- Pydantic schemas (Register, Login, UserResponse)
- Auth routes:
  - POST /api/v1/auth/register
  - POST /api/v1/auth/login
  - POST /api/v1/auth/logout
  - POST /api/v1/auth/refresh
  - GET  /api/v1/auth/me
- Dependencies: get_current_user, get_current_active_user, get_current_admin_user
- Cookie helpers (httpOnly, Secure in prod, SameSite=Lax)
- Alembic migration for users table
- Updated README

## Out of scope
- Frontend integration
- Product models
- M-Pesa / Cloudinary
- Email verification / password reset
