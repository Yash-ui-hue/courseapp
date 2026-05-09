import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
      height: '64px',
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: '10px',
          background: 'linear-gradient(135deg, #7c6ef7, #e05fff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#fff',
          fontFamily: 'Clash Display, sans-serif',
          boxShadow: '0 4px 14px rgba(124,110,247,0.4)',
        }}>C</div>
        <span style={{
          fontFamily: 'Clash Display, sans-serif',
          fontWeight: 600, fontSize: 18, color: '#f0effe',
          letterSpacing: '-0.02em',
        }}>CourseApp</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Courses',   path: '/payment' },
        ].map(({ label, path }) => (
          <button key={path} onClick={() => navigate(path)} style={{
            background: isActive(path) ? 'rgba(124,110,247,0.15)' : 'transparent',
            color: isActive(path) ? '#7c6ef7' : '#7f7f9a',
            border: isActive(path) ? '1px solid rgba(124,110,247,0.25)' : '1px solid transparent',
            borderRadius: '8px',
            padding: '7px 16px',
            fontSize: '14px',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all .2s',
          }}
          onMouseEnter={e => { if (!isActive(path)) { e.target.style.color='#f0effe'; e.target.style.background='rgba(255,255,255,0.05)'; } }}
          onMouseLeave={e => { if (!isActive(path)) { e.target.style.color='#7f7f9a'; e.target.style.background='transparent'; } }}
          >
            {label}
          </button>
        ))}

        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.07)', margin: '0 8px' }} />

        <button onClick={handleLogout} style={{
          background: 'rgba(244,63,94,0.1)',
          color: '#f43f5e',
          border: '1px solid rgba(244,63,94,0.2)',
          borderRadius: '8px',
          padding: '7px 16px',
          fontSize: '14px',
          fontFamily: 'Sora, sans-serif',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all .2s',
        }}
        onMouseEnter={e => e.target.style.background='rgba(244,63,94,0.2)'}
        onMouseLeave={e => e.target.style.background='rgba(244,63,94,0.1)'}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
