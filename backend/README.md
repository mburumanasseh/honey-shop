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

### 4. Run the API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000
- Interactive docs: http://localhost:8000/api/v1/docs
- Health: http://localhost:8000/api/v1/health

## Project Structure

```text
backend/
├── app/
│   ├── api/          # Route modules
│   ├── core/         # Config, security
│   ├── db/           # Database session & base
│   ├── models/       # SQLAlchemy models (coming)
│   ├── schemas/      # Pydantic schemas (coming)
│   ├── services/     # Business logic (coming)
│   └── main.py       # FastAPI application
├── alembic/          # Database migrations
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

## Next Steps

- User model + registration / login with httpOnly cookies
- Product model + CRUD
- Connect frontend to the new API
- M-Pesa integration
- Cloudinary image uploads
