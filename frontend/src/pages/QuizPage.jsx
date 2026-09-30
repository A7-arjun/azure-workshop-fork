import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatDuration } from '../api.js'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const RING_RADIUS = 64
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

function verdictFor(pct) {
  if (pct === 100) return 'Perfect run.'
  if (pct >= 80) return 'Strong result.'
  if (pct >= 60) return 'Solid effort.'
  if (pct >= 40) return 'Getting there.'
  return 'Room to grow.'
}

function MetaPills({ quiz }) {
  return (
    <div className="card-meta">
      <span className="pill">
        <span className={`pill-dot ${quiz.difficulty}`} />
        {quiz.difficulty}
      </span>
      <span className="pill">{quiz.questions.length} questions</span>
      <span className="pill">~{quiz.estimated_minutes} min</span>
      <span className="pill">{quiz.category}</span>
    </div>
  )
}

function Intro({ quiz, name, setName, onStart }) {
  return (
    <>
      <Link to="/" className="back-link">← All tracks</Link>
      <div className="intro-card">
        <span className="eyebrow eyebrow-muted">{quiz.category}</span>
        <h1>{quiz.title}</h1>
        <p className="desc">{quiz.description}</p>
        <div className="intro-meta">
          <MetaPills quiz={quiz} />
        </div>
        <hr className="intro-divider" />
        <div className="field">
          <label htmlFor="player-name">Your name — for the leaderboard</label>
          <div className="start-row">
            <input
              id="player-name"
              className="input"
              placeholder="e.g. Alex"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && onStart()}
              autoFocus
            />
            <button className="btn btn-primary" onClick={onStart} disabled={!name.trim()}>
              Start quiz
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function Results({ quiz, result, playerName, duration, onRetake }) {
  const detailMap = new Map(result.details.map((d) => [d.question_id, d]))

  return (
    <>
      <div className="result-hero">
        <div className="score-ring" role="img" aria-label={`Score ${result.pct} percent`}>
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle className="track" cx="75" cy="75" r={RING_RADIUS} />
            <circle
              className="value"
              cx="75"
              cy="75"
              r={RING_RADIUS}
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - result.pct / 100)}
            />
          </svg>
          <div className="score-center">
            <span className="score-number">
              {result.pct}
              <span>%</span>
            </span>
            <span className="score-caption">score</span>
          </div>
        </div>
        <h2 className="verdict">{verdictFor(result.pct)}</h2>
        <p className="result-sub">
          {playerName}, you answered {result.score} of {result.total} correctly · ranked #{result.rank} on
          the leaderboard · {formatDuration(duration)}
        </p>
      </div>

      <div className="result-actions">
        <Link to={`/leaderboard/${quiz.slug}`} className="btn btn-primary">View leaderboard</Link>
        <button className="btn btn-outline" onClick={onRetake}>Retake quiz</button>
        <Link to="/" className="btn btn-ghost">All tracks</Link>
      </div>

      <h3 className="review-heading">Review your answers</h3>
      {quiz.questions.map((question, i) => {
        const detail = detailMap.get(question.id)
        if (!detail) return null
        const correct = detail.selected_index === detail.correct_index
        return (
          <article className="review-item" key={question.id}>
            <div className="review-head">
              <span className={`badge ${correct ? 'badge-correct' : 'badge-wrong'}`}>
                {correct ? '✓ Correct' : '✕ Incorrect'}
              </span>
              <span className="eyebrow eyebrow-muted">Question {i + 1}</span>
            </div>
            <p className="review-prompt">{question.prompt}</p>
            {question.options.map((option, idx) => {
              const isCorrect = idx === detail.correct_index
              const isWrongPick = idx === detail.selected_index && !correct
              const cls = isCorrect
                ? 'review-option is-correct'
                : isWrongPick
                  ? 'review-option is-wrong'
                  : 'review-option is-dim'
              const tag = isCorrect ? (correct ? 'Your answer · correct' : 'Correct answer') : isWrongPick ? 'Your answer' : null
              return (
                <div className={cls} key={idx}>
                  <span className="option-letter">{LETTERS[idx]}</span>
                  <span>{option}</span>
                  {tag && <span className="review-tag">{tag}</span>}
                </div>
              )
            })}
            {detail.explanation && (
              <div className="explanation">
                <span className="eyebrow">Explanation</span>
                {detail.explanation}
              </div>
            )}
          </article>
        )
      })}
    </>
  )
}

