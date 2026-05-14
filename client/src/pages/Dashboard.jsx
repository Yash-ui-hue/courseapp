import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import API from '../api/axios';

/* ── Bottom nav items ── */
const NAV_ITEMS = [
  { label: 'Home', path: '/dashboard', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { label: 'Courses', path: '/payment', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )},
  { label: 'Progress', path: '/dashboard', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )},
  { label: 'Profile', path: '/dashboard', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )},
];

export default function Dashboard() {
  const [user, setUser]     = useState(null);
  const navigate            = useNavigate();
  const location            = useLocation();
  const [searchParams]      = useSearchParams();
  const kycStatus           = searchParams.get('kyc');
  const paymentStatus       = searchParams.get('payment');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    API.get('/auth/me').then(res => setUser(res.data)).catch(() => navigate('/login'));
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="spinner" />
    </div>
  );

  const colors = ['#16a34a', '#2563eb', '#7c3aed', '#d97706', '#dc2626'];
  const avatarColor = colors[user.name?.charCodeAt(0) % colors.length] || '#16a34a';
  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  /* ══ MOBILE LAYOUT ══ */
  if (isMobile) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', maxWidth: 430, margin: '0 auto' }}>

      {/* Top header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem 0.75rem' }}>
        <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', color: 'var(--text)' }}>Course.App</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <button style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {(kycStatus === 'success' || paymentStatus === 'success') && (
        <div style={{ margin: '0 1.25rem 0.75rem', padding: '10px 13px', background: 'var(--green-bg)', color: 'var(--green)', borderRadius: 10, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {kycStatus === 'success' ? 'Aadhaar verified!' : 'Payment successful!'}
        </div>
      )}

      {/* User greeting */}
      <div style={{ padding: '0.5rem 1.25rem 1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Good to see you, {user.name.split(' ')[0]} 👋
            </h1>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{user.email}</p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '0 1.25rem 1rem' }}>
        {[
          { label: 'KYC', value: user.kyc_status === 'verified' ? 'Verified' : 'Pending', badge: user.kyc_status === 'verified' ? { bg: 'var(--green-bg)', color: 'var(--green)', text: 'Active' } : { bg: 'var(--amber-bg)', color: 'var(--amber)', text: 'Pending' },
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
          { label: 'COURSES', value: '3', badge: { bg: 'var(--blue-bg)', color: 'var(--blue)', text: 'Available' },
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
          { label: 'MEMBER', value: new Date(user.created_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }), badge: { bg: 'var(--bg3)', color: 'var(--muted)', text: 'Free' },
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
        ].map(({ label, value, badge, icon }) => (
          <div key={label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '0.85rem 0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 9, color: 'var(--subtle)', letterSpacing: '.08em', fontWeight: 500 }}>{label}</span>
              <span style={{ color: 'var(--subtle)' }}>{icon}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6 }}>{value}</div>
            <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 99, background: badge.bg, color: badge.color }}>{badge.text}</span>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div style={{ padding: '0 1.25rem 1rem' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>Quick Access</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

          {/* KYC card */}
          <div style={{ background: user.kyc_status === 'verified' ? 'rgba(22,163,74,0.08)' : 'var(--bg2)', border: `1px solid ${user.kyc_status === 'verified' ? 'rgba(22,163,74,0.25)' : 'var(--border)'}`, borderRadius: 14, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(22,163,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              {user.kyc_status === 'verified' && (
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--green)', background: 'var(--green-bg)', padding: '2px 8px', borderRadius: 99 }}>Verified</span>
              )}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>Aadhaar KYC</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
                {user.kyc_status === 'verified' ? 'Your identity is verified & active' : 'Tap to verify your identity'}
              </p>
            </div>
            {user.kyc_status === 'verified' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--green)', fontWeight: 500 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Confirmed
              </div>
            ) : (
              <button onClick={() => navigate('/aadhaar')} style={{ background: 'var(--text)', color: 'var(--bg)', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif', alignSelf: 'flex-start' }}>
                Verify →
              </button>
            )}
          </div>

          {/* Browse courses card */}
          <div onClick={() => navigate('/payment')} style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 14, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>Browse Courses</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>Web dev, DSA & more. Lifetime access</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>
              Explore
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Available courses list */}
      <div style={{ padding: '0 1.25rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Available Courses</p>
          <button onClick={() => navigate('/payment')} style={{ background: 'none', border: 'none', color: 'var(--green)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>See all</button>
        </div>

        {[
          { icon: '🌐', title: 'Web Development', sub: 'Full stack · Lifetime access' },
          { icon: '⚡', title: 'DSA Mastery', sub: 'Data structures & algorithms' },
          { icon: '🏗️', title: 'System Design', sub: 'Architecture & scaling' },
        ].map((course, i) => (
          <div key={i} onClick={() => navigate('/payment')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.85rem 1rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 8, cursor: 'pointer', transition: 'border-color .15s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
              {course.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{course.title}</p>
              <p style={{ fontSize: 11, color: 'var(--muted)' }}>{course.sub}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--subtle)" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'sticky', bottom: 0, background: 'var(--bg2)', borderTop: '1px solid var(--border)', display: 'flex', padding: '0.6rem 0 0.75rem' }}>
        {NAV_ITEMS.map(({ label, path, icon }) => {
          const active = location.pathname === path && label === 'Home';
          return (
            <button key={label} onClick={() => navigate(path)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: active ? 'var(--green)' : 'var(--subtle)', transition: 'color .15s', fontFamily: 'Inter,sans-serif' }}>
              {icon(active)}
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ══ DESKTOP LAYOUT (existing) ══ */
  return (
    <div className="page">
      <DesktopNavbar navigate={navigate} location={location} />
      <div className="page-content">
        {kycStatus === 'success' && (
          <div className="alert alert-success fade-up" style={{ marginBottom: '1.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
            Aadhaar verified. You can now purchase courses.
          </div>
        )}
        {paymentStatus === 'success' && (
          <div className="alert alert-success fade-up" style={{ marginBottom: '1.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
            Payment successful. Your course is unlocked.
          </div>
        )}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#fff', flexShrink: 0 }}>{initials}</div>
          <div>
            <h1 style={{ fontSize: '1.35rem', marginBottom: 3 }}>Good to see you, {user.name.split(' ')[0]}</h1>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>{user.email}</p>
          </div>
        </div>
        <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: '1.25rem' }}>
          {[
            { label: 'KYC status', value: user.kyc_status === 'verified' ? 'Verified' : 'Not verified', badge: user.kyc_status === 'verified' ? { cls: 'badge-green', text: 'Active' } : { cls: 'badge-amber', text: 'Pending' } },
            { label: 'Courses available', value: '3 courses', badge: { cls: 'badge-blue', text: 'Available' } },
            { label: 'Member since', value: new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }), badge: { cls: 'badge-gray', text: 'Free plan' } },
          ].map(({ label, value, badge }) => (
            <div key={label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.1rem 1.2rem' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>{value}</div>
              <span className={`badge ${badge.cls}`}>{badge.text}</span>
            </div>
          ))}
        </div>
        <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 10, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>Identity</p>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Aadhaar KYC</h3>
              </div>
              <span className={`badge ${user.kyc_status === 'verified' ? 'badge-green' : 'badge-amber'}`}>{user.kyc_status === 'verified' ? 'Verified' : 'Required'}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              {user.kyc_status === 'verified' ? `Your identity is verified. Ending ${user.aadhaar_masked?.slice(-4) || '—'}.` : 'Complete Aadhaar verification to purchase courses.'}
            </p>
            {user.kyc_status !== 'verified' && (
              <button className="btn btn-sm" onClick={() => navigate('/aadhaar')} style={{ alignSelf: 'flex-start', background: 'var(--text)', color: 'var(--bg)', border: '1px solid var(--text)' }}>Verify now →</button>
            )}
          </div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <p style={{ fontSize: 10, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>Learning</p>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Browse courses</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>Web dev, DSA, System Design. One-time payment, lifetime access.</p>
            <button className="btn btn-sm" onClick={() => navigate('/payment')} style={{ alignSelf: 'flex-start', background: 'var(--text)', color: 'var(--bg)', border: '1px solid var(--text)' }}>View courses →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Desktop navbar inline */
function DesktopNavbar({ navigate, location }) {
  const isActive = (path) => location.pathname === path;
  const handleLogout = async () => {
    try { await (await import('../api/axios')).default.post('/auth/logout'); } catch {}
    navigate('/login');
  };
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg2)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 1.5rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="var(--muted)"/>
              <rect x="7" y="1" width="5" height="5" rx="1.5" fill="var(--muted)"/>
              <rect x="1" y="7" width="5" height="5" rx="1.5" fill="var(--muted)"/>
              <rect x="7" y="7" width="5" height="5" rx="1.5" fill="var(--text)"/>
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text)' }}>CourseApp</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Courses', path: '/payment' }].map(({ label, path }) => (
            <button key={path} onClick={() => navigate(path)} style={{ background: 'transparent', color: isActive(path) ? 'var(--text)' : 'var(--muted)', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 13, fontWeight: isActive(path) ? 600 : 400, fontFamily: 'Inter,sans-serif', cursor: 'pointer' }}>{label}</button>
          ))}
          <div style={{ width: 1, height: 16, background: 'var(--border2)', margin: '0 8px' }} />
          <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--muted)', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 13, fontFamily: 'Inter,sans-serif', cursor: 'pointer' }}>Sign out</button>
        </nav>
      </div>
    </header>
  );
}
