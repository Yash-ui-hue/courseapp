import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const courses = [
  {
    id: 1,
    title: 'Web Development Bootcamp',
    subtitle: 'Full Stack',
    description: 'Master React, Node.js, PostgreSQL and build real-world full-stack applications from scratch.',
    price: 999,
    originalPrice: 2999,
    duration: '48 hours',
    lessons: 120,
    level: 'Beginner → Advanced',
    icon: '🌐',
    accent: '#7c6ef7',
    tags: ['React', 'Node.js', 'PostgreSQL', 'REST APIs'],
  },
  {
    id: 2,
    title: 'DSA Masterclass',
    subtitle: 'Algorithms',
    description: 'Crack any coding interview. Deep dive into data structures and algorithms with 200+ practice problems.',
    price: 499,
    originalPrice: 1499,
    duration: '36 hours',
    lessons: 95,
    level: 'Intermediate',
    icon: '⚡',
    accent: '#e05fff',
    tags: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
  },
  {
    id: 3,
    title: 'System Design Pro',
    subtitle: 'Architecture',
    description: 'Learn to design scalable systems like Netflix, Uber, and WhatsApp. For senior engineers.',
    price: 1299,
    originalPrice: 3999,
    duration: '28 hours',
    lessons: 72,
    level: 'Advanced',
    icon: '🏗️',
    accent: '#00d9c0',
    tags: ['Scalability', 'Microservices', 'Caching', 'Load Balancing'],
  },
];

export default function Payment() {
  const [loading, setLoading]     = useState(null);
  const [message, setMessage]     = useState('');
  const [user, setUser]           = useState(null);
  const navigate                  = useNavigate();

  useEffect(() => {
    API.get('/auth/me').then(res => setUser(res.data));
  }, []);

  const handlePayment = async (course) => {
    if (user?.kyc_status !== 'verified') {
      setMessage('kyc');
      return;
    }

    setLoading(course.id);
    setMessage('');

    try {
      const { data } = await API.post('/payment/create-order', { amount: course.price });

      const options = {
        key:         data.key_id,
        amount:      data.amount,
        currency:    data.currency,
        order_id:    data.order_id,
        name:        'CourseApp',
        description: course.title,
        handler: async (response) => {
          try {
            await API.post('/payment/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            navigate('/dashboard?payment=success');
          } catch {
            setMessage('error');
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: course.accent },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => setMessage('error'));
      rzp.open();

    } catch (err) {
      setMessage('error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="page">
      <div className="mesh-bg" />
      <Navbar />

      <div className="page-content" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: 13, color: '#7c6ef7', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 500, marginBottom: 8 }}>
            ✦ Curated Learning
          </p>
          <h1 style={{ fontSize: '2.2rem', color: '#f0effe', marginBottom: '0.5rem' }}>Browse Courses</h1>
          <p style={{ color: '#7f7f9a', fontSize: '15px' }}>
            Handpicked courses to accelerate your career. One-time payment, lifetime access.
          </p>
        </div>

        {/* Alerts */}
        {message === 'kyc' && (
          <div className="alert alert-warning fade-up">
            <span>🛡️</span>
            <span>
              Complete Aadhaar KYC before purchasing.{' '}
              <button onClick={() => navigate('/aadhaar')} style={{
                background: 'none', border: 'none', color: '#f59e0b',
                textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit',
              }}>Verify now →</button>
            </span>
          </div>
        )}
        {message === 'error' && (
          <div className="alert alert-error fade-up">
            ⚠ Payment failed. Please try again.
          </div>
        )}

        {/* Course cards grid */}
        <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {courses.map((course, i) => (
            <div key={course.id} style={{
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              transition: 'border-color .2s, transform .2s, box-shadow .2s',
              animationDelay: `${i * 0.08}s`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = course.accent + '44';
              e.currentTarget.style.transform   = 'translateY(-4px)';
              e.currentTarget.style.boxShadow   = `0 16px 48px ${course.accent}18`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.transform   = 'translateY(0)';
              e.currentTarget.style.boxShadow   = 'none';
            }}>

              {/* Card top accent bar */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${course.accent}, ${course.accent}88)` }} />

              <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Icon + subtitle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '12px',
                    background: course.accent + '18',
                    border: `1px solid ${course.accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>{course.icon}</div>
                  <span style={{
                    fontSize: 11, fontWeight: 500, color: course.accent,
                    background: course.accent + '15',
                    border: `1px solid ${course.accent}30`,
                    padding: '3px 10px', borderRadius: '99px',
                    textTransform: 'uppercase', letterSpacing: '.05em',
                  }}>{course.subtitle}</span>
                </div>

                {/* Title & desc */}
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#f0effe', marginBottom: '0.5rem', fontFamily: 'Clash Display, sans-serif' }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#7f7f9a', lineHeight: 1.6 }}>
                    {course.description}
                  </p>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {course.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, color: '#7f7f9a',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      padding: '3px 10px', borderRadius: '6px',
                    }}>{tag}</span>
                  ))}
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: 12, color: '#7f7f9a' }}>
                  <span>🕐 {course.duration}</span>
                  <span>📚 {course.lessons} lessons</span>
                  <span>📊 {course.level}</span>
                </div>

                {/* Divider */}
                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)' }} />

                {/* Price + CTA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f0effe', fontFamily: 'Clash Display, sans-serif' }}>
                      ₹{course.price.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 12, color: '#7f7f9a', textDecoration: 'line-through' }}>
                      ₹{course.originalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePayment(course)}
                    disabled={loading === course.id}
                    style={{
                      background: `linear-gradient(135deg, ${course.accent}, ${course.accent}bb)`,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: loading === course.id ? 'not-allowed' : 'pointer',
                      opacity: loading === course.id ? 0.6 : 1,
                      fontFamily: 'Sora, sans-serif',
                      transition: 'opacity .2s',
                      boxShadow: `0 4px 16px ${course.accent}40`,
                    }}
                  >
                    {loading === course.id ? 'Opening...' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="fade-up-3" style={{
          marginTop: '3rem',
          padding: '1.25rem 2rem',
          background: '#111118',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px',
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
        }}>
          {['🔒 Secure Payments via Razorpay', '🎓 Lifetime Access', '📱 Watch on any device', '✅ KYC Verified Transactions'].map(item => (
            <span key={item} style={{ fontSize: 13, color: '#7f7f9a' }}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
