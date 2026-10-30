# Mercy Gold Marketplace

**Mercy Gold** is a Kenyan farm-products marketplace. Buyers order honey, milk, dairy, produce, and other goods from approved farmers. Mercy Gold acts as the middleman: payment is collected on the platform and released to farmers after delivery is confirmed.

| Layer | Stack | Typical host |
|-------|--------|----------------|
| Storefront & consoles | **Next.js 15** (App Router) | Vercel |
| API | **FastAPI** + SQLAlchemy + Alembic | Render |
| Database | **PostgreSQL** | Render / managed Postgres |
| Images | **Cloudinary** | — |
| Email (optional) | **Resend** / SMTP | — |

---

## Table of contents

1. [Product model](#1-product-model)
2. [Repository layout](#2-repository-layout)
3. [Roles & access](#3-roles--access)
4. [Features](#4-features)
5. [Local development](#5-local-development)
6. [Environment variables](#6-environment-variables)
7. [Database migrations](#7-database-migrations)
8. [Deployment](#8-deployment)
9. [API overview](#9-api-overview)
10. [Frontend routes](#10-frontend-routes)
11. [Branch workflow](#11-branch-workflow)
12. [Security notes](#12-security-notes)

---

## 1. Product model

- **Brand:** Mercy Gold (not a single-product honey shop).
- **Sellers:** Mercy Gold platform listings **and** independent farmers.
- **Farmer onboarding:** Open self-signup → **admin verification** before listing → product **approval** before public shop.
- **Payments:** Platform collects (e.g. M-Pesa / cash recorded by admin). Farmers are paid after delivery is confirmed (`payout_status`: `none` → `ready` → `paid`).
- **Categories:** `honey` · `milk` · `dairy` · `produce` · `other` — the shop filters strictly; empty categories show **No stock yet**.

---

## 2. Repository layout

```
honey-shop/
├── frontend-next/          # Only frontend (Next.js)
│   ├── app/                # App Router pages
│   ├── components/
│   ├── context/            # Auth, cart
│   ├── lib/                # API clients (api.js, clientApi.js, apiBase.js)
│   ├── public/
│   └── styles/
├── backend/                # FastAPI API
│   ├── app/
│   │   ├── api/            # Route modules
│   │   ├── core/           # Config, security
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/       # Cloudinary, email, …
│   ├── alembic/            # Migrations 001–013+
│   └── requirements.txt
├── package.json            # Scripts → frontend-next
├── vercel.json             # Builds frontend-next
└── README.md               # This file
```

> The legacy Vite app (`frontend/`) was **removed**. Do not point Vercel at a `frontend` root directory.

---

## 3. Roles & access

| Role | How they sign up | What they can do |
|------|------------------|------------------|
| **Customer** | `/register` (role = customer) | Browse, cart, guest or account checkout, account orders |
| **Farmer / seller** | `/sell/register` (or register → farmer) | After **admin verification**: list products (pending approval), see their order lines, edit profile |
| **Admin** | Promoted via bootstrap / DB (`is_admin`) | `/nas` console: products, approvals, farmers, orders, customers, inventory, payments, settings |

**Guards**

- Seller UI (`/sell/*`) requires `role === farmer` (or admin).
- New farmers start with `seller_active = false` until an admin **Verify & activate**s them on `/nas/farmers`.
- Public shop only shows products that are `is_active`, `approval_status = approved`, and whose seller is active (or platform-owned `seller_id = null`).

---

## 4. Features

### Buyers (storefront)

- Home marketplace narrative, category entry points, featured products  
- Shop with category chips: All / Honey / Milk / Dairy / Produce / Other  
- Product detail, cart, guest checkout, optional accounts  
- Order tracking / guest lookup  
- FAQ, Our Story, Terms & Conditions (Kenya-oriented, Data Protection Act 2019 notes)  
- WhatsApp contact entry point  

### Farmers (`/sell`)

- Register with farm name, county, **farm/commodity location**, **goods to sell**, M-Pesa  
- Required acceptance of Terms  
- Dashboard, profile edit, product CRUD (create → **pending** approval)  
- Image upload via Cloudinary (when configured)  
- Orders list (line items for their `seller_id` only) + payout status visibility  

### Admin (`/nas`)

- Dashboard stats  
- Products (platform catalog)  
- **Approvals** — approve / reject farmer listings  
- **Farmers** — location, goods, verify/activate or revoke  
- Orders — status, payment method, **payout_status** (ready/paid only after **delivered**)  
- Customers, inventory, payments, settings  

### Platform mechanics

- Cookie-based JWT auth (`access_token` / refresh)  
- Hard product delete (order lines keep name/price snapshots)  
- Manual payment method on orders (cash / mpesa / other)  
- Presence heartbeat for “online” style admin awareness (optional)  

---

## 5. Local development

### Prerequisites

- Node.js 20+  
- Python 3.11+  
- PostgreSQL  

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Set DATABASE_URL and SECRET_KEY in .env (see below)
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Health: http://localhost:8000/api/v1/health  
- Docs: http://localhost:8000/api/v1/docs  

### Frontend

```bash
cd frontend-next
npm install
# .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Or from repo root:

```bash
npm install --prefix frontend-next
npm run dev
```

Open http://localhost:3000  

---

## 6. Environment variables

### Backend (Render / `.env`)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret |
| `CORS_ORIGINS` | Comma-separated frontend origins (**must include** your live domain, e.g. `https://market.mercygold.co.ke`) |
| `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | Product image uploads |
| `CLOUDINARY_FOLDER` | Optional folder name |
| `RESEND_API_KEY` / `EMAIL_FROM` | Transactional email (optional) |
| `SMTP_*` | Alternative email (optional) |
| `ADMIN_NOTIFY_EMAIL` | New-order alerts (optional) |
| `STOREFRONT_URL` | Links in emails |
| `BOOTSTRAP_SECRET` | One-time admin promotion endpoint |

**Example `CORS_ORIGINS`:**

```text
http://localhost:3000,https://market.mercygold.co.ke,https://www.mercygold.co.ke,https://mercygold.co.ke,https://honey-shop-chi.vercel.app,https://frontend-snowy-two-50.vercel.app
```

### Frontend (Vercel / `.env.local`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | API base, **no trailing slash** — e.g. `https://honey-shop-260z.onrender.com` |

`NEXT_PUBLIC_*` is baked in at **build time**. After changing it on Vercel, **redeploy**.

Production code falls back to the Render API URL if the env var is missing, but you should still set it explicitly.

---

## 7. Database migrations

From `backend/` with the same `DATABASE_URL` as production:

```bash
alembic upgrade head
```

Notable marketplace migrations:

| Revision | Change |
|----------|--------|
| `010` | User roles, farmer profile, product `seller_id` / `category` / `approval_status` |
| `011` | `order_items.seller_id` |
| `012` | `orders.payout_status` |
| `013` | `farm_location`, `goods_to_sell` on users |

---

## 8. Deployment

### API (Render)

1. Web service from `backend/` (or Docker if configured).  
2. Set env vars, especially `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`.  
3. Release command or shell: `alembic upgrade head`.  
4. Confirm `GET /api/v1/health` returns OK.

### Frontend (Vercel)

1. Root directory: repository root **or** `frontend-next` (match `vercel.json`).  
2. Framework: Next.js.  
3. Set `NEXT_PUBLIC_API_URL` for Production **and** Preview.  
4. Deploy.  
5. Ensure the deployed origin is listed in backend `CORS_ORIGINS`.

### Common failure modes

| Symptom | Cause |
|---------|--------|
| `localhost:8000` / `ERR_CONNECTION_REFUSED` | Missing `NEXT_PUBLIC_API_URL` at build time |
| CORS blocked from `market.mercygold.co.ke` | Origin not in `CORS_ORIGINS` on Render |
| 500 on register/products after pull | Migrations not applied |

---

## 9. API overview

Base path: `/api/v1`

| Area | Prefix | Notes |
|------|--------|--------|
| Health | `/health` | Liveness |
| Auth | `/auth` | register, login, logout, refresh, `GET/PATCH /me` |
| Products | `/products` | Public list/detail; admin create/update/delete |
| Seller products | `/seller/products` | Farmer CRUD; creates as `pending` |
| Seller orders | `/seller/orders` | Orders containing the farmer’s lines |
| Orders | `/orders` | Create (guest OK), my orders, lookup, admin list/patch |
| Admin farmers | `/admin/farmers` | List; patch `seller-active` |
| Admin approvals | `/admin/product-approvals` | List/filter; approve/reject |
| Uploads | `/uploads/image` | Admin or active farmer |
| Customers | `/admin/customers` | Admin |
| Settings / presence | `/settings`, `/presence` | Store settings; heartbeat |

Interactive docs: `/api/v1/docs` when the API is running.

---

## 10. Frontend routes

| Path | Audience |
|------|----------|
| `/` | Public home |
| `/shop`, `/shop?category=…` | Catalog |
| `/products/[id]` | Product detail |
| `/cart`, `/checkout` | Cart & checkout |
| `/login`, `/register` | Customer auth (+ role choice) |
| `/account`, `/orders`, `/profile`, `/track` | Customer account |
| `/about`, `/faq`, `/terms` | Content |
| `/sell/*` | Farmer console (login, register, products, orders, profile) |
| `/nas/*` | Admin console (obscured path name) |
| `/benefits` | Redirects to `/shop` (legacy URL) |

---

## 11. Branch workflow

| Branch | Role |
|--------|------|
| `marketplace` | Production default (merge via PR) |
| `marketplacedev` | Integration branch for features |
| `feat/…`, `fix/…`, `chore/…` | Short-lived branches → merge to `marketplacedev` → PR to `marketplace` |

---

## 12. Security notes

- Prefer long random `SECRET_KEY` in production.  
- CORS must be an explicit allowlist (credentials are used with cookies).  
- Admin routes require `is_admin` (and active user).  
- Farmer listing requires `seller_active` and product `approval_status`.  
- Terms acceptance is required at registration; review `/terms` with a Kenyan lawyer for production use.  
- Do not commit `.env` files or API secrets.

---

## License & contact

Proprietary — Mercy Gold. For operational contact, use the channels on the live site (e.g. WhatsApp).

---

*Single source of documentation for this monorepo. Previous `backend/README.md` and `frontend-next/README.md` files were removed in favour of this file.*
