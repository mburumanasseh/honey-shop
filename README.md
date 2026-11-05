# Mercy Gold Market Place

**Mercy Gold Market Place** is a Kenyan farm-products marketplace. Buyers order honey, milk, dairy, produce, and other goods from verified farmers. Mercy Gold is the middleman: payment is collected on the platform and released to farmers after delivery is confirmed.

| Layer | Stack | Typical host |
|-------|--------|----------------|
| Storefront, seller & admin | **Next.js 15** (App Router) in `frontend-next/` | Vercel |
| API | **FastAPI** + SQLAlchemy + Alembic in `backend/` | Render |
| Database | **PostgreSQL** | Render / managed Postgres |
| Images | **Cloudinary** | — |
| Email (optional) | **Resend** / SMTP | — |

---

## Table of contents

1. [Branch roles](#1-branch-roles)
2. [Product model](#2-product-model)
3. [Repository layout](#3-repository-layout)
4. [Roles & access](#4-roles--access)
5. [Features](#5-features)
6. [Local development](#6-local-development)
7. [Environment variables](#7-environment-variables)
8. [Database migrations](#8-database-migrations)
9. [Deployment](#9-deployment)
10. [API overview](#10-api-overview)
11. [Frontend routes](#11-frontend-routes)
12. [Security notes](#12-security-notes)
13. [Future builds](#13-future-builds)

---

## 1. Branch roles

| Branch | Role |
|--------|------|
| **`main`** | Market Place app (frontend + backend). **Render API deploys from `main`.** |
| **`marketplace`** | Same Market Place line — keep in sync with `main` and `marketplacedev`. |
| **`marketplacedev`** | Integration / preview — keep in sync with `marketplace` and `main`. |
| **`dev`** | Legacy honey site line. **Do not change unless explicitly requested.** |

**Rule:** `main`, `marketplace`, and `marketplacedev` stay aligned on Market Place product code. Work on a feature branch → merge to `marketplacedev` → PR to `marketplace` → keep `main` in sync.

---

## 2. Product model

- **Brand:** Mercy Gold Market Place (farm products, not honey-only).
- **Sellers:** Platform listings and independent farmers.
- **Farmer onboarding:** Self-signup at `/sell/register` → account **pending** → admin **Verify & activate** on `/nas/farmers` or `/nas/approvals`.
- **Public product visibility:** Active products from the **platform** or from a **verified active farmer** (`seller_active = true`) appear in the shop for all visitors. Deactivating a farmer hides their listings.
- **Payments:** Platform collects (M-Pesa / cash recorded by admin). Farmer payouts tracked as `payout_status`: `none` → `ready` → `paid` (after delivery).
- **Categories:** `honey` · `milk` · `dairy` · `produce` · `other` — strict filters; empty categories show **No stock yet**.

---

## 3. Repository layout

```
honey-shop/
├── frontend-next/     # Next.js storefront, /sell, /nas
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── lib/           # api.js, clientApi.js, apiBase.js
│   ├── public/
│   └── styles/
├── backend/           # Shared FastAPI API
│   ├── app/api/       # auth, products, orders, admin_*, seller_*
│   ├── alembic/       # Migrations through 013+
│   └── requirements.txt
├── package.json       # Scripts → frontend-next
├── vercel.json        # Builds frontend-next
├── PROJECT_PROPOSAL.txt
└── README.md
```

There is **no** Vite `frontend/` on this line. Deploy the Next app only.

---

## 4. Roles & access

| Role | Signup | Capabilities |
|------|--------|----------------|
| **Customer** | `/register` | Browse, cart, guest or account checkout, account area |
| **Farmer** | `/sell/register` | After verification: list products, orders for their lines, profile |
| **Admin** | Bootstrap / DB (`is_admin`) | `/nas`: products, farmer verification, orders, customers, inventory, payments, settings |

**Guards**

- `/sell/*` requires farmer (or admin).
- New farmers start with `seller_active = false` until admin verifies.
- Public shop only shows active products whose seller is active (or platform-owned).

---

## 5. Features

### Buyers
- Home, shop with category filters, product detail, cart, guest checkout  
- Account, orders, track order  
- FAQ, Our Story, Terms  
- WhatsApp contact  

### Farmers (`/sell`)
- Register with location and goods to sell + Terms consent  
- Pending banner until verified  
- Products, orders, profile, image upload (Cloudinary when configured)  

### Admin (`/nas`)
- Dashboard (including pending farmer / product counts)  
- **Approvals** — farmer verifications + product listing review  
- **Farmers** — pending / verified filters, verify or revoke  
- Products, orders (payment method, payout status), customers, inventory, payments, settings  

---

## 6. Local development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Set DATABASE_URL, SECRET_KEY in .env
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Health: `http://localhost:8000/api/v1/health`  
- Docs: `http://localhost:8000/api/v1/docs`  

### Frontend

```bash
cd frontend-next
npm install
# .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Or from repo root: `npm run dev`

---

## 7. Environment variables

### Backend (Render)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL |
| `SECRET_KEY` | JWT signing |
| `DEBUG` | Set **`false`** in production |
| `APP_ENV` | Set **`production`** so auth cookies use `SameSite=None; Secure` |
| `CORS_ORIGINS` | Comma-separated frontend origins (must include live Market Place domain) |
| `BOOTSTRAP_SECRET` | Promote admin via `POST /api/v1/auth/bootstrap-admin` |
| `CLOUDINARY_*` | Product images |
| `RESEND_API_KEY` / `EMAIL_FROM` | Optional email |
| `ADMIN_NOTIFY_EMAIL` | New order / new farmer alerts |

**Example `CORS_ORIGINS`:**

```text
http://localhost:3000,https://market.mercygold.co.ke,https://www.mercygold.co.ke,https://mercygold.co.ke
```

### Frontend (Vercel)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | API base **without** trailing slash (e.g. `https://honey-shop-260z.onrender.com`) |

`NEXT_PUBLIC_*` is baked in at **build** time — change it and **redeploy**.

---

## 8. Database migrations

```bash
cd backend && alembic upgrade head
```

| Revision | Change |
|----------|--------|
| `010` | Roles, farmer profile, product seller/category/approval |
| `011` | `order_items.seller_id` |
| `012` | `orders.payout_status` |
| `013` | `farm_location`, `goods_to_sell` |

---

## 9. Deployment

### API (Render) — branch **`main`**
1. Deploy service from `backend/` (or monorepo root as configured).  
2. Env: `DATABASE_URL`, `SECRET_KEY`, `DEBUG=false`, `APP_ENV=production`, `CORS_ORIGINS`.  
3. Release: `alembic upgrade head`.  
4. Confirm `/api/v1/health` and that OpenAPI lists admin farmers / product-approvals.

### Frontend (Vercel) — **`marketplace`** (or `main` if that project deploys Market Place)
1. Root: repo root or `frontend-next`.  
2. `NEXT_PUBLIC_API_URL` for Production and Preview.  
3. Redeploy after env changes.

### Common issues

| Symptom | Fix |
|---------|-----|
| Calls go to `localhost:8000` | Set `NEXT_PUBLIC_API_URL` and redeploy |
| CORS errors | Add exact origin to Render `CORS_ORIGINS` and restart |
| Admin **403** | User must have `is_admin=true`; set `DEBUG=false`; re-login; optional `bootstrap-admin` |
| Admin **404** on new routes | Backend on Render is stale — redeploy **`main`** |

---

## 10. API overview

Base: `/api/v1`

| Area | Prefix |
|------|--------|
| Health | `/health` |
| Auth | `/auth` (register, login, refresh, me, bootstrap-admin) |
| Products | `/products` |
| Seller products | `/seller/products` |
| Seller orders | `/seller/orders` |
| Orders | `/orders` |
| Admin farmers | `/admin/farmers` |
| Admin product approvals | `/admin/product-approvals` |
| Admin customers / settings / presence | `/admin/customers`, `/admin/settings`, `/admin/presence` |
| Uploads | `/uploads/image` |

Interactive docs: `/api/v1/docs`.

---

## 11. Frontend routes

| Path | Audience |
|------|----------|
| `/`, `/shop`, `/products/[id]` | Public |
| `/cart`, `/checkout` | Buyers |
| `/login`, `/register` | Auth (role choice on register) |
| `/account`, `/orders`, `/profile`, `/track` | Customers |
| `/about`, `/faq`, `/terms` | Content |
| `/sell/*` | Farmers |
| `/nas/*` | Admins |

---

## 12. Security notes

- Strong `SECRET_KEY` in production.  
- Explicit CORS allowlist with credentials.  
- Admin routes require `is_admin` (or `role === admin`).  
- Farmer listing requires verified `seller_active`.  
- Terms acceptance required at registration.  
- Never commit `.env` or secrets.

---

## 13. Future builds

### M-Pesa
- STK Push / C2B, webhooks, auto payment status, payout reconciliation.

### SEO
- Metadata, Open Graph, structured data, sitemap/canonicals, Core Web Vitals, category discovery.

---

## License & contact

Proprietary — Mercy Gold Market Place. Contact channels are listed on the live site (e.g. WhatsApp).

See also `PROJECT_PROPOSAL.txt` (Moringa Hackathon–style proposal text).
