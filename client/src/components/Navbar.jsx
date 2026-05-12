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
      position:'sticky',top:0,zIndex:100,
      background:'rgba(15,15,15,0.9)',
      backdropFilter:'blur(12px)',
      borderBottom:'1px solid rgba(255,255,255,0.06)',
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
              color: isActive(path) ? 'var(--text)' : 'var(--muted)',
              border:'none',borderRadius:6,padding:'5px 14px',
              fontSize:13,fontWeight: isActive(path) ? 600 : 400,
              fontFamily:'Inter,sans-serif',cursor:'pointer',transition:'color .15s',
            }}
            onMouseEnter={e => { if(!isActive(path)) e.target.style.color='var(--text)'; }}
            onMouseLeave={e => { if(!isActive(path)) e.target.style.color='var(--muted)'; }}
            >{label}</button>
          ))}

          <div style={{width:1,height:16,background:'var(--border2)',margin:'0 8px'}}/>

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
