import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import useTheme from '../hooks/useTheme';

export default function Navbar() {
  const navigate      = useNavigate();
  const location      = useLocation();
  const { theme, toggle } = useTheme();
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try { await API.post('/auth/logout'); } catch {}
    navigate('/login');
  };

  return (
    <header style={{
      position:'sticky',top:0,zIndex:100,
      background:'var(--bg2)',
      backdropFilter:'blur(12px)',
      borderBottom:'1px solid var(--border)',
    }}>
      <div style={{
        maxWidth:1040,margin:'0 auto',padding:'0 1.5rem',
        height:52,display:'flex',alignItems:'center',justifyContent:'space-between',
      }}>
        {/* Logo */}
        <div onClick={() => navigate('/dashboard')} style={{
          display:'flex',alignItems:'center',gap:10,cursor:'pointer',
        }}>
          <div style={{
            width:28,height:28,borderRadius:8,
            background:'var(--bg3)',
            border:'1px solid var(--border2)',
            display:'flex',alignItems:'center',justifyContent:'center',
            flexShrink:0,
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="var(--muted)"/>
              <rect x="7" y="1" width="5" height="5" rx="1.5" fill="var(--muted)"/>
              <rect x="1" y="7" width="5" height="5" rx="1.5" fill="var(--muted)"/>
              <rect x="7" y="7" width="5" height="5" rx="1.5" fill="var(--text)"/>
            </svg>
          </div>
          <span style={{fontWeight:600,fontSize:14,letterSpacing:'-0.02em',color:'var(--text)'}}>
            CourseApp
          </span>
        </div>

        {/* Right nav */}
        <nav style={{display:'flex',alignItems:'center',gap:0}}>
          {[
            {label:'Dashboard',path:'/dashboard'},
            {label:'Courses',path:'/payment'},
          ].map(({label,path}) => (
            <button key={path} onClick={() => navigate(path)} style={{
              background:'transparent',
              color:isActive(path)?'var(--text)':'var(--muted)',
              border:'none',borderRadius:6,padding:'5px 14px',
              fontSize:13,fontWeight:isActive(path)?600:400,
              fontFamily:'Inter,sans-serif',cursor:'pointer',transition:'color .15s',
            }}
            onMouseEnter={e => { if(!isActive(path)) e.target.style.color='var(--text)'; }}
            onMouseLeave={e => { if(!isActive(path)) e.target.style.color='var(--muted)'; }}
            >{label}</button>
          ))}

          <div style={{width:1,height:16,background:'var(--border2)',margin:'0 8px'}}/>

          {/* Theme toggle */}
          <button onClick={toggle} style={{
            background:'var(--bg3)',
            border:'1px solid var(--border)',
            borderRadius:6,
            width:32,height:32,
            display:'flex',alignItems:'center',justifyContent:'center',
            cursor:'pointer',transition:'background .15s',
            marginRight:4,
          }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onMouseEnter={e => e.currentTarget.style.background='var(--bg4)'}
          onMouseLeave={e => e.currentTarget.style.background='var(--bg3)'}
          >
            {theme === 'dark' ? (
              /* Sun icon */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              /* Moon icon */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <button onClick={handleLogout} style={{
            background:'transparent',color:'var(--muted)',border:'none',
            borderRadius:6,padding:'5px 14px',fontSize:13,
            fontFamily:'Inter,sans-serif',cursor:'pointer',transition:'color .15s',
          }}
          onMouseEnter={e => e.target.style.color='var(--text)'}
          onMouseLeave={e => e.target.style.color='var(--muted)'}
          >Sign out</button>
        </nav>
      </div>
    </header>
  );
}