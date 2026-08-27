# Current Task

## Task name
Orders + admin bootstrap

## Goal
Add order creation/listing and a secure way to promote the first admin user.

## Completed in this PR
- Order + OrderItem models
- Create order, list my orders, get order
- Admin list orders + update status
- Stock decrement on order create
- POST /api/v1/auth/bootstrap-admin
- BOOTSTRAP_SECRET config
- Alembic migration 003

## Out of scope
- M-Pesa
- Cloudinary
- Frontend wiring
