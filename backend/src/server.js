import express from 'express'
import cors from 'cors'
import { router } from './routes.js'
import { pool } from './db.js'

const app = express()
const PORT = Number(process.env.PORT) || 4000

app.use(cors())
app.use(express.json({ limit: '100kb' }))

app.use('/api', router)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const server = app.listen(PORT, () => {
  console.log(`quizlab api listening on http://localhost:${PORT}`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => pool.end().then(() => process.exit(0)))
  })
}
