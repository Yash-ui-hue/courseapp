import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const [form,setForm]       = useState({email:'',password:''});
  const [error,setError]     = useState('');
  const [loading,setLoading] = useState(false);
  const navigate             = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await API.post('/auth/login',form); navigate('/dashboard'); }
    catch(err) { setError(err.response?.data?.message || 'Invalid email or password'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight:'100vh',background:'var(--bg)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem',
    }}>
      <div style={{width:'100%',maxWidth:380}}>

        {/* Logo + heading */}
        <div className="fade-up" style={{textAlign:'center',marginBottom:'1.75rem'}}>
          <div style={{
            width:36,height:36,borderRadius:10,
            background:'var(--bg3)',border:'1px solid var(--border2)',
            display:'flex',alignItems:'center',justifyContent:'center',
            margin:'0 auto 1rem',
          }}>
            <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="var(--muted)"/>
              <rect x="7" y="1" width="5" height="5" rx="1.5" fill="var(--muted)"/>
              <rect x="1" y="7" width="5" height="5" rx="1.5" fill="var(--muted)"/>
              <rect x="7" y="7" width="5" height="5" rx="1.5" fill="var(--text)"/>
            </svg>
          </div>
          <h1 style={{fontSize:'1.3rem',marginBottom:5}}>Welcome back</h1>
          <p style={{color:'var(--muted)',fontSize:13}}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="fade-up-1 card" style={{padding:'1.5rem'}}>
          {error && (
            <div className="alert alert-error" style={{marginBottom:'1rem'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0,marginTop:1}}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form,email:e.target.value})} required/>
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({...form,password:e.target.value})} required/>
            </div>
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading}
              style={{width:'100%',marginTop:2}}>
              {loading ? <div className="spinner"/> : 'Sign in'}
            </button>
          </form>

          <hr className="divider"/>

          <p style={{textAlign:'center',color:'var(--muted)',fontSize:13}}>
            No account?{' '}
            <Link to="/signup" style={{color:'var(--text)',fontWeight:600,textDecoration:'none'}}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
