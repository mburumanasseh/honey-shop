# Mercy Gold marketplace

Monorepo: **Next.js** storefront (`frontend-next/`) + **FastAPI** backend (`backend/`).

| Layer | Stack | Host |
|-------|--------|------|
| **Frontend** | Next.js (App Router) | Vercel |
| **Backend** | FastAPI + SQLAlchemy + Alembic | Render |

## Layout

```
├── frontend-next/   # Storefront, seller (/sell), admin (/nas)
├── backend/         # API
├── vercel.json      # Builds frontend-next
└── package.json     # npm scripts → frontend-next
```

## Local development

### Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend-next
npm install
npm run dev
```

Or from repo root: `npm run dev`

## Production

- **Vercel:** builds `frontend-next` (root `vercel.json`). Set `NEXT_PUBLIC_API_URL` to the Render API.
- **Render:** FastAPI. Set `CORS_ORIGINS` to your live frontend origin(s).
- Migrations: `alembic upgrade head`

## Docs

- Backend: `backend/README.md`
- Frontend deploy: `frontend-next/VERCEL.md`
