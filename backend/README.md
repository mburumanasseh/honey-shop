# Honey Shop Backend

FastAPI + PostgreSQL + SQLAlchemy backend for the Honey Shop monorepo.

## Stack

- **Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy 2.0 + Alembic
- **Auth:** JWT in httpOnly cookies (access + refresh tokens)
- **Payments:** M-Pesa Daraja (coming later)
- **Images:** Cloudinary (coming later)

## Local Development

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Create virtual environment & install dependencies

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment

```bash
cp .env.example .env
# Edit .env if needed (defaults work with the docker-compose above)
```

### 4. Run migrations

```bash
alembic upgrade head
```

### 5. Run the API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000
- Interactive docs: http://localhost:8000/api/v1/docs
- Health: http://localhost:8000/api/v1/health

## Auth Endpoints

| Method | Path                        | Description                          | Auth required |
|--------|-----------------------------|--------------------------------------|---------------|
| POST   | `/api/v1/auth/register`     | Create account + set cookies         | No            |
| POST   | `/api/v1/auth/login`        | Login + set cookies                  | No            |
| POST   | `/api/v1/auth/logout`       | Clear cookies                        | No            |
| POST   | `/api/v1/auth/refresh`      | Refresh access token                 | Refresh cookie|
| GET    | `/api/v1/auth/me`           | Current user                         | Access cookie |

Cookies used:
- `access_token` (httpOnly, short-lived)
- `refresh_token` (httpOnly, longer-lived, path-scoped)

## Project Structure

```text
backend/
├── app/
│   ├── api/          # Route modules (auth, health, ...)
│   ├── core/         # Config, security
│   ├── db/           # Database session & base
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic (future)
│   └── main.py
├── alembic/          # Database migrations
├── docker-compose.yml
├── requirements.txt
└── .env.example
```


## Product Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/products` | List active products | Public |
| GET | `/api/v1/products/{id}` | Get one product | Public |
| POST | `/api/v1/products` | Create product | Admin |
| PATCH | `/api/v1/products/{id}` | Update product | Admin |
| DELETE | `/api/v1/products/{id}` | Soft-delete product | Admin |

### Seed sample products

```bash
alembic upgrade head
python seed_products.py
```

## Next Steps

- Product model + CRUD
- Connect frontend to the new auth API
- M-Pesa integration
- Cloudinary image uploads
- Admin user seeding
