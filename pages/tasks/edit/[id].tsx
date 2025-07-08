import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignee: string;
}

const EditTaskPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('Unknown');
  const [users, setUsers] = useState<string[]>([]);
  const [status, setStatus] = useState<Task['status']>('Pending');
  const [error, setError] = useState('');

  const isValidStatus = (val: any): val is Task['status'] =>
    ['Pending', 'In Progress', 'Completed'].includes(val);

  useEffect(() => {
    if (!id) return;

    const fetchTaskAndUsers = async () => {
      try {
        
        const taskRes = await fetch(`/api/tasks/${id}`);
        if (!taskRes.ok) throw new Error('Task not found');
        const taskData = await taskRes.json();

        setTask(taskData);
        setTitle(taskData.title);
        setDescription(taskData.description);
        setAssignee(taskData.assignee || 'Unknown');
        setStatus(isValidStatus(taskData.status) ? taskData.status : 'Pending');

        const user = localStorage.getItem('user');
        const token = user ? JSON.parse(user).token : null;

        if(token) {
          const usersRes = await fetch('/api/users', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (!usersRes.ok) throw new Error('Failed to fetch users');
          const usersData = await usersRes.json();

          setUsers(usersData.users.map((u: any) => u.name));
        }
      } catch (err) {
        setError('Failed to load task or users');
      }
    };

    fetchTaskAndUsers();
  }, [id]);

  const handleSave = async () => {
    try {
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null;

      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status, assignee }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Update failed');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className="p-5 mx-auto my-5" style={{
      maxWidth: '600px',
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(37, 117, 252, 0.4)',
      color: 'white',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <h2 className="text-center mb-4" style={{ fontWeight: '700', letterSpacing: '1.2px' }}>
        Edit Task
      </h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        {/* Title Field */}
        <div className="mb-4">
          <label htmlFor="editTitle" className="form-label">Task Title</label>
          <input
            id="editTitle"
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label htmlFor="editDescription" className="form-label">Task Description</label>
          <textarea
            id="editDescription"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        {/* Assignee Dropdown */}
        <div className="mb-4">
          <label htmlFor="editAssignee" className="form-label">Assignee</label>
          <select
            id="editAssignee"
            className="form-select"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            required
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="mb-4">
          <label htmlFor="editStatus" className="form-label">Status</label>
          <select
            id="editStatus"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-light">Save</button>
          <button type="button" className="btn btn-outline-light" onClick={() => router.push('/')}>
            Cancel
          </button>
        </div>

        {error && (
          <div className="mt-3 alert alert-danger text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default EditTaskPage;
