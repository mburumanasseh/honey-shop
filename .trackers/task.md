# Current Task

## Task name
Backend foundation (Phase 2)

## Goal
Scaffold a clean FastAPI + PostgreSQL + SQLAlchemy backend with httpOnly cookie auth preparation.

## Approved decisions
- Backend: Python + FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy + Alembic
- Auth: JWT in httpOnly cookies (access + refresh)
- Payments: M-Pesa Daraja (later)
- Images: Cloudinary (later)

## Completed in this PR
- FastAPI application skeleton
- Config via pydantic-settings
- SQLAlchemy session + Base
- Security helpers (password hashing, access/refresh token creation)
- CORS with credentials support
- Health check endpoint
- Alembic setup
- Docker Compose for local PostgreSQL
- Clear README + Makefile

## Out of scope (next PRs)
- User model & registration/login endpoints
- Product models & CRUD
- Connecting the frontend
- M-Pesa / Cloudinary

## Verification
- Structure is clean and runnable once Postgres is up
