import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Signup: React.FC = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use relative path to call Next.js API route inside this app
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: userid.trim(), password, role }),
      });

      const data = await res.json();
      console.log('Signup response:', data);

      if (!res.ok) {
        setError(data.message || 'Signup failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify({
        userid: data.userid,
        role: data.role,
        token: data.token,
      }));

      router.push('/'); // Redirect after signup

    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h2>Sign Up</h2>
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

        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            className="form-select"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="zookeeper">Zookeeper</option>
            <option value="veterinarian">Veterinarian</option>
            <option value="guide">Guide</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security</option>
            <option value="receptionist">Receptionist</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
