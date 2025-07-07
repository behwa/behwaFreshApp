import React, { useEffect, useState } from 'react';
import TaskList from '../components/TaskList/TaskList';
// import CreateTask from '../CreateTask';
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

  // const fetchTasks = async () => {
  //   try {
  //     const res = await fetch('/api/tasks');
  //     if (!res.ok) throw new Error('Failed to fetch tasks');

  //     const data = await res.json();

  //     if (!Array.isArray(data)) return;

  //     const tasksWithCreatedBy = data.map((task: any) => ({
  //       ...task,
  //       createdby: task.createdby || 'Unknown',
  //     }));

  //     const sortedTasks = sortTasks(tasksWithCreatedBy, 'createdtime', 'desc');
  //     setTasks(sortedTasks);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  // handleDelete and handleBulkDelete same, update fetch URLs to relative '/api/tasks'

  return (
    <>
      <div className="container mt-4">
        {/* <TaskList tasks={tasks} onDelete={handleDelete} onBulkDelete={handleBulkDelete} /> */}
        <hr />
        {/* <CreateTask onCreated={fetchTasks} /> */}
      </div>
    </>
  );
}
