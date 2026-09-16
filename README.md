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

## Start the Project

```bash
docker compose up --build
```

## Stop the Containers

```bash
docker compose down
```
