import React, { useEffect, useState } from 'react';

interface CreateTaskProps {
  onCreated: () => void;
}

interface User {
  id: string;
  name: string;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('Unknown');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = localStorage.getItem('user');
        const token = user ? JSON.parse(user).token : null;

        if(token) {
          const res = await fetch('/api/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUsers(data.users); // assumes your API returns { users: [...] }
          } else {
            console.error('Failed to fetch users');
          }
        }

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;

    if (!token) {
      setMessage('You must be logged in to create a task.');
      setIsError(true);
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, assignee, status: 'Pending' }),
      });

      if (res.ok) {
        setMessage('Task created successfully!');
        setIsError(false);
        setTitle('');
        setDescription('');
        setAssignee('Unknown');
        onCreated();
      } else {
        setMessage('Failed to create task');
        setIsError(true);
      }
    } catch (err) {
      setMessage('Error creating task');
      setIsError(true);
    }
  };

  return (
    <div
      className="p-5 mx-auto my-5"
      style={{
        maxWidth: '600px',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(37, 117, 252, 0.4)',
        color: 'white',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 className="text-center mb-4" style={{ fontWeight: '700', letterSpacing: '1.2px' }}>
        Create Task
      </h2>

      <div className="text-end mb-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-sm btn-light"
          style={{
            borderRadius: '20px',
            fontWeight: '600',
            color: '#2575fc',
            backgroundColor: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          {isExpanded ? '− Minimize' : '+ Expand'}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="taskTitle" className="form-label" style={{ fontWeight: '600' }}>
              Task Title
            </label>
            <input
              id="taskTitle"
              type="text"
              className="form-control"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              style={{
                borderRadius: '12px',
                border: 'none',
                padding: '12px',
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
                fontSize: '1rem',
                transition: 'box-shadow 0.3s ease',
                color: '#222',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 8px #fff')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 8px rgba(0,0,0,0.2)')}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="taskDescription" className="form-label" style={{ fontWeight: '600' }}>
              Task Description
            </label>
            <textarea
              id="taskDescription"
              className="form-control"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              style={{
                borderRadius: '12px',
                border: 'none',
                padding: '12px',
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
                fontSize: '1rem',
                resize: 'vertical',
                transition: 'box-shadow 0.3s ease',
                color: '#222',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 8px #fff')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 8px rgba(0,0,0,0.2)')}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="taskAssignee" className="form-label" style={{ fontWeight: '600' }}>
              Assignee
            </label>
            <select
              id="taskAssignee"
              className="form-select"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              style={{
                borderRadius: '12px',
                padding: '12px',
                fontSize: '1rem',
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
                color: '#222',
              }}
            >
              <option value="Unknown">Unknown</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn"
              style={{
                background: 'white',
                color: '#2575fc',
                fontWeight: '700',
                borderRadius: '30px',
                padding: '12px',
                boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)',
                transition: 'background-color 0.3s ease, color 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2575fc';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 117, 252, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#2575fc';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.3)';
              }}
            >
              Create Task
            </button>
          </div>
        </form>
      )}

      {message && (
        <div
          className={`mt-3 alert ${isError ? 'alert-danger' : 'alert-success'}`}
          role="alert"
          style={{ borderRadius: '10px', textAlign: 'center', fontWeight: '600' }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default CreateTask;
