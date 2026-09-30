import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import QuizCard from '../components/QuizCard.jsx'

function QuizCardSkeleton() {
  return (
    <div className="quiz-card" aria-hidden="true">
      <span className="skeleton" style={{ width: 72, height: 12 }} />
      <span className="skeleton" style={{ width: '55%', height: 22 }} />
      <span className="skeleton" style={{ width: '100%', height: 14 }} />
      <span className="skeleton" style={{ width: '88%', height: 14 }} />
      <div className="card-footer">
        <span className="skeleton" style={{ width: 140, height: 13 }} />
        <span className="skeleton" style={{ width: 90, height: 13 }} />
      </div>
    </div>
  )
}

export default function Home() {
  const [quizzes, setQuizzes] = useState(null)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  const load = () => {
    setError(null)
    Promise.all([api.quizzes(), api.stats()])
      .then(([q, s]) => {
        setQuizzes(q)
        setStats(s)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(load, [])

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow eyebrow-red">Team learning</span>
            <h1>Training that sticks, measured in points.</h1>
            <p className="hero-copy">
              Short, focused quizzes on cloud, engineering and data. Answers are graded server-side, every
              attempt lands in PostgreSQL, and the leaderboard keeps it honest.
            </p>
            <div className="hero-actions">
              <a href="#tracks" className="btn btn-primary">Browse tracks</a>
              <Link to="/quiz/azure-fundamentals" className="btn btn-outline">Take the Azure quiz</Link>
            </div>
          </div>
          <div className="hero-panel">
            <span className="eyebrow">Live from PostgreSQL</span>
            <div className="panel-stats">
              <div>
                <div className="stat-value">{stats ? stats.quiz_count : '—'}</div>
                <div className="stat-label">tracks</div>
              </div>
              <div>
                <div className="stat-value">{stats ? stats.question_count : '—'}</div>
                <div className="stat-label">questions</div>
              </div>
              <div>
                <div className="stat-value">{stats ? stats.attempt_count : '—'}</div>
                <div className="stat-label">attempts</div>
              </div>
            </div>
            <div className="panel-footnote">
              <span>
                Average score <strong>{stats ? `${stats.avg_score_pct}%` : '…'}</strong>
              </span>
              <span>React → Express → Postgres</span>
            </div>
          </div>
        </div>
      </section>

      <section className="tracks container" id="tracks">
        <div className="section-heading">
          <h2>Choose a track</h2>
          <p>Every track is a full round trip: React form, Express endpoint, SQL row.</p>
        </div>

        {error && (
          <div className="error-card" role="alert">
            <h3>Could not load quizzes</h3>
            <p>{error}</p>
            <button className="btn btn-primary btn-sm" onClick={load}>Try again</button>
          </div>
        )}

        {!error && (
          <div className="tracks-grid">
            {quizzes
              ? quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
              : Array.from({ length: 4 }).map((_, i) => <QuizCardSkeleton key={i} />)}
          </div>
        )}
      </section>
    </>
  )
}
