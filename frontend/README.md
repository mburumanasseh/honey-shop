# Mercy Gold Honey — Frontend

React + Vite client for the Mercy Gold Honey monorepo: **customer storefront** and **admin panel**.

## Stack

| Piece | Choice |
|-------|--------|
| UI | React 19 |
| Build | Vite |
| Routing | React Router |
| State | Context (Auth, Cart) |
| API | `fetch` + httpOnly cookies (`credentials: 'include'`) |
| Deploy | Vercel |

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Environment

Create `frontend/.env` (or set on Vercel):

```env
VITE_API_URL=http://localhost:8000
```

Production example:

```env
VITE_API_URL=https://honey-shop-260z.onrender.com
```

- No trailing slash  
- Must be set for **Production** (and ideally Preview) on Vercel  
- **Redeploy** after changing `VITE_*` (inlined at build time)

## Project layout

```text
frontend/
├── public/
│   ├── mercy-gold-logo.svg      # Brand logo
│   └── honeyjar.jpg       # Fallback product image
├── src/
│   ├── components/
│   │   ├── layout/        # Navbar, Hero
│   │   ├── admin/         # Sidebar, Header, StatCard
│   │   └── checkout/      # MpesaPayment (UI stub)
│   ├── context/           # AuthProvider, CartProvider
│   ├── pages/
│   │   ├── customer/      # Home, Shop, Cart, Checkout, Login, Register, Profile, MyOrders
│   │   └── admin/         # Dashboard, Products, Orders, Customers, Inventory, Payments, Settings
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedAdminRoute.jsx   # Password gate + is_admin
│   ├── services/          # api, auth, product, order, admin, delivery
│   └── layouts/           # CustomerLayout, AdminLayout
├── index.html             # Title: Mercy Gold Honey
└── vercel.json            # SPA rewrites (when Root Directory = frontend)
```

## Customer routes

| Path | Description |
|------|-------------|
| `/` | Home + featured products |
| `/shop` | All products |
| `/product/:id` | Product detail |
| `/cart` | Cart |
| `/checkout` | Place order (requires login) |
| `/login` / `/register` | Auth |
| `/profile` | Account summary |
| `/orders` | My order history |

## Admin routes (`/admin/*`)

Access requires:

1. Email + password on the admin gate  
2. User with `is_admin: true`  

| Path | Description |
|------|-------------|
| `/admin` | Dashboard (live API stats) |
| `/admin/products` | Product list + soft-delete |
| `/admin/products/add` | Create product + optional Cloudinary upload |
| `/admin/orders` | All orders + status updates |
| `/admin/customers` | Registered users + spend |
| `/admin/inventory` | Stock levels (inline edit) |
| `/admin/payments` | Payment view derived from orders |
| `/admin/settings` | Store settings (API-persisted) |

Session unlock is stored in `sessionStorage` for the tab; logout clears it. API still enforces admin on mutations.

## API client behaviour

- Base URL: `import.meta.env.VITE_API_URL`
- All requests: `credentials: 'include'`
- On **401**, client tries `POST /api/v1/auth/refresh` once, then retries
- Product images: normalizes legacy `/src/assets/...` paths to `/honeyjar.jpg`

## Branding

- Name: **Mercy Gold Honey**
- Logo: top-left navbar + admin sidebar (`/mercy-gold-logo.svg`)

## Vercel

Monorepo root `vercel.json`:

- Builds `frontend` and serves `frontend/dist`
- SPA rewrites so `/shop`, `/admin`, etc. do not 404 on refresh

Required Production env: `VITE_API_URL`.

## Local full-stack

1. Start backend on port 8000 (see backend README)  
2. `VITE_API_URL=http://localhost:8000`  
3. `npm run dev`  

CORS on the API must allow `http://localhost:5173`.

## Not finished on the frontend

- Real M-Pesa STK UI wiring (component is a stub)
- Frontend unit/e2e tests
- Guest checkout

## Related

- Backend API: [../backend/README.md](../backend/README.md)  
- Monorepo: [../README.md](../README.md)
