import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [status, setStatus] = useState('unknown')

  useEffect(() => {
    let active = true
    const check = () =>
      fetch('/api/health')
        .then((r) => {
          if (active) setStatus(r.ok ? 'up' : 'down')
        })
        .catch(() => {
          if (active) setStatus('down')
        })
    check()
    const id = setInterval(check, 30_000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  const label =
    status === 'up' ? 'API + database reachable' : status === 'down' ? 'API unreachable' : 'Checking API…'

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand" style={{ color: '#fff' }}>
              <span className="brand-mark" aria-hidden="true">Q</span>
              <span>
                quizlab<span className="brand-dot">.</span>
              </span>
            </span>
            <p>Team learning, scored. A three-tier reference application for the Azure deployment workshop.</p>
            <span className="health">
              <span className={`health-dot ${status === 'down' ? 'down' : status === 'unknown' ? 'unknown' : ''}`} />
              {label}
            </span>
          </div>
          <nav aria-label="App">
            <h2>App</h2>
            <Link to="/">All tracks</Link>
            <Link to="/quiz/azure-fundamentals">Azure Fundamentals</Link>
            <Link to="/quiz/cloud-core-concepts">Cloud Core Concepts</Link>
            <Link to="/leaderboard/azure-fundamentals">Leaderboard</Link>
          </nav>
          <div>
            <h2>Architecture</h2>
            <ul className="footer-list">
              <li><strong>Presentation</strong> — React SPA, served by Vite</li>
              <li><strong>Application</strong> — Express REST API, port 4000</li>
              <li><strong>Data</strong> — PostgreSQL, quizlab database</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 QuizLab. Built for the Azure three-tier deployment workshop.</p>
          <p>React · Express · PostgreSQL</p>
        </div>
      </div>
    </footer>
  )
}
