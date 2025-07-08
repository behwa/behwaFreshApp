// pages/tasks/[id].tsx
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignee: string;
  createdtime?: string;
  createdby?: string;
}

const ViewTask: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        if (!res.ok) throw new Error('Task not found');
        const taskData = await res.json();
        setTask(taskData);
      } catch {
        setError('Failed to load task');
      }
    };

    fetchTask();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!task) return <p>Loading...</p>;

  return (
    <div
      className="p-5 mx-auto my-5"
      style={{
        maxWidth: '600px',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        color: 'white',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 className="text-center mb-4" style={{ fontWeight: '700', letterSpacing: '1.2px' }}>
        View Task
      </h2>

      <div className="mb-3"><strong>Title: {task.title}</strong></div>
      <div className="mb-3"><strong>Description: {task.description}</strong></div>
      <div className="mb-3"><strong>Assignee: {task.assignee}</strong></div>
      <div className="mb-3"><strong>Status: {task.status}</strong></div>
      <div className="mb-3"><strong>Created By: {task.createdby || 'Unknown'}</strong></div>
      <div className="mb-3"><strong>Created Time: {new Date(task.createdtime || '').toLocaleString()}</strong></div>

      <div className="text-center">
        <button
          className="btn btn-light mt-4"
          onClick={() => router.push('/')}
          style={{
            borderRadius: '30px',
            padding: '10px 30px',
            fontWeight: '600',
            boxShadow: '0 4px 10px rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            color: 'black',
            borderColor: 'black',
          }}
        >
          Back to Tasks
        </button>
      </div>
    </div>
  );
};

export default ViewTask;
