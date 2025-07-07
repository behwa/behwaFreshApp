// components/TaskList/taskUtils.ts
import { Task } from './TaskList';

export const sortTasks = (tasks: Task[], field: keyof Task | null, direction: 'asc' | 'desc'): Task[] => {
  if (!field) return tasks;

  return [...tasks].sort((a, b) => {
    const valA = a[field];
    const valB = b[field];

    if (field === 'createdtime') {
      const dateA = new Date(valA as string).getTime();
      const dateB = new Date(valB as string).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    // if (typeof valA === 'boolean' && typeof valB === 'boolean') {
    //   return direction === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    // }

    return 0;
  });
};

export const paginateTasks = (tasks: Task[], currentPage: number, pageSize: number): Task[] => {
  const start = (currentPage - 1) * pageSize;
  return tasks.slice(start, start + pageSize);
};

export const exportTasksToCSV = (tasks: Task[]) => {
  const headers = ['ID', 'Title', 'Description', 'Status', 'Created Time', 'Created By' ];
  const rows = tasks.map(t => [
    t.id,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    t.status,
  ]);
  const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'tasks.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
