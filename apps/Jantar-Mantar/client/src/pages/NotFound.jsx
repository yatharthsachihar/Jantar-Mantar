import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container section empty">
      <h1 style={{ fontSize: 64, margin: 0 }}>404</h1>
      <h3>Page not found</h3>
      <Link to="/" className="btn btn-primary">Back Home</Link>
    </div>
  );
}
