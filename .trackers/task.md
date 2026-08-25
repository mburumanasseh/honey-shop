# Current Task

## Task name
Product model + CRUD

## Goal
Add Product model and full CRUD API (public read, admin write).

## Completed in this PR
- Product SQLAlchemy model
- Pydantic schemas (Create, Update, Response)
- Endpoints: list, get, create, update, soft-delete
- Admin protection on write endpoints
- Alembic migration 002
- Seed script for the 3 original honey products
- README updated

## Out of scope
- Frontend shop pages consuming the API
- Image upload (Cloudinary)
- Categories
