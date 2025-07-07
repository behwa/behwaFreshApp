import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/saveData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage('Data saved successfully!');
        setName('');
        setEmail('');
      } else {
        setMessage('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setMessage('Fetch error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h1>Save User Data</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%' }}>
          Save
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
