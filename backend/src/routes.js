import { Router } from 'express'
import { query } from './db.js'

export const router = Router()

const QUIZ_COLUMNS = 'q.id, q.slug, q.title, q.description, q.category, q.difficulty, q.estimated_minutes'

// Simple liveness/readiness probe — used by the frontend status bar and
// suitable for Azure App Service health checks.
router.get('/health', async (_req, res) => {
  try {
    await query('SELECT 1')
    res.json({ status: 'ok', database: 'up' })
  } catch {
    res.status(503).json({ status: 'degraded', database: 'down' })
  }
})

// Aggregate stats for the hero panel.
router.get('/stats', async (_req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT (SELECT COUNT(*)::int FROM quizzes)          AS quiz_count,
             (SELECT COUNT(*)::int FROM questions)        AS question_count,
             (SELECT COUNT(*)::int FROM attempts)         AS attempt_count,
             (SELECT COALESCE(ROUND(AVG(score::numeric / total * 100)), 0)::int
                FROM attempts)                            AS avg_score_pct`)
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

// All quizzes with question counts and attempt statistics.
router.get('/quizzes', async (_req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT ${QUIZ_COLUMNS},
             COUNT(DISTINCT que.id)::int                                   AS question_count,
             COUNT(DISTINCT att.id)::int                                   AS attempt_count,
             COALESCE(ROUND(AVG(att.score::numeric / att.total * 100)), 0)::int AS avg_score_pct
      FROM quizzes q
      LEFT JOIN questions que ON que.quiz_id = q.id
      LEFT JOIN attempts  att ON att.quiz_id = q.id
      GROUP BY q.id
      ORDER BY q.created_at, q.id`)
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

// One quiz with its questions. Correct answers are intentionally withheld —
// grading happens server-side on submit.
router.get('/quizzes/:slug', async (req, res, next) => {
  try {
    const { rows } = await query(`SELECT ${QUIZ_COLUMNS} FROM quizzes q WHERE q.slug = $1`, [req.params.slug])
    if (rows.length === 0) return res.status(404).json({ error: 'Quiz not found' })

    const quiz = rows[0]
    const questions = await query(
      `SELECT id, prompt, options, position
       FROM questions WHERE quiz_id = $1 ORDER BY position`,
      [quiz.id],
    )

    res.json({
      ...quiz,
      questions: questions.rows.map((q) => ({ ...q, options: q.options })),
    })
  } catch (err) {
    next(err)
  }
})

// Submit an attempt: validates the payload, grades it against the database,
// persists the score and returns a full review.
router.post('/quizzes/:slug/attempts', async (req, res, next) => {
  try {
    const { rows } = await query(`SELECT id, title FROM quizzes WHERE slug = $1`, [req.params.slug])
    if (rows.length === 0) return res.status(404).json({ error: 'Quiz not found' })
    const quiz = rows[0]

    const playerName = String(req.body?.player_name ?? '').trim()
    const answers = req.body?.answers
    const durationSeconds = Math.max(0, Math.min(86_400, Number(req.body?.duration_seconds) || 0))

    if (playerName.length < 1 || playerName.length > 40) {
      return res.status(400).json({ error: 'player_name must be between 1 and 40 characters' })
    }
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers must be an array' })
    }

    const questions = await query(
      `SELECT id, correct_index, explanation, jsonb_array_length(options) AS option_count
       FROM questions WHERE quiz_id = $1 ORDER BY position`,
      [quiz.id],
    )

    const byId = new Map(questions.rows.map((q) => [q.id, q]))
    const submitted = new Map()
    for (const a of answers) {
      const q = byId.get(a?.question_id)
      const sel = Number(a?.selected_index)
      if (!q || !Number.isInteger(sel) || sel < 0 || sel >= q.option_count || submitted.has(q.id)) {
        return res.status(400).json({ error: 'Every question needs exactly one valid selected option' })
      }
      submitted.set(q.id, sel)
    }
    if (submitted.size !== byId.size) {
      return res.status(400).json({ error: `All ${byId.size} questions must be answered` })
    }

    const details = []
    let score = 0
    for (const q of questions.rows) {
      const selected = submitted.get(q.id)
      const correct = selected === q.correct_index
      if (correct) score += 1
      details.push({ question_id: q.id, selected_index: selected, correct_index: q.correct_index, explanation: q.explanation })
    }

    const total = byId.size
    const attempt = await query(
      `INSERT INTO attempts (quiz_id, player_name, score, total, duration_seconds)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [quiz.id, playerName, score, total, durationSeconds],
    )

    const rank = await query(
      `SELECT COUNT(*) + 1::int AS rank FROM attempts
       WHERE quiz_id = $1 AND (score > $2 OR (score = $2 AND duration_seconds < $3))`,
      [quiz.id, score, durationSeconds],
    )

    res.status(201).json({
      attempt_id: attempt.rows[0].id,
      player_name: playerName,
      score,
      total,
      pct: Math.round((score / total) * 100),
      rank: rank.rows[0].rank,
      details,
    })
  } catch (err) {
    next(err)
  }
})

// Top 10 attempts for a quiz: score desc, then fastest, then earliest.
router.get('/quizzes/:slug/leaderboard', async (req, res, next) => {
  try {
    const quiz = await query(`SELECT ${QUIZ_COLUMNS} FROM quizzes q WHERE q.slug = $1`, [req.params.slug])
    if (quiz.rows.length === 0) return res.status(404).json({ error: 'Quiz not found' })

    const { rows } = await query(
      `SELECT a.id, a.player_name, a.score, a.total,
              ROUND(a.score::numeric / a.total * 100)::int AS pct,
              a.duration_seconds, a.created_at
       FROM attempts a
       WHERE a.quiz_id = $1
       ORDER BY a.score DESC, a.duration_seconds ASC, a.created_at ASC
       LIMIT 10`,
      [quiz.rows[0].id],
    )
    res.json({ quiz: quiz.rows[0], entries: rows })
  } catch (err) {
    next(err)
  }
})
