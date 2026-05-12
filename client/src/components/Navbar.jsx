import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try { await API.post('/auth/logout'); } catch {}
    navigate('/login');
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1040, margin: '0 auto',
        padding: '0 1.5rem',
        height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div onClick={() => navigate('/dashboard')} style={{
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="var(--bg)" strokeWidth="0"/>
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>
            CourseApp
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Courses', path: '/payment' },
          ].map(({ label, path }) => (
            <button key={path} onClick={() => navigate(path)} style={{
              background: isActive(path) ? 'var(--bg2)' : 'transparent',
              color: isActive(path) ? 'var(--text)' : 'var(--muted)',
              border: 'none',
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 13,
              fontWeight: isActive(path) ? 500 : 400,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { if (!isActive(path)) e.target.style.color = 'var(--text)'; }}
            onMouseLeave={e => { if (!isActive(path)) e.target.style.color = 'var(--muted)'; }}
            >{label}</button>
          ))}

          <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 6px' }} />

          <button onClick={handleLogout} style={{
            background: 'transparent',
            color: 'var(--muted)',
            border: 'none',
            borderRadius: 8,
            padding: '5px 12px',
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            transition: 'color .15s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--red)'}
          onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >Sign out</button>
        </nav>
      </div>
    </header>
  );
}
