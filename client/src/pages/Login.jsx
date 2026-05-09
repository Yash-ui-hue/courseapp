import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate            = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/login', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
      <div className="mesh-bg" />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '16px',
            background: 'linear-gradient(135deg, #7c6ef7, #e05fff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, color: '#fff',
            fontFamily: 'Clash Display, sans-serif',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 28px rgba(124,110,247,0.4)',
          }}>C</div>
          <h1 style={{ fontSize: '2rem', color: '#f0effe', marginBottom: '0.4rem' }}>Welcome back</h1>
          <p style={{ color: '#7f7f9a', fontSize: '14px' }}>Sign in to continue to CourseApp</p>
        </div>

        {/* Card */}
        <div className="fade-up-1 card" style={{ padding: '2rem' }}>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label className="label">Email address</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: '1.8rem' }}>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <hr className="divider" />

          <p style={{ textAlign: 'center', color: '#7f7f9a', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#7c6ef7', textDecoration: 'none', fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
