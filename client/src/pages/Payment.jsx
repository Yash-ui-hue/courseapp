import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const courses = [
  {
    id: 1,
    title: 'Web Dev Bootcamp',
    category: 'Full stack',
    level: 'Beginner',
    popular: false,
    description: 'React, Node.js, PostgreSQL — auth, REST APIs, deployment.',
    price: 999,
    original: 2999,
    hours: 48,
    lessons: 120,
    tags: ['React', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 2,
    title: 'DSA Masterclass',
    category: 'Algorithms',
    level: 'Intermediate',
    popular: true,
    description: '200+ problems · arrays, trees, graphs, dynamic programming.',
    price: 499,
    original: 1499,
    hours: 36,
    lessons: 95,
    tags: ['Arrays', 'Trees', 'DP'],
  },
  {
    id: 3,
    title: 'System Design Pro',
    category: 'Architecture',
    level: 'Advanced',
    popular: false,
    description: 'Distributed systems, databases, caching, microservices.',
    price: 1299,
    original: 3999,
    hours: 28,
    lessons: 72,
    tags: ['Scalability', 'Microservices', 'Caching'],
  },
];

const categoryColor = {
  'Full stack': { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
  'Algorithms': { bg: 'rgba(52,211,153,0.15)', color: '#34d399' },
  'Architecture': { bg: 'rgba(251,146,60,0.15)', color: '#fb923c' },
};

export default function Payment() {
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/auth/me').then(res => setUser(res.data)).catch(() => navigate('/login'));
  }, []);

  const handlePayment = async (course) => {
    if (user?.kyc_status !== 'verified') { setMessage('kyc'); return; }
    setLoading(course.id); setMessage('');
    try {
      const { data } = await API.post('/payment/create-order', { amount: course.price });
      const options = {
        key: data.key_id, amount: data.amount, currency: data.currency, order_id: data.order_id,
        name: 'CourseApp', description: course.title,
        handler: async (response) => {
          try {
            await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate('/dashboard?payment=success');
          } catch { setMessage('error'); }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#18181b' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => setMessage('error'));
      rzp.open();
    } catch { setMessage('error'); }
    finally { setLoading(null); }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">

        {/* Breadcrumb */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            color: 'var(--muted)', borderRadius: 6, padding: '4px 10px',
            fontSize: 12, fontFamily: 'Inter,sans-serif', cursor: 'pointer',
            transition: 'color .15s',
          }}
            onMouseEnter={e => e.target.style.color = 'var(--text)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >Dashboard</button>
          <span style={{ color: 'var(--subtle)', fontSize: 12 }}>/</span>
          <span style={{ color: 'var(--text)', fontSize: 12, fontWeight: 500 }}>Courses</span>
        </div>

        {/* Header */}
        <div className="fade-up-1" style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.35rem', marginBottom: 5 }}>Courses</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            One-time payment · Lifetime access · Learn at your own pace
          </p>
        </div>

        {/* Alerts */}
        {message === 'kyc' && (
          <div className="alert alert-warning fade-up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>
              Complete Aadhaar verification first.{' '}
              <button onClick={() => navigate('/aadhaar')} style={{
                background: 'none', border: 'none', color: 'var(--amber)',
                textDecoration: 'underline', cursor: 'pointer',
                fontSize: 'inherit', fontFamily: 'inherit', fontWeight: 500, padding: 0,
              }}>Verify now</button>
            </span>
          </div>
        )}
        {message === 'error' && (
          <div className="alert alert-error fade-up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Payment failed. Please try again.
          </div>
        )}

        {/* Course cards */}
        <div className="fade-up-2" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem',
          marginBottom: '1.25rem',
        }}>
          {courses.map((course, i) => {
            const cc = categoryColor[course.category] || { bg: 'var(--bg3)', color: 'var(--muted)' };
            return (
              <div key={course.id} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)', padding: '1.25rem',
                display: 'flex', flexDirection: 'column', gap: '0.85rem',
                position: 'relative',
                transition: 'border-color .15s',
                animationDelay: `${i * 0.06}s`,
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {/* Most popular pill */}
                {course.popular && (
                  <div style={{
                    position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--white)', color: '#0f0f0f',
                    fontSize: 10, fontWeight: 700, padding: '4px 12px',
                    borderRadius: 99, letterSpacing: '.03em',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.9)',
                  }}>Most popular</div>
                )}

                {/* Category + level */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    background: cc.bg, color: cc.color,
                    padding: '2px 8px', borderRadius: 99,
                  }}>{course.category}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{course.level}</span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                  {course.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                  {course.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {course.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, color: 'var(--subtle)',
                      background: 'var(--bg3)',
                      padding: '2px 7px', borderRadius: 5,
                    }}>{tag}</span>
                  ))}
                </div>

                {/* Price + CTA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: 4 }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
                      ₹{course.price.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--subtle)', textDecoration: 'line-through', marginTop: 2 }}>
                      ₹{course.original.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePayment(course)}
                    disabled={loading === course.id}
                    className="btn btn-primary"
                    style={{ minWidth: 90, padding: '9px 20px' }}
                  >
                    {loading === course.id
                      ? <div className="spinner" style={{ width: 13, height: 13 }} />
                      : 'Enroll'}
                  </button>
                </div>

                {/* Meta */}
                <div style={{
                  borderTop: '1px solid var(--border)', paddingTop: 10,
                  fontSize: 11, color: 'var(--subtle)',
                }}>
                  {course.hours}h · {course.lessons} lessons
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust bar */}
        <div className="fade-up-3" style={{
          padding: '0.85rem 1.25rem',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex', justifyContent: 'center',
          flexWrap: 'wrap', gap: '2rem',
        }}>
          {[
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ), text: 'Secured by Razorpay'
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z" />
                  <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" />
                </svg>
              ), text: 'Lifetime access'
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ), text: 'KYC verified'
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              ), text: 'Watch anywhere'
            },
          ].map(({ icon, text }) => (
            <span key={text} style={{
              fontSize: 12, color: 'var(--muted)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ color: 'var(--subtle)' }}>{icon}</span>{text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
