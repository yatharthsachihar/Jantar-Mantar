import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../admin/store/authStore';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login, admin } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (admin) navigate('/admin', { replace: true });
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin', { replace: true });
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo-wrap">
            <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#2E7D32"/>
              <path d="M18 8C18 8 10 14 10 20C10 24.4 13.6 28 18 28C22.4 28 26 24.4 26 20C26 14 18 8 18 8Z" fill="#DDF5D8"/>
              <path d="M18 13C18 13 14 17 14 20C14 22.2 15.8 24 18 24C20.2 24 22 22.2 22 20C22 17 18 13 18 13Z" fill="#0F5D2F"/>
            </svg>
            <div>
              <div className="login-brand-name">AgroNest</div>
              <div className="login-brand-tag">Super Admin Panel</div>
            </div>
          </div>

          <h1>Manage your entire agricultural platform from one place.</h1>

          <div className="login-features">
            <div className="login-feature"><div className="login-feature-dot"></div><span>B2B / B2C / Hybrid Store Mode</span></div>
            <div className="login-feature"><div className="login-feature-dot"></div><span>Products, Categories & Inventory</span></div>
            <div className="login-feature"><div className="login-feature-dot"></div><span>Orders, Enquiries & Customers</span></div>
            <div className="login-feature"><div className="login-feature-dot"></div><span>Theme, Content & CMS Builder</span></div>
            <div className="login-feature"><div className="login-feature-dot"></div><span>Analytics & Marketing Tools</span></div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to access your admin panel</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label>Email Address</label>
              <div className="login-input-wrap">
                <FiMail className="login-input-icon" />
                <input type="email" placeholder="admin@agronest.in" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
              </div>
            </div>

            <div className="login-form-group">
              <label>Password</label>
              <div className="login-input-wrap">
                <FiLock className="login-input-icon" />
                <input type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  required autoComplete="current-password" />
                <button type="button" className="login-eye-btn" onClick={() => setShowPass(p => !p)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? <span className="login-spinner"></span> : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div className="login-hint">
            Default: <strong>admin@agronest.in</strong> / <strong>admin123</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
