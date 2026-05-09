import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function Aadhaar() {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp]                     = useState('');
  const [referenceId, setReferenceId]     = useState(null);
  const [step, setStep]                   = useState(1);
  const [message, setMessage]             = useState('');
  const [loading, setLoading]             = useState(false);
  const navigate                          = useNavigate();

  const formatAadhaar = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(\d{4})(\d{4})?(\d{4})?/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    );
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const raw = aadhaarNumber.replace(/\s/g, '');
      const res = await API.post('/aadhaar/send-otp', { aadhaar_number: raw });
      setReferenceId(res.data.reference_id);
      setStep(2);
      setMessage('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await API.post('/aadhaar/verify-otp', { otp, reference_id: referenceId });
      navigate('/dashboard?kyc=success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const rawDigits = aadhaarNumber.replace(/\s/g, '');

  return (
    <div className="page">
      <div className="mesh-bg" />
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* Header */}
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '16px',
              background: 'linear-gradient(135deg, #00d9c0, #7c6ef7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, margin: '0 auto 1rem',
              boxShadow: '0 8px 28px rgba(0,217,192,0.3)',
            }}>🛡️</div>
            <h1 style={{ fontSize: '1.8rem', color: '#f0effe', marginBottom: '0.4rem' }}>Verify Aadhaar</h1>
            <p style={{ color: '#7f7f9a', fontSize: '14px' }}>Secure identity verification powered by UIDAI</p>
          </div>

          {/* Step indicator */}
          <div className="fade-up-1" style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: 0 }}>
            {['Enter Aadhaar', 'Verify OTP'].map((label, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: step > i ? 'linear-gradient(135deg, #7c6ef7, #e05fff)' : step === i + 1 ? 'linear-gradient(135deg, #7c6ef7, #e05fff)' : 'rgba(255,255,255,0.07)',
                    border: step === i + 1 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 600, color: step >= i + 1 ? '#fff' : '#7f7f9a',
                    marginBottom: 6,
                  }}>{step > i + 1 ? '✓' : i + 1}</div>
                  <span style={{ fontSize: 11, color: step === i + 1 ? '#7c6ef7' : '#7f7f9a', textAlign: 'center' }}>{label}</span>
                </div>
                {i < 1 && <div style={{ flex: 1, height: 1, background: step > 1 ? '#7c6ef7' : 'rgba(255,255,255,0.07)', margin: '0 8px', marginBottom: 20 }} />}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="fade-up-2 card" style={{ padding: '2rem' }}>

            {/* Alerts */}
            {message === 'success' && (
              <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
                ✅ OTP sent! Enter any digits for this demo.
              </div>
            )}
            {message && message !== 'success' && (
              <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                ⚠ {message}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                <label className="label">Aadhaar Number</label>
                <input
                  className="input"
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaarNumber}
                  onChange={e => setAadhaarNumber(formatAadhaar(e.target.value))}
                  maxLength={14}
                  style={{ fontSize: '1.1rem', letterSpacing: '0.15em', textAlign: 'center' }}
                />
                <p style={{ fontSize: 12, color: '#7f7f9a', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                  🔒 Your data is encrypted and never stored in plain text
                </p>
                <button className="btn btn-primary" type="submit"
                  disabled={loading || rawDigits.length !== 12}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  {loading ? 'Sending OTP...' : 'Send OTP →'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <label className="label">Enter OTP</label>
                <input
                  className="input"
                  type="text"
                  placeholder="• • • • • •"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ fontSize: '1.5rem', letterSpacing: '0.5em', textAlign: 'center' }}
                />
                <p style={{ fontSize: 12, color: '#7f7f9a', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                  OTP sent to your Aadhaar-registered mobile number
                </p>
                <button className="btn btn-primary" type="submit"
                  disabled={loading || otp.length < 4}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', marginBottom: '0.75rem' }}>
                  {loading ? 'Verifying...' : 'Verify OTP →'}
                </button>
                <button type="button" onClick={() => { setStep(1); setMessage(''); }}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center' }}>
                  ← Back
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
