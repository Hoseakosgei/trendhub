# TrendHub Kenya 🛍️

Kenya's premier e-commerce platform for fashion, electronics, home goods, beauty, and sports products.

---

## 📁 Project Structure

```
trendhub/
├── src/                    # React frontend (Vite)
│   ├── components/         # Reusable UI components
│   │   ├── layout/         # Navbar, Footer, Layout
│   │   ├── product/        # ProductCard
│   │   └── cart/           # CartDrawer
│   ├── pages/              # Route-level page components
│   ├── store/              # Zustand global state (cart, wishlist, auth)
│   ├── data/               # Mock product data and helpers
│   └── styles/             # Global CSS design system
├── backend/                # Node.js + Express REST API
│   ├── controllers/        # Business logic
│   ├── routes/             # Express route definitions
│   ├── middleware/         # Auth, validation, error handling
│   ├── config/             # JWT, database config
│   ├── utils/              # Email, SMS, helpers
│   ├── prisma/             # PostgreSQL schema
│   └── tests/              # Jest unit tests
├── docker-compose.yml      # Local dev with Postgres + Redis
└── README.md
```

---

## 🚀 Quick Start (Frontend Only)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

No backend or database needed for the frontend — product data is served from `src/data/products.js` and state is persisted in localStorage via Zustand.

---

## 🔧 Full Stack Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Docker)
- Redis 7+ (or Docker)

### 1. Frontend

```bash
# From project root
npm install
npm run dev
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your keys (see below)
npm run dev
```

### 3. Database (with Docker)

```bash
# Start Postgres + Redis
docker-compose up postgres redis -d

# Run Prisma migrations
cd backend
npx prisma migrate dev --name init
npx prisma generate

# Seed (optional)
node prisma/seed.js
```

---

## 🐳 Docker (Full Stack)

```bash
docker-compose up --build
```
- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000  
- Postgres: localhost:5432  
- Redis: localhost:6379  

---

## 🔑 Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret (32+ chars) |
| `MPESA_CONSUMER_KEY` | Safaricom Daraja consumer key |
| `MPESA_CONSUMER_SECRET` | Safaricom Daraja consumer secret |
| `MPESA_SHORTCODE` | M-Pesa business short code |
| `MPESA_PASSKEY` | M-Pesa passkey |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `SENDGRID_API_KEY` | SendGrid API key for emails |
| `AT_API_KEY` | Africa's Talking API key (SMS) |
| `AWS_ACCESS_KEY_ID` | AWS access key (S3 uploads) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_S3_BUCKET` | S3 bucket name |

---

## 🛒 Features

### Frontend
- ✅ Responsive homepage with animated hero banner (3 slides)
- ✅ Flash sale countdown timer
- ✅ Product catalog with 24 products across 5 categories
- ✅ Filter sidebar (category, price range) + sort options
- ✅ Product detail page with image gallery, quantity selector, tabs
- ✅ Sliding cart drawer with quantity controls
- ✅ Full cart page with coupon field and order summary
- ✅ 3-step checkout: Address → Payment → Review
- ✅ M-Pesa, Visa/Mastercard, and PayPal payment options
- ✅ Order confirmation with tracking steps
- ✅ Wishlist (persisted to localStorage)
- ✅ User login and registration
- ✅ Account page with mock orders
- ✅ Search page
- ✅ Mobile-first responsive design

### Backend
- ✅ JWT authentication (access + refresh tokens)
- ✅ Rate limiting (global + auth-specific)
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ M-Pesa STK Push integration (Daraja API)
- ✅ Stripe Payment Intents integration
- ✅ Webhook handlers for M-Pesa and Stripe
- ✅ Product CRUD with pagination + filtering
- ✅ Order management with status tracking
- ✅ Image upload to AWS S3
- ✅ Email notifications (SendGrid)
- ✅ SMS notifications (Africa's Talking)
- ✅ PostgreSQL schema via Prisma ORM
- ✅ Jest unit tests with coverage

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Sign in |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Sign out |
| GET  | `/api/v1/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/v1/products` | List products (filterable) |
| GET  | `/api/v1/products/:id` | Get single product |
| POST | `/api/v1/products` | Create product (admin) |
| PUT  | `/api/v1/products/:id` | Update product (admin) |
| DELETE | `/api/v1/products/:id` | Soft-delete product (admin) |
| GET  | `/api/v1/products/categories` | List categories |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST  | `/api/v1/orders` | Create order |
| GET   | `/api/v1/orders` | List user's orders |
| GET   | `/api/v1/orders/:id` | Get single order |
| POST  | `/api/v1/orders/:id/cancel` | Cancel order |
| PATCH | `/api/v1/orders/:id/status` | Update status (admin) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payments/mpesa` | Initiate M-Pesa STK push |
| POST | `/api/v1/payments/mpesa/callback` | M-Pesa webhook |
| POST | `/api/v1/payments/stripe/intent` | Create Stripe PaymentIntent |
| POST | `/api/v1/payments/stripe/webhook` | Stripe webhook |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router 6 |
| Styling | CSS Modules, Custom Design System |
| State | Zustand (persisted) |
| Backend | Node.js, Express 4 |
| Database | PostgreSQL (Prisma ORM) |
| Cache | Redis |
| Auth | JWT (access + refresh tokens) |
| Payments | M-Pesa Daraja, Stripe |
| Email | SendGrid |
| SMS | Africa's Talking |
| Storage | AWS S3 |
| Deployment | Docker, Nginx |

---

## 📄 License

MIT © TrendHub Kenya 2026
