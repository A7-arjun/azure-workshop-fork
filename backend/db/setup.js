// Creates the quizlab database (if missing), applies db/schema.sql and
// seeds it when empty. Safe to re-run: node db/setup.js
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'
import dotenv from 'dotenv'
import { seedData } from './seed-data.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const schemaSql = readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')

const baseConfig = {
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || undefined, // falls back to OS username
  password: process.env.PGPASSWORD || undefined,
}

const DB_NAME = (() => {
  const url = process.env.DATABASE_URL
  if (!url) return 'quizlab'
  return new URL(url).pathname.replace(/^\//, '') || 'quizlab'
})()

async function ensureDatabase() {
  const client = new pg.Client({ ...baseConfig, database: 'postgres' })
  await client.connect()
  const exists = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME])
  if (exists.rowCount === 0) {
    await client.query(`CREATE DATABASE "${DB_NAME}"`)
    console.log(`created database "${DB_NAME}"`)
  } else {
    console.log(`database "${DB_NAME}" already exists`)
  }
  await client.end()
}

async function applySchema(client) {
  await client.query(schemaSql)
  console.log('schema applied')
}

async function seedIfEmpty(client) {
  const { rows } = await client.query('SELECT COUNT(*)::int AS n FROM quizzes')
  if (rows[0].n > 0) {
    console.log(`already seeded (${rows[0].n} quizzes) — skipping`)
    return
  }

  for (const quiz of seedData) {
    const inserted = await client.query(
      `INSERT INTO quizzes (slug, title, description, category, difficulty, estimated_minutes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [quiz.slug, quiz.title, quiz.description, quiz.category, quiz.difficulty, quiz.estimated_minutes],
    )
    const quizId = inserted.rows[0].id

    let position = 1
    for (const q of quiz.questions) {
      await client.query(
        `INSERT INTO questions (quiz_id, prompt, options, correct_index, explanation, position)
         VALUES ($1, $2, $3::jsonb, $4, $5, $6)`,
        [quizId, q.prompt, JSON.stringify(q.options), q.correct_index, q.explanation, position++],
      )
    }
    console.log(`seeded "${quiz.slug}" with ${quiz.questions.length} questions`)
  }

  // A few demo attempts so the leaderboard and stats look alive on first run.
  const demoAttempts = [
    ['azure-fundamentals', 'Priya', 8, 8, 96],
    ['azure-fundamentals', 'Tom', 6, 8, 141],
    ['azure-fundamentals', 'Aisha', 7, 8, 122],
    ['cloud-core-concepts', 'Tom', 5, 6, 88],
    ['cloud-core-concepts', 'Daniel', 4, 6, 97],
    ['web-dev-essentials', 'Aisha', 7, 7, 165],
    ['web-dev-essentials', 'Priya', 6, 7, 178],
    ['databases-and-sql', 'Daniel', 5, 6, 110],
  ]
  for (const [slug, name, score, total, seconds] of demoAttempts) {
    await client.query(
      `INSERT INTO attempts (quiz_id, player_name, score, total, duration_seconds)
       SELECT id, $2, $3, $4, $5 FROM quizzes WHERE slug = $1`,
      [slug, name, score, total, seconds],
    )
  }
  console.log(`inserted ${demoAttempts.length} demo attempts`)
}

async function main() {
  await ensureDatabase()
  const client = new pg.Client({ ...baseConfig, database: DB_NAME })
  await client.connect()
  try {
    await applySchema(client)
    await seedIfEmpty(client)
    const stats = await client.query(`
      SELECT (SELECT COUNT(*) FROM quizzes) AS quizzes,
             (SELECT COUNT(*) FROM questions) AS questions,
             (SELECT COUNT(*) FROM attempts) AS attempts`)
    const s = stats.rows[0]
    console.log(`ready: ${s.quizzes} quizzes, ${s.questions} questions, ${s.attempts} attempts`)
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error('setup failed:', err.message)
  process.exit(1)
})
