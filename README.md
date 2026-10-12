# Sattva — Yoga & Wellness E-Commerce Platform

A full-stack yoga and wellness e-commerce and home-session booking platform featuring a customer storefront, trainer portal (with OTP session verification and scene photo uploads), and an admin dashboard (products, combos, categories, orders, shipments, service bookings, trainers, coupons, payments, and print/PDF receipts).

---

## Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend:** NestJS 12, TypeScript, Prisma ORM 7, Passport JWT, Nodemailer
- **Database:** PostgreSQL 17
- **Integrations:** Cloudinary (image uploads), Razorpay (payments & webhooks), SMTP (transactional emails)
- **Infrastructure:** Docker & Docker Compose

---

## Project Structure

```text
.
├── frontend/               # Next.js 16 customer storefront, trainer portal & admin dashboard
├── backend/                # NestJS 12 REST API & Prisma database layer
│   ├── prisma/             # Prisma schema, migrations, and seed script
│   └── src/                # NestJS modules, controllers, services & config
├── docker-compose.yml      # Development Docker Compose stack (frontend, backend, postgres)
├── docker-compose.prod.yml # Production Docker Compose stack
└── .env                    # Root environment variables (used by Docker Compose)
```

---

## Prerequisites

- **Node.js:** v24 or later (`v24.x` recommended)
- **npm:** v10+
- **Docker & Docker Compose:** (Required if running via containers, or for running PostgreSQL in Docker)
- **External Accounts (for full functionality):**
  - **Cloudinary** account (required by backend startup validation for product/service/trainer image uploads)
  - **Razorpay** account (test or live keys for checkout payments)
  - **SMTP Server** (optional in development, required in production for order/booking emails)

---

## 1. Environment Variables Setup (What to Add & Where)

Depending on how you run the project, place your environment files in the locations below:

| Run Mode | Where to Create `.env` File(s) |
| :--- | :--- |
| **Docker Compose (Recommended)** | Single **`.env`** file in the **project root** (`/yoga/.env`) |
| **Local Development (Without Docker)** | Two files: **`backend/.env`** and **`frontend/.env.local`** |

---

### Option A: Root `.env` File (For Docker Compose)

Create a `.env` file in the **project root directory** (`./.env`) with the following variables:

```env
# ==========================================
# 1. PORTS & HOST CONFIGURATION
# ==========================================
FRONTEND_PORT=3000
FRONTEND_INTERNAL_PORT=3000

BACKEND_PORT=4000
BACKEND_INTERNAL_PORT=4000
BACKEND_HOST=0.0.0.0

POSTGRES_PORT=5432

# ==========================================
# 2. APPLICATION & API URLS
# ==========================================
# Browser-accessible URLs
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000/admin
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Docker-internal URL used by Next.js server components (SSR) to reach the backend container
INTERNAL_API_URL=http://backend:4000/api/v1

# ==========================================
# 3. POSTGRESQL DATABASE
# ==========================================
POSTGRES_DB=yoga_ecommerce
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# ==========================================
# 4. JWT AUTHENTICATION (REQUIRED)
# ==========================================
JWT_SECRET=replace-with-a-strong-random-secret-key
JWT_EXPIRES_IN=7d

# ==========================================
# 5. CLOUDINARY STORAGE (REQUIRED)
# ==========================================
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_PRODUCT_FOLDER=yoga_ecommerce

# ==========================================
# 6. RAZORPAY PAYMENTS
# ==========================================
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx

# ==========================================
# 7. SMTP EMAIL NOTIFICATIONS
# ==========================================
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM_EMAIL=your_email@gmail.com
MAIL_FROM_NAME="Sattva Yoga & Wellness"
ADMIN_EMAIL=admin@example.com

# ==========================================
# 8. OPTIONAL: INITIAL DATABASE SEEDING
# ==========================================
SEED_ADMIN_NAME="Admin User"
SEED_ADMIN_EMAIL=admin@sattva.com
SEED_ADMIN_PASSWORD=Admin@12345
SEED_TRAINER_PASSWORD=Trainer@12345
```

---

### Option B: Separate `.env` Files (For Running Locally Without Docker)

If you run `backend` and `frontend` directly on your host machine using `npm`:

#### 1. Backend Environment (`backend/.env`)

Create **`backend/.env`**:

```env
NODE_ENV=development
PORT=4000

# Point to your local PostgreSQL instance
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/yoga_ecommerce?schema=public"

# CORS & Frontend Links
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000/admin

# JWT Authentication (Required)
JWT_SECRET=replace-with-a-strong-random-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary (Required by backend startup validation)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_PRODUCT_FOLDER=yoga_ecommerce

# Razorpay Payments
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Optional Default Shipping Charge (in USD)
DEFAULT_SHIPPING_CHARGE=0

# SMTP Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM_EMAIL=your_email@gmail.com
MAIL_FROM_NAME="Sattva Yoga & Wellness"
ADMIN_EMAIL=admin@example.com

# Optional Seed Credentials (used by `npm run db:seed`)
SEED_ADMIN_NAME="Admin User"
SEED_ADMIN_EMAIL=admin@sattva.com
SEED_ADMIN_PASSWORD=Admin@12345
SEED_TRAINER_PASSWORD=Trainer@12345
```

#### 2. Frontend Environment (`frontend/.env.local` or `frontend/.env`)

Create **`frontend/.env.local`**:

