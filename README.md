# Yoga E-commerce

## Technology Stack

- Next.js, TypeScript, Tailwind CSS, and App Router
- NestJS and TypeScript
- PostgreSQL
- Docker and Docker Compose

## Project Structure

```text
frontend/          Next.js application
backend/           NestJS application
docker-compose.yml Docker Compose services
.env.example       Environment variable template
```

## Prerequisites

- Node.js 24 or later
- npm
- Docker with Docker Compose

## Configure Environment

Copy `.env.example` to `.env` and update the local values as needed.

For Razorpay test payments, configure these backend variables and expose only the public key to the frontend:

```env
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

The application stores catalog/order totals in USD. The frontend-selected currency and exchange rate are sent with each payment-order request, and the backend calculates the gateway amount from the stored order total. Configure the Razorpay webhook URL as `https://your-api-host/api/v1/payments/webhook` and subscribe to `payment.captured`, `payment.failed`, and `order.paid`.

## Start the Project

```bash
docker compose up --build
```

## Stop the Containers

```bash
docker compose down
```
