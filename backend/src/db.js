import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/quizlab'

// Managed Postgres (Azure Database for PostgreSQL, RDS, etc.) enforces SSL
// with a certificate `pg` won't validate against Node's default trust store.
// Enable SSL for any non-local host rather than relying on driver defaults.
const { hostname } = new URL(connectionString)
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1'

export const pool = new pg.Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  ssl: isLocal ? undefined : { rejectUnauthorized: false },
})

export function query(text, params) {
  return pool.query(text, params)
}