export default function QuizPage() {
  const { slug } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [error, setError] = useState(null)
  const [phase, setPhase] = useState('loading') // loading | intro | running | submitting | done
  const [playerName, setPlayerName] = useState('')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [duration, setDuration] = useState(0)
  const startedAt = useRef(null)

  useEffect(() => {
    setQuiz(null)
    setError(null)
    setPhase('loading')
    api
      .quiz(slug)
      .then((q) => {
        setQuiz(q)
        setPhase('intro')
      })
      .catch((err) => setError(err.message))
  }, [slug])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const start = () => {
    startedAt.current = Date.now()
    setCurrent(0)
    setAnswers({})
    setPhase('running')
    scrollTop()
  }

  const select = (questionId, index) => {
    setAnswers((prev) => ({ ...prev, [questionId]: index }))
  }

  const submit = () => {
    setPhase('submitting')
    const seconds = Math.round((Date.now() - startedAt.current) / 1000)
    api
      .submitAttempt(slug, {
        player_name: playerName.trim(),
        duration_seconds: seconds,
        answers: quiz.questions.map((q) => ({ question_id: q.id, selected_index: answers[q.id] })),
      })
      .then((r) => {
        setDuration(seconds)
        setResult(r)
        setPhase('done')
        scrollTop()
      })
      .catch((err) => {
        setError(err.message)
        setPhase('running')
      })
  }

  if (error) {
    return (
      <div className="quiz-shell">
        <Link to="/" className="back-link">← All tracks</Link>
        <div className="error-card" style={{ marginTop: 24 }} role="alert">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <Link to="/" className="btn btn-outline btn-sm">Back home</Link>
        </div>
      </div>
    )
  }

  if (phase === 'loading' || !quiz) {
    return (
      <div className="quiz-shell">
        <span className="back-link">← All tracks</span>
        <div className="status-card">
          <div className="spinner" />
          <p>Loading quiz…</p>
        </div>
      </div>
    )
  }

  if (phase === 'intro') {
    return <div className="quiz-shell"><Intro quiz={quiz} name={playerName} setName={setPlayerName} onStart={start} /></div>
  }

  if (phase === 'submitting') {
    return (
      <div className="quiz-shell">
        <div className="status-card">
          <div className="spinner" />
          <p>Grading your answers against PostgreSQL…</p>
        </div>
      </div>
    )
  }

  if (phase === 'done' && result) {
    return (
      <div className="quiz-shell">
        <Results quiz={quiz} result={result} playerName={playerName.trim()} duration={duration} onRetake={start} />
      </div>
    )
  }

  // running
  const question = quiz.questions[current]
  const total = quiz.questions.length
  const answeredCount = Object.keys(answers).length
  const currentAnswered = answers[question.id] !== undefined
  const isLast = current === total - 1

  return (
    <div className="quiz-shell">
      <div className="quiz-top">
        <Link to="/" className="back-link" onClick={(e) => { if (!window.confirm('Leave the quiz? Your progress will be lost.')) e.preventDefault() }}>
          ← Exit
        </Link>
        <span className="eyebrow eyebrow-muted">Question {current + 1} of {total}</span>
      </div>
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answeredCount}>
        <div className="progress-fill" style={{ width: `${(answeredCount / total) * 100}%` }} />
      </div>

      <div className="question-card">
        <h2 className="question-prompt">{question.prompt}</h2>
        <div className="options">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              className={`option ${answers[question.id] === idx ? 'selected' : ''}`}
              onClick={() => select(question.id, idx)}
              aria-pressed={answers[question.id] === idx}
            >
              <span className="option-letter">{LETTERS[idx]}</span>
              <span>{option}</span>
            </button>
          ))}
        </div>

        <div className="quiz-nav">
          <button className="btn btn-ghost" onClick={() => setCurrent((c) => c - 1)} disabled={current === 0}>
            ← Back
          </button>
          {isLast ? (
            <button className="btn btn-primary" onClick={submit} disabled={!currentAnswered}>
              Submit answers
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setCurrent((c) => c + 1)} disabled={!currentAnswered}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
