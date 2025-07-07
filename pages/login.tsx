import React, { useState } from 'react';
import { useRouter } from 'next/router';  // <-- change here

const Login: React.FC = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // <-- change here

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('user', JSON.stringify({
        userid: data.userid,
        role: data.role,
        token: data.token,
      }));

      router.push('/'); // <-- use router.push instead of navigate
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="userid" className="form-label">User ID</label>
          <input
            type="text"
            id="userid"
            className="form-control"
            value={userid}
            onChange={e => setUserid(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
