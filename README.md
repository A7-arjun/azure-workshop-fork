# QuizLab — Three-Tier Reference Application

A quiz platform for teams, built as a clean three-tier application for the Azure
deployment workshop. Answers are graded server-side, every attempt is persisted
in PostgreSQL, and leaderboards keep it competitive.

## Architecture

```
┌─────────────────────┐        ┌──────────────────────┐        ┌─────────────────┐
│  PRESENTATION TIER  │  /api  │   APPLICATION TIER   │  SQL   │    DATA TIER    │
│                     │ ─────► │                      │ ─────► │                 │
│  React 19 (Vite)    │  JSON  │  Node.js + Express   │  pg    │  PostgreSQL 18  │
│  localhost:5173     │        │  localhost:4000      │        │  db: quizlab    │
└─────────────────────┘        └──────────────────────┘        └─────────────────┘
```

During development, the Vite dev proxy forwards `/api/*` from port 5173 to port
4000, so the browser stays same-origin (no CORS). In production, point the
frontend at the API's public base URL or host both behind one domain.

## Project layout

```
backend/    Express REST API
  src/server.js      entrypoint (CORS, JSON parsing, error handling)
  src/routes.js      all /api endpoints
  src/db.js          pg connection pool
  db/schema.sql      tables + indexes
  db/setup.js        create DB, apply schema, seed content
  db/seed-data.js    quiz content (4 tracks, 27 questions)
frontend/   React SPA
  src/pages/         Home, QuizPage (run + results), Leaderboard, 404
  src/components/    Header, Footer (API health), QuizCard
  src/api.js         fetch wrapper + formatters
  src/index.css      design system (palette & fonts from brainfloss.com)
```

## Run it locally

Prereqs: Node 20+, PostgreSQL running on localhost:5432.

```bash
# 1. Database — create schema and seed (safe to re-run)
cd backend
npm install
npm run db:setup

# 2. API
npm run dev            # http://localhost:4000

# 3. Frontend (new terminal)
cd ../frontend
npm install
npm run dev            # http://localhost:5173
```

Connection string lives in `backend/.env` (copy from `.env.example`):

```
PORT=4000
DATABASE_URL=postgres://localhost:5432/quizlab
```

Open **http://localhost:5173**, pick a track, enter your name and play. Verify
the whole chain is alive at http://localhost:4000/api/health.

## API reference

| Method | Endpoint                        | Purpose                                      |
| ------ | ------------------------------- | -------------------------------------------- |
| GET    | `/api/health`                   | Liveness probe incl. DB check (Azure-ready)  |
| GET    | `/api/stats`                    | Aggregate counts + average score             |
| GET    | `/api/quizzes`                  | All tracks with stats (JOIN + GROUP BY)      |
| GET    | `/api/quizzes/:slug`            | One quiz; correct answers are withheld       |
| POST   | `/api/quizzes/:slug/attempts`   | Validate + grade + persist an attempt        |
| GET    | `/api/quizzes/:slug/leaderboard`| Top 10: score DESC, time ASC                 |

## Data model

- **quizzes** — slug, title, description, category, difficulty, estimated time
- **questions** — prompt, `options JSONB`, `correct_index`, explanation, position
- **attempts** — player name, score, total, duration, timestamp

## Reset the demo

```bash
psql postgres -c 'DROP DATABASE quizlab' && cd backend && npm run db:setup
```

## Deploying to Azure (workshop outline)

1. **Data tier** — Azure Database for PostgreSQL (Flexible Server); allow the
   App Service outbound IP, set `DATABASE_URL` accordingly.
2. **Application tier** — App Service (or Container Apps) running
   `npm ci && npm start` from `backend/`; configure the health check path to
   `/api/health`.
3. **Presentation tier** — Azure Static Web Apps with `npm run build` from
   `frontend/`, output `dist`; set `VITE_API_URL` or route `/api` to the App
   Service.

## Design

Palette and typography follow brainfloss.com: ink `#14100f`, brand red
`#ff3939`, body text `#3a3330`, muted surfaces `#f4f4f5`, borders `#e4e0de`;
Poppins for headings, Instrument Sans for body.
