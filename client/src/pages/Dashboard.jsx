import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [user,setUser]   = useState(null);
  const navigate         = useNavigate();
  const [searchParams]   = useSearchParams();
  const kycStatus        = searchParams.get('kyc');
  const paymentStatus    = searchParams.get('payment');

  useEffect(() => {
    API.get('/auth/me').then(res => setUser(res.data)).catch(() => navigate('/login'));
  },[]);

  if (!user) return (
    <div className="page">
      <Navbar/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'calc(100vh - 52px)'}}>
        <div className="spinner"/>
      </div>
    </div>
  );

  const initials = user.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);

  /* avatar color — consistent per user */
  const colors = ['#3b5bdb','#0ca678','#7048e8','#e67700','#c92a2a','#1098ad'];
  const avatarColor = colors[user.name?.charCodeAt(0) % colors.length] || '#3b5bdb';

  return (
    <div className="page">
      <Navbar/>
      <div className="page-content">

        {/* Alerts */}
        {kycStatus === 'success' && (
          <div className="alert alert-success fade-up" style={{marginBottom:'1.5rem'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{flexShrink:0}}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Aadhaar verified. You can now purchase courses.
          </div>
        )}
        {paymentStatus === 'success' && (
          <div className="alert alert-success fade-up" style={{marginBottom:'1.5rem'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{flexShrink:0}}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Payment successful. Your course is unlocked.
          </div>
        )}

        {/* Header */}
        <div className="fade-up" style={{display:'flex',alignItems:'center',gap:14,marginBottom:'2rem'}}>
          <div style={{
            width:46,height:46,borderRadius:'100%',
            background:avatarColor,
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:15,fontWeight:600,color:'#fff',flexShrink:0,
            letterSpacing:'-0.01em',
          }}>{initials}</div>
          <div>
            <h1 style={{fontSize:'1.35rem',marginBottom:3}}>Good to see you, {user.name.split(' ')[0]}</h1>
            <p style={{color:'var(--muted)',fontSize:13}}>{user.email}</p>
          </div>
        </div>

        {/* Stats row — 3 cards */}
        <div className="fade-up-1" style={{
          display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:'1.25rem',
        }}>
          {[
            {
              label:'KYC status',
              value: user.kyc_status === 'verified' ? 'Verified' : 'Not verified',
              badge: user.kyc_status === 'verified' ? {cls:'badge-green',text:'Active'} : {cls:'badge-amber',text:'Pending'},
              icon:(
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              ),
            },
            {
              label:'Courses available',
              value:'3 courses',
              badge:{cls:'badge-blue',text:'Available'},
              icon:(
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              ),
            },
            {
              label:'Member since',
              value: new Date(user.created_at).toLocaleDateString('en-IN',{month:'long',year:'numeric'}),
              badge:{cls:'badge-gray',text:'Free plan'},
              icon:(
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              ),
            },
          ].map(({label,value,badge,icon}) => (
            <div key={label} style={{
              background:'var(--bg2)',border:'1px solid var(--border)',
              borderRadius:'var(--radius-lg)',padding:'1.1rem 1.2rem',
            }}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <span style={{fontSize:12,color:'var(--muted)'}}>{label}</span>
                <span style={{color:'var(--subtle)'}}>{icon}</span>
              </div>
              <div style={{fontSize:16,fontWeight:600,letterSpacing:'-0.02em',marginBottom:8}}>{value}</div>
              <span className={`badge ${badge.cls}`}>{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Action cards — 2 col */}
        <div className="fade-up-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>

          {/* KYC card */}
          <div style={{
            background:'var(--bg2)',border:'1px solid var(--border)',
            borderRadius:'var(--radius-xl)',padding:'1.4rem',
            display:'flex',flexDirection:'column',gap:10,
          }}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <p style={{fontSize:10,color:'var(--subtle)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:5}}>Identity</p>
                <h3 style={{fontSize:'1rem',fontWeight:600}}>Aadhaar KYC</h3>
              </div>
              <span className={`badge ${user.kyc_status === 'verified' ? 'badge-green' : 'badge-amber'}`}>
                {user.kyc_status === 'verified' ? 'Verified' : 'Required'}
              </span>
            </div>
            <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.6}}>
              {user.kyc_status === 'verified'
                ? `Your identity is verified. Ending ${user.aadhaar_masked?.slice(-4) || '—'}.`
                : 'Complete Aadhaar verification to purchase courses. Takes less than a minute.'}
            </p>
            {user.kyc_status !== 'verified' && (
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/aadhaar')}
                style={{alignSelf:'flex-start'}}>
                Verify now →
              </button>
            )}
          </div>

          {/* Courses card */}
          <div style={{
            background:'var(--bg2)',border:'1px solid var(--border)',
            borderRadius:'var(--radius-xl)',padding:'1.4rem',
            display:'flex',flexDirection:'column',gap:10,
          }}>
            <div>
              <p style={{fontSize:10,color:'var(--subtle)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:5}}>Learning</p>
              <h3 style={{fontSize:'1rem',fontWeight:600}}>Browse courses</h3>
            </div>
            <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.6}}>
              Web dev, DSA, System Design. One-time payment, lifetime access.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/payment')}
              style={{alignSelf:'flex-start'}}>
              View courses →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
