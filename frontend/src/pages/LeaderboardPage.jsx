import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatDuration, formatDate } from '../api.js'

export default function LeaderboardPage() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .leaderboard(slug)
      .then(setData)
      .catch((err) => setError(err.message))
  }, [slug])

  if (error) {
    return (
      <div className="lb-shell">
        <Link to="/" className="back-link">← All tracks</Link>
        <div className="error-card" style={{ marginTop: 24 }} role="alert">
          <h3>Could not load leaderboard</h3>
          <p>{error}</p>
          <Link to="/" className="btn btn-outline btn-sm">Back home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="lb-shell">
      <Link to="/" className="back-link">← All tracks</Link>
      <div className="lb-header">
        {data && (
          <>
            <span className="eyebrow eyebrow-muted">Leaderboard · {data.quiz.category}</span>
            <h1>{data.quiz.title}</h1>
            <div className="card-meta">
              <span className="pill">
                <span className={`pill-dot ${data.quiz.difficulty}`} />
                {data.quiz.difficulty}
              </span>
              <span className="pill">{data.quiz.estimated_minutes} min</span>
            </div>
          </>
        )}
        {!data && <span className="skeleton" style={{ width: 260, height: 30, marginTop: 12 }} />}
      </div>

      {data && data.entries.length === 0 && (
        <div className="empty-card">
          <h3>No attempts yet</h3>
          <p>Be the first name on this board.</p>
          <Link to={`/quiz/${slug}`} className="btn btn-primary btn-sm">Take the quiz</Link>
        </div>
      )}

      {data && data.entries.length > 0 && (
        <div className="table-wrap">
          <table className="lb-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Score</th>
                <th>Time</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.map((entry, i) => (
                <tr key={entry.id}>
                  <td>
                    <span className={`rank ${i < 3 ? 'top' : ''}`}>{i + 1}</span>
                  </td>
                  <td className="lb-name">{entry.player_name}</td>
                  <td>
                    <span className="lb-score">
                      <strong>{entry.pct}%</strong>
                      <span className="scorebar" aria-hidden="true">
                        <span className="scorebar-fill" style={{ width: `${entry.pct}%` }} />
                      </span>
                      <span style={{ color: 'var(--soft)', fontSize: 13 }}>
                        {entry.score}/{entry.total}
                      </span>
                    </span>
                  </td>
                  <td>{formatDuration(entry.duration_seconds)}</td>
                  <td className="lb-when">{formatDate(entry.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.entries.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <Link to={`/quiz/${slug}`} className="btn btn-primary btn-sm">Beat the top score</Link>
        </div>
      )}
    </div>
  )
}
