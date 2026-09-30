import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <>
      <div className="announcement">
        <span className="tag">Azure workshop</span>
        <span>Three-tier reference app · React · Express · PostgreSQL</span>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="QuizLab home">
            <span className="brand-mark" aria-hidden="true">Q</span>
            <span>
              quizlab<span className="brand-dot">.</span>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <Link to="/#tracks">Tracks</Link>
            <Link to="/quiz/azure-fundamentals">Azure quiz</Link>
            <Link to="/" className="btn btn-primary btn-sm">Start a quiz</Link>
          </nav>
        </div>
      </header>
    </>
  )
}
