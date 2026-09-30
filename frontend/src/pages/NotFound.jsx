import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound container">
      <div className="code">404</div>
      <h1>That track doesn’t exist</h1>
      <p>The quiz you are looking for was moved, retired, or never existed.</p>
      <Link to="/" className="btn btn-primary">Back to all tracks</Link>
    </div>
  )
}
