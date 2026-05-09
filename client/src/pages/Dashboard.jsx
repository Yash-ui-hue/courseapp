import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [user, setUser]         = useState(null);
  const navigate                = useNavigate();
  const [searchParams]          = useSearchParams();
  const kycStatus               = searchParams.get('kyc');
  const paymentStatus           = searchParams.get('payment');

  useEffect(() => {
    API.get('/auth/me').then(res => setUser(res.data));
  }, []);

  const StatCard = ({ icon, label, value, sub, accent }) => (
    <div style={{
      background: '#111118',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '1.5rem',
      transition: 'border-color .2s, box-shadow .2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(124,110,247,0.25)'; e.currentTarget.style.boxShadow='0 0 40px rgba(124,110,247,0.10)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='none'; }}
    >
      <div style={{ fontSize: 22, marginBottom: '0.75rem' }}>{icon}</div>
      <div style={{ fontSize: 13, color: '#7f7f9a', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: accent || '#f0effe', fontFamily: 'Clash Display, sans-serif' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#7f7f9a', marginTop: '0.25rem' }}>{sub}</div>}
    </div>
  );

  return (
    <div className="page">
      <div className="mesh-bg" />
      <Navbar />

      <div className="page-content" style={{ position: 'relative', zIndex: 1 }}>

        {/* Alerts */}
        {kycStatus === 'success' && (
          <div className="alert alert-success fade-up">
            ✅ Aadhaar verified successfully! You can now make purchases.
          </div>
        )}
        {paymentStatus === 'success' && (
          <div className="alert alert-success fade-up">
            🎉 Payment successful! Your course has been unlocked.
          </div>
        )}

        {user ? (
          <>
            {/* Header */}
            <div className="fade-up" style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '14px',
                  background: 'linear-gradient(135deg, #7c6ef7, #e05fff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, color: '#fff',
                  fontFamily: 'Clash Display, sans-serif',
                  flexShrink: 0,
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 style={{ fontSize: '1.8rem', color: '#f0effe' }}>
                    Hey, {user.name.split(' ')[0]} 👋
                  </h1>
                  <p style={{ color: '#7f7f9a', fontSize: '14px' }}>{user.email}</p>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <StatCard icon="🛡️" label="KYC Status" value={user.kyc_status === 'verified' ? 'Verified' : 'Unverified'}
                sub={user.kyc_status === 'verified' ? user.aadhaar_masked : 'Link your Aadhaar to get started'}
                accent={user.kyc_status === 'verified' ? '#00d9a0' : '#f59e0b'} />
              <StatCard icon="🎓" label="Courses" value="2 Available" sub="Web Dev · DSA Masterclass" />
              <StatCard icon="⚡" label="Account" value="Active" sub={`Since ${new Date(user.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`} accent="#7c6ef7" />
            </div>

            {/* Action cards */}
            <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>

              {/* KYC card */}
              <div style={{
                background: '#111118',
                border: user.kyc_status === 'verified' ? '1px solid rgba(0,217,160,0.2)' : '1px solid rgba(245,158,11,0.2)',
                borderRadius: '20px',
                padding: '1.75rem',
                display: 'flex', flexDirection: 'column', gap: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#7f7f9a', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Identity Verification</p>
                    <h3 style={{ fontSize: '1.2rem', color: '#f0effe' }}>Aadhaar KYC</h3>
                  </div>
                  <span className={`badge ${user.kyc_status === 'verified' ? 'badge-success' : 'badge-warning'}`}>
                    {user.kyc_status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </div>

                <p style={{ fontSize: 13, color: '#7f7f9a', lineHeight: 1.6 }}>
                  {user.kyc_status === 'verified'
                    ? `Your identity is verified. Aadhaar ending ${user.aadhaar_masked?.slice(-4)}.`
                    : 'Complete Aadhaar verification to unlock course purchases.'}
                </p>

                {user.kyc_status !== 'verified' && (
                  <button className="btn btn-primary" onClick={() => navigate('/aadhaar')} style={{ alignSelf: 'flex-start' }}>
                    Verify Now →
                  </button>
                )}
              </div>

              {/* Courses card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(124,110,247,0.1), rgba(224,95,255,0.06))',
                border: '1px solid rgba(124,110,247,0.2)',
                borderRadius: '20px',
                padding: '1.75rem',
                display: 'flex', flexDirection: 'column', gap: '1rem',
              }}>
                <div>
                  <p style={{ fontSize: 12, color: '#7f7f9a', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Learning</p>
                  <h3 style={{ fontSize: '1.2rem', color: '#f0effe' }}>Browse Courses</h3>
                </div>

                <p style={{ fontSize: 13, color: '#7f7f9a', lineHeight: 1.6 }}>
                  Explore our curated courses in Web Development and Data Structures.
                  {user.kyc_status !== 'verified' && ' Complete KYC first to purchase.'}
                </p>

                <button className="btn btn-primary" onClick={() => navigate('/payment')} style={{ alignSelf: 'flex-start' }}>
                  View Courses →
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 40, height: 40, border: '3px solid rgba(124,110,247,0.3)',
                borderTopColor: '#7c6ef7', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
              }} />
              <p style={{ color: '#7f7f9a' }}>Loading your dashboard...</p>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
