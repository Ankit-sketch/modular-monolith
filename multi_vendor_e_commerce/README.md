## To read the learnings during this project creation you can check out the readme.md which is placed outside this multi_vendor_e_commerce folder or to the very root of the Project.

## Project setup for Development

```bash
$ npm install
```

## Setup

# Local Development Setup

## 1. Clone Repository

```bash
git clone <repo-url>
```

---

## 2. Install Dependencies

```bash
npm install
```

This automatically generates Prisma client.

---

## 3. Configure Environment Variables

Create `.env`

Example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/app_db

JWT_SECRET=your-secret
```

---

## 4. Run Database Migrations

```bash
npx prisma migrate dev
```

This:

- creates DB tables
- applies migrations
- synchronizes schema

---

## 5. Start Development Server

```bash
npm run dev
```

---

# Optional One Command Setup

```bash
npm run start:dev:setup
```

This automatically:

- installs dependencies
- generates Prisma client
- applies migrations
- starts development server

```

```

## 6. Start Docker if you are using Postgres, Redis, PGADMIN client and Redis Client inside docker as an client to see your databse

```bash
if you are inside "multi_vendor_e_commerce" folder then run docker compose -f ../infrastructure/docker-compose-dev.yaml up -d
```

---