```env
# Public API URL used by browser requests
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Server-side API URL used during SSR (same as NEXT_PUBLIC_API_URL when running on host)
INTERNAL_API_URL=http://localhost:4000/api/v1

# Public Razorpay Key ID (never put secret keys in frontend/.env.local)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
```

---

### Environment Variables Reference

| Variable | Location | Required? | Description |
| :--- | :--- | :---: | :--- |
| `DATABASE_URL` | `backend` | **Yes** | PostgreSQL connection string (auto-constructed in `docker-compose.yml` from `POSTGRES_*` vars). |
| `JWT_SECRET` | `backend` | **Yes** | Secret key used to sign JWT tokens and encrypt service booking OTPs (`AES-256-GCM`). |
| `CLOUDINARY_CLOUD_NAME` | `backend` | **Yes** | Cloudinary cloud name (enforced on startup in `src/config/validation.ts`). |
| `CLOUDINARY_API_KEY` | `backend` | **Yes** | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | `backend` | **Yes** | Cloudinary API secret. |
| `CLOUDINARY_PRODUCT_FOLDER` | `backend` | **Yes** | Cloudinary folder name (e.g., `yoga_ecommerce`). |
| `FRONTEND_URL` | `backend` | **Yes** | Allowed CORS origin(s) (comma-separated if multiple) & customer email link base. |
| `NEXT_PUBLIC_API_URL` | `frontend` | **Yes** | Public backend API base URL including `/api/v1` (e.g. `http://localhost:4000/api/v1`). |
| `INTERNAL_API_URL` | `frontend` | **Yes** | Internal API URL for Next.js SSR (`http://backend:4000/api/v1` in Docker, `http://localhost:4000/api/v1` locally). |
| `RAZORPAY_KEY_ID` | `backend` | For Payments | Razorpay API Key ID. |
| `RAZORPAY_KEY_SECRET` | `backend` | For Payments | Razorpay API Key Secret (backend only). |
| `RAZORPAY_WEBHOOK_SECRET` | `backend` | For Webhooks | Secret for verifying `x-razorpay-signature` on `/api/v1/payments/webhook`. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `frontend` | For Payments | Public Razorpay Key ID exposed to the browser checkout modal. |
| `MAIL_*` / `ADMIN_EMAIL` | `backend` | Optional (Dev) / **Yes (Prod)** | SMTP credentials for sending order, shipment, and service booking emails. |
| `SEED_ADMIN_*` | `backend` | Optional | If `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, and `SEED_ADMIN_PASSWORD` are set, `npm run db:seed` creates/updates the admin account. |

> **Payment Currency & Webhook Note:** The application stores catalog and order totals in **USD**. The frontend-selected currency and exchange rate are sent with each payment-order request, and the backend calculates the gateway amount from the stored order total. Configure your Razorpay webhook URL as `https://your-api-host/api/v1/payments/webhook` and subscribe to `payment.captured`, `payment.failed`, and `order.paid`.

---

## 2. How to Start the Project

### Method 1: Start with Docker Compose (Recommended)

1. Ensure your root **`.env`** file is configured (see **Option A** above).
2. Build and start all services (`postgres`, `backend`, and `frontend`):

```bash
docker compose up --build
```

3. **(Optional) Seed Initial Data** (categories, products, combos, trainers, services, and optional admin user) in a second terminal while containers are running:

```bash
docker compose exec backend npm run db:seed
```

4. To stop the containers:

```bash
docker compose down
```

#### Production Docker Compose

To run the production stack (`Dockerfile.prod`):

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

---

### Method 2: Start Locally Without Docker

#### Step 1: Start PostgreSQL
Ensure a PostgreSQL 17 server is running on port `5432` and has a database named `yoga_ecommerce` (or start only the database via Docker: `docker compose up -d postgres`).

#### Step 2: Set Up & Start the Backend
Open a terminal in the `backend/` folder:

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Generate Prisma Client & apply database migrations
npx prisma generate
npx prisma migrate deploy

# 3. (Optional) Seed sample catalog data & admin/trainer accounts
npm run db:seed

# 4. Start the NestJS server in watch mode
npm run start:dev
```

#### Step 3: Set Up & Start the Frontend
Open a second terminal in the `frontend/` folder:

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start the Next.js development server
npm run dev
```

---

## 3. Application URLs

Once the project is running (with default ports `3000` and `4000`):

- **Storefront (Customer UI):** `http://localhost:3000`
- **Admin Dashboard:** `http://localhost:3000/admin`
- **Trainer Portal:** `http://localhost:3000/trainer`
- **Backend REST API Base:** `http://localhost:4000/api/v1`
- **Swagger API Documentation:** `http://localhost:4000/api/v1/docs`

---

## 4. Useful Commands

### Backend (`./backend`)

| Command | Description |
| :--- | :--- |
| `npm run start:dev` | Start NestJS in development watch mode |
| `npm run build` | Generate Prisma client and build the NestJS project |
| `npm run prisma:generate` | Regenerate the Prisma client |
| `npx prisma migrate dev` | Create and apply a new Prisma migration in development |
| `npx prisma migrate deploy` | Apply pending Prisma migrations |
| `npm run db:seed` | Seed categories, products, services, trainers, and admin user |
| `npm test` | Run backend unit tests with Vitest |
| `npm run test:e2e` | Run backend end-to-end tests |

### Frontend (`./frontend`)

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build production Next.js bundle |
| `npm run start` | Start built production Next.js server |
| `npm run lint` | Run ESLint checks |
