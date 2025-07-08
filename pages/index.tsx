import React, { useEffect, useState } from 'react';
import TaskList from '../components/TaskList/TaskList';
import CreateTask from '../components/CreateTask';
import { sortTasks } from '../components/TaskList/taskUtils';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdtime: string;
  createdby: string;
  assignee: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getToken = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return '';
    try {
      const user = JSON.parse(userStr);
      return user.token || '';
    } catch {
      return '';
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');

      const data = await res.json();

      if (!Array.isArray(data)) return;

      const tasksWithCreatedBy = data.map((task: any) => ({
        ...task,
        createdby: task.createdby || 'Unknown',
      }));

      console.log('gimme all my task', tasksWithCreatedBy)

      const sortedTasks = sortTasks(tasksWithCreatedBy, 'createdtime', 'desc');
      setTasks(sortedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      const token = getToken();

      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to delete task ${id}`);
    } catch (err) {
      console.error(err);
      fetchTasks(); // reload tasks on failure
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    setTasks((prev) => prev.filter((task) => !ids.includes(task.id)));

    try {
      const token = getToken();

      await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error(`Failed to delete task ${id}`);
        })
      );
    } catch (err) {
      console.error(err);
      fetchTasks(); // reload tasks on failure
    }
  };

  return (
    <div className="container mt-4">
      <TaskList tasks={tasks} onDelete={handleDelete} onBulkDelete={handleBulkDelete} />
      <hr />
      <CreateTask onCreated={fetchTasks} />
    </div>
  );
}
