import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api/axios';

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading'); // loading | ok | fail

  useEffect(() => {
    API.get('/auth/me')
      .then(() => setStatus('ok'))
      .catch(() => setStatus('fail'));
  }, []);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'fail') return <Navigate to="/login" />;
  return children;
}