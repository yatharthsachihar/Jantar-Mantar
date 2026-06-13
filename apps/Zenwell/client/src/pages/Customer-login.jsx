import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { Link } from "react-router-dom";

function CustomerLogin() {

  useEffect(() => {
    console.log("hello");
  }, []);

  return (
    <div>
      Login
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('customerUser', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    }

    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      <div className="login-hero" style={{backgroundImage: `url('\login.png')`}}>
        <div className="login-hero-content">
          <Link to="/" className="auth-home-btn">
            ← Back to Home
          </Link>
          <p className="login-eyebrow">✦ WELCOME BACK</p>
          <h1>Find balance.<br /><span className="green-text">Live well.</span></h1>
          <p>Continue your wellness journey with mindful products designed for your body, mind, and soul.</p>
          <div className="login-badges">
            <div className="badge"><span>🌿</span> 100% Natural</div>
            <div className="badge"><span>✓</span> Trusted by 10k+ customers</div>
            <div className="badge"><span>♻️</span> Sustainable & Eco-friendly</div>
          </div>
        </div>
      </div>

      <div className="login-form-wrapper">
        <div className="login-form-box">
          <h2>Welcome back</h2>
          <p>Sign in to continue to your account</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input type="email" placeholder="Enter your Email" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔐</span>
                <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="toggle-password" onClick={() => document.getElementById('password').type = document.getElementById('password').type === 'password' ? 'text' : 'password'}>👁️</button>
              </div>
            </div>

            <a href="#" className="forgot-password">Forgot password?</a>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>

          <div className="or-divider">or continue with</div>

          <div className="social-buttons">
            <button type="button" className="social-btn google">
              <span>🔵</span> Google
            </button>
            <button type="button" className="social-btn apple">
              <span>🍎</span> Apple
            </button>
          </div>

          <p className="signup-link">Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;