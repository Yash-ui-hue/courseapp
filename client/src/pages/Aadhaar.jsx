import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function Aadhaar() {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp]                     = useState('');
  const [referenceId, setReferenceId]     = useState(null);
  const [step, setStep]                   = useState(1);
  const [status, setStatus]               = useState('');
  const [loading, setLoading]             = useState(false);
  const navigate                          = useNavigate();

  const formatAadhaar = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    );
  };

  const rawDigits = aadhaarNumber.replace(/\s/g, '');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setStatus('');
    try {
      const res = await API.post('/aadhaar/send-otp', { aadhaar_number: rawDigits });
      setReferenceId(res.data.reference_id);
      setStep(2); setStatus('sent');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setStatus('');
    try {
      await API.post('/aadhaar/verify-otp', { otp, reference_id: referenceId });
      navigate('/dashboard?kyc=success');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <Navbar />
      <div style={{
        maxWidth: 440, margin: '0 auto', padding: '3rem 1.5rem',
      }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.35rem', marginBottom: 6 }}>Verify your Aadhaar</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>
            Required to purchase courses. Your data is encrypted and never stored in plain text.
          </p>
        </div>

        {/* Step indicator */}
        <div className="fade-up-1" style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '1.75rem' }}>
          {['Enter Aadhaar', 'Verify OTP'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: step > i ? 'var(--text)' : step === i + 1 ? 'var(--text)' : 'var(--bg3)',
                  color: step >= i + 1 ? 'var(--bg)' : 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600, marginBottom: 5,
                }}>
                  {step > i + 1
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : i + 1}
                </div>
                <span style={{ fontSize: 11, color: step === i + 1 ? 'var(--text)' : 'var(--subtle)', fontWeight: step === i + 1 ? 500 : 400 }}>{label}</span>
              </div>
              {i < 1 && (
                <div style={{
                  flex: 1, height: 1,
                  background: step > 1 ? 'var(--text)' : 'var(--border)',
                  margin: '0 8px', marginBottom: 20,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="fade-up-2 card" style={{ padding: '1.5rem' }}>

          {status === 'sent' && (
            <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              OTP sent. Enter any digits for this demo.
            </div>
          )}
          {status && status !== 'sent' && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {status}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Aadhaar number</label>
                <input
                  className="input"
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaarNumber}
                  onChange={e => setAadhaarNumber(formatAadhaar(e.target.value))}
                  maxLength={14}
                  style={{ fontSize: 16, letterSpacing: '0.1em', textAlign: 'center' }}
                />
                <p style={{ fontSize: 11, color: 'var(--subtle)', marginTop: 5 }}>
                  We only store the last 4 digits. Your data is not shared with third parties.
                </p>
              </div>
              <button className="btn btn-primary btn-lg" type="submit"
                disabled={loading || rawDigits.length !== 12} style={{ width: '100%' }}>
                {loading ? <div className="spinner" style={{ borderTopColor: 'var(--bg)' }} /> : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">One-time password</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Enter OTP"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ fontSize: 18, letterSpacing: '0.3em', textAlign: 'center' }}
                  autoFocus
                />
                <p style={{ fontSize: 11, color: 'var(--subtle)', marginTop: 5 }}>
                  Sent to the mobile number registered with your Aadhaar.
                </p>
              </div>
              <button className="btn btn-primary btn-lg" type="submit"
                disabled={loading || otp.length < 4} style={{ width: '100%' }}>
                {loading ? <div className="spinner" style={{ borderTopColor: 'var(--bg)' }} /> : 'Verify'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setStep(1); setStatus(''); }}
                style={{ width: '100%' }}>
                ← Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
