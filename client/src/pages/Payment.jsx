import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const courses = [
  {
    id: 1,
    title: 'Web Development Bootcamp',
    category: 'Full Stack',
    description: 'Build production-ready full-stack apps with React, Node.js, and PostgreSQL. Covers authentication, REST APIs, deployment, and more.',
    price: 999,
    original: 2999,
    hours: 48,
    lessons: 120,
    level: 'Beginner',
    tags: ['React', 'Node.js', 'PostgreSQL', 'REST APIs'],
    accent: 'var(--blue)',
    accentLight: 'var(--blue-light)',
  },
  {
    id: 2,
    title: 'DSA Masterclass',
    category: 'Algorithms',
    description: 'Master data structures and algorithms with 200+ problems. Build the problem-solving intuition needed for any technical interview.',
    price: 499,
    original: 1499,
    hours: 36,
    lessons: 95,
    level: 'Intermediate',
    tags: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
    accent: '#16a34a',
    accentLight: 'var(--green-light)',
  },
  {
    id: 3,
    title: 'System Design Pro',
    category: 'Architecture',
    description: 'Learn to design large-scale distributed systems. Covers databases, caching, load balancing, and microservices with real-world case studies.',
    price: 1299,
    original: 3999,
    hours: 28,
    lessons: 72,
    level: 'Advanced',
    tags: ['Scalability', 'Microservices', 'Caching', 'Databases'],
    accent: '#d97706',
    accentLight: 'var(--amber-light)',
  },
];

export default function Payment() {
  const [loading, setLoading]   = useState(null);
  const [message, setMessage]   = useState('');
  const [user, setUser]         = useState(null);
  const navigate                = useNavigate();

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

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Courses</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>
            One-time payment. Lifetime access. Learn at your own pace.
          </p>
        </div>

        {/* Alerts */}
        {message === 'kyc' && (
          <div className="alert alert-warning fade-up">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>
              Complete Aadhaar verification before purchasing.{' '}
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Payment failed. Please try again.
          </div>
        )}

        {/* Course grid */}
        <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {courses.map((course, i) => (
            <div key={course.id} style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              transition: 'border-color .15s, box-shadow .15s',
              animationDelay: `${i * 0.06}s`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Top bar */}
              <div style={{ height: 3, background: course.accent, opacity: 0.8 }} />

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Category + level */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 500, color: course.accent,
                    background: course.accentLight,
                    padding: '3px 9px', borderRadius: 99,
                    letterSpacing: '.02em',
                  }}>{course.category}</span>
                  <span className="badge badge-gray">{course.level}</span>
                </div>

                {/* Title & desc */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 6, letterSpacing: '-0.02em' }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>
                    {course.description}
                  </p>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {course.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, color: 'var(--muted)',
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                      padding: '2px 8px', borderRadius: 6,
                    }}>{tag}</span>
                  ))}
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: 12, color: 'var(--subtle)' }}>
                  <span>{course.hours}h content</span>
                  <span>{course.lessons} lessons</span>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border)' }} />

                {/* Price + CTA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
                      ₹{course.price.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--subtle)', textDecoration: 'line-through' }}>
                      ₹{course.original.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePayment(course)}
                    disabled={loading === course.id}
                    className="btn btn-primary"
                    style={{ minWidth: 100 }}
                  >
                    {loading === course.id
                      ? <div className="spinner" style={{ borderTopColor: 'var(--bg)', width: 14, height: 14 }} />
                      : 'Enroll now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust footer */}
        <div className="fade-up-3" style={{
          marginTop: '2rem',
          padding: '1rem 1.5rem',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex', justifyContent: 'center',
          flexWrap: 'wrap', gap: '2rem',
        }}>
          {[
            { icon: '🔒', text: 'Secured by Razorpay' },
            { icon: '♾️', text: 'Lifetime access' },
            { icon: '✅', text: 'KYC verified transactions' },
            { icon: '📱', text: 'Watch on any device' },
          ].map(({ icon, text }) => (
            <span key={text} style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{icon}</span>{text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
