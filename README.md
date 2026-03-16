# TaskFlow — Personal Task Management System

A full-stack task management application built with **Node.js + Express** (backend) and **Next.js 14** (frontend).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend runtime | Node.js 20+ / TypeScript 5 |
| Backend framework | Express.js |
| ORM | Prisma |
| Database | PostgreSQL 16 |
| Auth | JWT (access + refresh token rotation) |
| Validation | Zod |
| Frontend framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Server state | TanStack Query v5 |
| Auth state | Zustand |
| Forms | React Hook Form + Zod |
| HTTP client | Axios (with silent token refresh interceptor) |
| Toasts | react-hot-toast |

---

## Project Structure

```
taskflow/
├── backend/          # Express REST API
├── frontend/         # Next.js web app
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## Quick Start

### Option A — Docker Compose (recommended)

```bash
# Clone and start everything
git clone <repo-url> taskflow && cd taskflow
docker-compose up --build

# In a separate terminal, run migrations + seed
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npx prisma db seed
```

Open: http://localhost:3000  
Demo login: `demo@taskflow.dev` / `Demo@1234`

---

### Option B — Manual (separate terminals)

#### 1. Database
```bash
# Requires PostgreSQL running locally
createdb taskflow
```

#### 2. Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT secrets

npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
# → http://localhost:4000
```

#### 3. Frontend
```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

npm install
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
JWT_ACCESS_SECRET="at-least-32-characters-long"
JWT_REFRESH_SECRET="different-secret-at-least-32-chars"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```

---

## API Reference

Base URL: `http://localhost:4000/api/v1`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Get access + refresh token |
| POST | `/auth/refresh` | Rotate tokens (uses httpOnly cookie) |
| POST | `/auth/logout` | Invalidate refresh token |

### Tasks (all require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | List tasks (paginated, filterable) |
| POST | `/tasks` | Create task |
| GET | `/tasks/:id` | Get single task |
| PATCH | `/tasks/:id` | Update task |
| PATCH | `/tasks/:id/toggle` | Cycle status |
| DELETE | `/tasks/:id` | Delete task |

Query params for `GET /tasks`: `page`, `limit`, `status`, `search`

---

## Running Tests

```bash
# Backend unit tests
cd backend && npm test

# Frontend component tests
cd frontend && npm test

# With coverage
cd backend && npm test -- --coverage
```

---

## Database Management

```bash
cd backend

# Create a new migration
npx prisma migrate dev --name <description>

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (GUI)
npx prisma studio

# Reset database (dev only)
npx prisma migrate reset
```

---

## Security Model

- **Passwords** hashed with bcrypt (12 rounds)
- **Access tokens** (15 min) stored in JS memory — never localStorage
- **Refresh tokens** (7 days) stored in `httpOnly, Secure, SameSite=Strict` cookie
- **Refresh token rotation** — old token invalidated on every `/auth/refresh`
- **Token hashing** — only SHA-256 hash stored in database
- **IDOR prevention** — all task queries scoped to `userId` from JWT
- **Rate limiting** — 10 req / 15 min on `/auth/*`
- **Helmet.js** — security headers on all responses

---

## Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
```

### Backend → Railway / Render
1. Set all environment variables from `backend/.env.example`
2. Push image or connect your repo
3. Run `npx prisma migrate deploy` on first deploy

### Database → Neon / Supabase
Both offer free PostgreSQL tiers compatible with this Prisma setup.

---

## Roadmap

- **v1.1** — Task categories, due-date reminders, keyboard shortcuts
- **v1.5** — Dark mode, OAuth (Google/GitHub), PWA support
- **v2.0** — Team workspaces, task assignments, comments, webhooks
