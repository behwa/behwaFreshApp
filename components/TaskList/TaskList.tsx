// components/TaskList/TaskList.tsx
import React, { useState, useMemo } from 'react';
import TaskToolbar from './TaskToolbar';
import TaskTable from './TaskTable';
import TaskPagination from './TaskPagination';
import { sortTasks, paginateTasks, exportTasksToCSV } from './taskUtils';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdtime: string;
  createdby: string;
  assignee: string;
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onBulkDelete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [searchTerm, setSearchTerm] = useState('');
  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    const lower = searchTerm.toLowerCase();
    return tasks.filter(t =>
      t.title.toLowerCase().includes(lower) ||
      t.description.toLowerCase().includes(lower) ||
      t.status.toLowerCase().includes(lower) ||
      t.createdby.toLowerCase().includes(lower)
    );
  }, [tasks, searchTerm]);


  const sortedTasks = useMemo(() => sortTasks(filteredTasks, sortField, sortDirection), [filteredTasks, sortField, sortDirection]);
  const pagedTasks = useMemo(() => paginateTasks(sortedTasks, currentPage, pageSize), [sortedTasks, currentPage, pageSize]);
  const totalPages = Math.ceil(tasks.length / pageSize);

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select ALL task IDs (all pages)
      const allIds = tasks.map(t => t.id);
      setSelectedIds(allIds);
    } else {
      // Clear all selections
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedIds);
    setSelectedIds([]);
  };

  const handleExport = () => {
    const selectedTasks = tasks.filter(t => selectedIds.includes(t.id));
    exportTasksToCSV(selectedTasks);
  };

  return (
    <div className="container" style={{ maxWidth: '1400px', margin: '1rem auto' }}>
      <h2 className="mb-4 text-center">Task List</h2>
      <TaskToolbar
        pageSize={pageSize}
        setPageSize={setPageSize}
        selectedCount={selectedIds.length}
        onBulkDelete={handleBulkDelete}
        onDownload={handleExport}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <TaskTable
        tasks={pagedTasks}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        toggleSelectAll={toggleSelectAll}
        onDelete={onDelete}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <TaskPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default TaskList;
