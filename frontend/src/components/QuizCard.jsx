import { Link } from 'react-router-dom'

export default function QuizCard({ quiz }) {
  return (
    <Link to={`/quiz/${quiz.slug}`} className="quiz-card">
      <span className="eyebrow eyebrow-muted">{quiz.category}</span>
      <h3>{quiz.title}</h3>
      <p className="desc">{quiz.description}</p>
      <div className="card-meta">
        <span className="pill">
          <span className={`pill-dot ${quiz.difficulty}`} />
          {quiz.difficulty}
        </span>
        <span className="pill">{quiz.question_count} questions</span>
        <span className="pill">~{quiz.estimated_minutes} min</span>
      </div>
      <div className="card-footer">
        <span>
          {quiz.attempt_count} attempt{quiz.attempt_count === 1 ? '' : 's'} · avg {quiz.avg_score_pct}%
        </span>
        <span className="card-cta">Start quiz →</span>
      </div>
    </Link>
  )
}
