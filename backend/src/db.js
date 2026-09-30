import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/quizlab'

export const pool = new pg.Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
})

export function query(text, params) {
  return pool.query(text, params)
}
